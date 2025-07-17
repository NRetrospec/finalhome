import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";

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
