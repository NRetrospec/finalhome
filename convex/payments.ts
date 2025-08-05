import { mutation, query, internalMutation, action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import Stripe from "stripe";

export const recordPayment = internalMutation({
  args: {
    sessionId: v.string(),
    customerEmail: v.string(),
    serviceName: v.string(),
    amount: v.number(),
    paymentStatus: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("payments", {
      sessionId: args.sessionId,
      customerEmail: args.customerEmail,
      serviceName: args.serviceName,
      amount: args.amount,
      paymentStatus: args.paymentStatus,
      createdAt: Date.now(),
    });
  },
});

export const recordPaymentFromIntent = action({
  args: {
    paymentIntentId: v.string(),
  },
  handler: async (ctx, args) => {
    // In a real implementation, we would retrieve payment details from Stripe
    // For now, we'll record with placeholder values since we don't have the full Stripe integration
    await ctx.runMutation(internal.payments.recordPayment, {
      sessionId: args.paymentIntentId,
      customerEmail: "payment@example.com",
      serviceName: "Service from Payment Intent",
      amount: 0.50,
      paymentStatus: "succeeded",
    });
    
    return { success: true };
  },
});

export const getPayments = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("payments").order("desc").collect();
  },
});

export const getPaymentBySession = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("payments")
      .filter((q) => q.eq(q.field("sessionId"), args.sessionId))
      .first();
  },
});
