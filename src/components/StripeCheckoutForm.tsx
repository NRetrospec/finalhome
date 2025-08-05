import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface StripeCheckoutFormProps {
  serviceData: any;
  customerInfo: { name: string; email: string };
  onSuccess: () => void;
  onCancel: () => void;
}

export function StripeCheckoutForm({
  serviceData,
  customerInfo,
  onSuccess,
  onCancel
}: StripeCheckoutFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stripeReady, setStripeReady] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const createPaymentIntent = useAction(api.stripe.createPaymentIntent);
  const recordPayment = useAction(api.payments.recordPaymentFromIntent);

  useEffect(() => {
    if (stripe && elements) {
      setStripeReady(true);
    } else {
      setStripeReady(false);
    }
  }, [stripe, elements]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError("Payment system is not ready. Please try again.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Step 1: Create Payment Intent on backend
      const paymentIntentResult = await createPaymentIntent({
        serviceId: serviceData.tier ? 
          `${serviceData.id}-${serviceData.tier.id}` : 
          serviceData.id,
        serviceName: serviceData.tier ? 
          `${serviceData.title} + ${serviceData.tier.title}` : 
          serviceData.title,
        price: serviceData.combinedPrice || serviceData.price,
        customerEmail: customerInfo.email,
        customerName: customerInfo.name
      });

      if (!paymentIntentResult.clientSecret) {
        throw new Error("Failed to create PaymentIntent. Please try again.");
      }

      // Step 2: Confirm card payment
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card input not available. Please refresh the page.");
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        paymentIntentResult.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: customerInfo.name,
              email: customerInfo.email
            }
          }
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message || "Payment failed. Please check your card details.");
      }

      if (paymentIntent?.status === "succeeded") {
        toast.success("Payment successful! Your service is now active.");
        onSuccess();
      } else {
        throw new Error("Payment did not complete successfully.");
      }
    } catch (err) {
      const message = (err as Error).message || "An unexpected error occurred. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="cyber-card p-6">
      <h3 className="text-xl font-semibold text-cyan-400 mb-4">
        Complete Payment
      </h3>
      
      {!stripeReady ? (
        <div className="text-center py-4">
          <div className="text-gray-300 mb-2">Loading payment system...</div>
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#fff",
                    "::placeholder": {
                      color: "#a0aec0"
                    }
                  }
                }
              }}
            />
          </div>
          
          {error && <div className="text-red-500 text-sm">{error}</div>}
          
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 neon-button neon-button-cyan"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Pay Now"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}