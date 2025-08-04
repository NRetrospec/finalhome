"use node";

import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2025-06-30.basil",
});

export const createCheckoutSession = action({
  args: {
    serviceId: v.string(),
    serviceName: v.string(),
    price: v.number(),
    isRecurring: v.optional(v.boolean()),
    customerEmail: v.optional(v.string()),
    customerName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Stripe secret key not configured");
    }
    
    try {
      if (!process.env.CONVEX_SITE_URL) {
        throw new Error("CONVEX_SITE_URL environment variable not configured");
      }
      const baseUrl = process.env.CONVEX_SITE_URL;
      
      // Create line item based on service type
      const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
        price_data: {
          currency: "usd",
          product_data: {
            name: args.serviceName,
            description: getServiceDescription(args.serviceId),
          },
          unit_amount: args.price * 100, // Convert to cents
          ...(args.isRecurring && {
            recurring: {
              interval: "month",
            },
          }),
        },
        quantity: 1,
      };

      const sessionParams: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: ["card"],
        line_items: [lineItem],
        mode: args.isRecurring ? "subscription" : "payment",
        success_url: `${baseUrl}?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}?canceled=true`,
        metadata: {
          serviceId: args.serviceId,
          serviceName: args.serviceName,
        },
      };

      // Add customer email if provided
      if (args.customerEmail) {
        sessionParams.customer_email = args.customerEmail;
      }

      const session = await stripe.checkout.sessions.create(sessionParams);

      return {
        sessionId: session.id,
        url: session.url,
      };
    } catch (error) {
      console.error("Stripe checkout error:", error);
      throw new Error("Failed to create checkout session");
    }
  },
});

export const verifyPayment = action({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Stripe secret key not configured");
    }
    
    try {
      const session = await stripe.checkout.sessions.retrieve(args.sessionId);
      
      if (session.payment_status === "paid") {
        // Store the successful payment in the database
        await ctx.runMutation(internal.payments.recordPayment, {
          sessionId: args.sessionId,
          customerEmail: session.customer_email || "",
          serviceName: session.metadata?.serviceName || "",
          amount: session.amount_total || 0,
          paymentStatus: session.payment_status,
        });

        return {
          success: true,
          customerEmail: session.customer_email,
          serviceName: session.metadata?.serviceName,
          amount: session.amount_total,
        };
      }

      return { success: false };
    } catch (error) {
      console.error("Payment verification error:", error);
      throw new Error("Failed to verify payment");
    }
  },
});

function getServiceDescription(serviceId: string): string {
  const descriptions: Record<string, string> = {
    "website": "Full stack website development with hosting setup, responsive design, and modern framework implementation.",
    "website-logo": "Complete website development package including custom logo design, brand guidelines, and all website features.",
    "basic-maintenance": "Monthly website maintenance including security updates, content updates (2 hrs), and basic monitoring.",
    "pro-maintenance": "Enhanced monthly maintenance with performance reports, SEO monitoring, and content updates (5 hrs).",
    "oncall-maintenance": "Premium 24/7 support with unlimited updates, custom development, and dedicated account management.",
  };
  
  return descriptions[serviceId] || "Professional web development service";
}
