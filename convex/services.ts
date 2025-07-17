import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const submitConsultation = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),
    service: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("consultations", {
      ...args,
      submittedAt: Date.now(),
    });
    return { success: true };
  },
});

export const selectService = mutation({
  args: {
    service: v.string(),
    tier: v.optional(v.string()),
    customerEmail: v.string(),
    customerName: v.string(),
    price: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("serviceSelections", {
      ...args,
      selectedAt: Date.now(),
    });
    return { success: true };
  },
});

export const getConsultations = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("consultations").order("desc").collect();
  },
});
