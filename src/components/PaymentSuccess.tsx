import { useEffect, useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface PaymentSuccessProps {
  sessionId: string;
  onClose: () => void;
  redirectHome: () => void;
}

interface PaymentData {
  success: boolean;
  customerEmail?: string;
  serviceName?: string;
  amount?: number;
}

export function PaymentSuccess({ sessionId, onClose, redirectHome }: PaymentSuccessProps) {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const verifyPayment = useAction(api.stripe.verifyPayment);

  useEffect(() => {
    if (!sessionId) return;

    const verify = async () => {
      try {
        const result = await verifyPayment({ sessionId });
        setPaymentData(result);

        if (result.success) {
          toast.success("Payment verified successfully");
          
          // Redirect to home after a short delay
          setTimeout(() => {
            redirectHome();
          }, 4000);
        } else {
          toast.error("Payment could not be verified");
        }
      } catch (error) {
        console.error("Payment verification failed:", error);
        toast.error("An error occurred during payment verification");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [sessionId, verifyPayment, redirectHome]);

  if (loading) {
    return (
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        role="dialog"
        aria-modal="true"
      >
        <div className="cyber-card max-w-md mx-4">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-300">Verifying your payment...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="cyber-card max-w-md mx-4">
        <div className="text-center">
          {paymentData?.success ? (
            <>
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-green-400 mb-4">
                Payment Successful!
              </h2>
              <p className="text-gray-300 mb-4">
                Thank you for your purchase of{" "}
                <span className="text-cyan-400 font-semibold">
                  {paymentData.serviceName}
                </span>
              </p>
              <p className="text-gray-300 mb-6">
                We'll send a confirmation email to{" "}
                <span className="text-purple-400">
                  {paymentData.customerEmail}
                </span>{" "}
                and get started on your project right away!
              </p>
              <button
                onClick={redirectHome}
                className="neon-button neon-button-cyan w-full"
              >
                Go to Homepage Now
              </button>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-2xl font-bold text-red-400 mb-4">
                Payment Failed
              </h2>
              <p className="text-gray-300 mb-6">
                There was an issue processing your payment. Please try again or
                contact support.
              </p>
              <button
                onClick={onClose}
                className="neon-button neon-button-purple w-full"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
