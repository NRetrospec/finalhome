import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAgreementByCode = query({
  args: { code: v.string() },
  handler: async (ctx, { code }) => {
    return await ctx.db
      .query("agreements")
      .withIndex("by_code", (q) => q.eq("code", code))
      .first();
  },
});

export const submitSignedAgreement = mutation({
  args: {
    code: v.string(),
    signature: v.string(),
    signatureType: v.union(v.literal("drawn"), v.literal("typed")),
    signedAt: v.number(),
    signerIp: v.optional(v.string()),
    signerUserAgent: v.optional(v.string()),
  },
  handler: async (ctx, { code, signature, signatureType, signedAt, signerIp, signerUserAgent }) => {
    const agreement = await ctx.db
      .query("agreements")
      .withIndex("by_code", (q) => q.eq("code", code))
      .first();

    if (!agreement) throw new Error("Agreement not found");
    if (agreement.status === "signed") throw new Error("Agreement already signed");
    if (agreement.expiresAt && Date.now() > agreement.expiresAt) {
      throw new Error("This agreement code has expired");
    }

    await ctx.db.patch(agreement._id, {
      signature,
      signatureType,
      signedAt,
      signerIp,
      signerUserAgent,
      status: "signed",
    });

    return { success: true };
  },
});

export const createAgreement = mutation({
  args: {
    adminSecret: v.string(),
    code: v.string(),
    clientName: v.string(),
    agreementType: v.union(v.literal("standard"), v.literal("discounted")),
    price: v.string(),
    timeline: v.string(),
    hourlyRate: v.optional(v.string()),
    customNotes: v.optional(v.string()),
    expiresAt: v.optional(v.number()),
  },
  handler: async (ctx, { adminSecret, ...data }) => {
    const secret = process.env.ADMIN_SECRET;
    if (!secret) throw new Error("ADMIN_SECRET not configured");
    if (adminSecret !== secret) throw new Error("Unauthorized");
    if (!/^\d{6}$/.test(data.code)) throw new Error("Code must be exactly 6 digits");

    const existing = await ctx.db
      .query("agreements")
      .withIndex("by_code", (q) => q.eq("code", data.code))
      .first();
    if (existing) throw new Error("Code already in use");

    return await ctx.db.insert("agreements", {
      ...data,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

export const listAgreements = query({
  args: { adminSecret: v.string() },
  handler: async (ctx, { adminSecret }) => {
    const secret = process.env.ADMIN_SECRET;
    if (!secret || adminSecret !== secret) return null;
    return await ctx.db.query("agreements").order("desc").collect();
  },
});

export const deleteAgreement = mutation({
  args: { adminSecret: v.string(), agreementId: v.id("agreements") },
  handler: async (ctx, { adminSecret, agreementId }) => {
    const secret = process.env.ADMIN_SECRET;
    if (!secret) throw new Error("ADMIN_SECRET not configured");
    if (adminSecret !== secret) throw new Error("Unauthorized");
    await ctx.db.delete(agreementId);
  },
});
