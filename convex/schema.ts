import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  consultations: defineTable({
    name: v.string(),
    email: v.string(),
    message: v.string(),
    service: v.optional(v.string()),
    submittedAt: v.number(),
  }),
  
  serviceSelections: defineTable({
    service: v.string(),
    tier: v.optional(v.string()),
    customerEmail: v.string(),
    customerName: v.string(),
    price: v.number(),
    selectedAt: v.number(),
  }),

  payments: defineTable({
    sessionId: v.string(),
    customerEmail: v.string(),
    serviceName: v.string(),
    amount: v.number(),
    paymentStatus: v.string(),
    createdAt: v.number(),
  }).index("by_session", ["sessionId"]),

  agreements: defineTable({
    code: v.string(),
    clientName: v.string(),
    agreementType: v.union(v.literal("standard"), v.literal("discounted")),
    price: v.string(),
    timeline: v.string(),
    hourlyRate: v.optional(v.string()),
    customNotes: v.optional(v.string()),
    techStack: v.optional(v.array(v.string())),
    revisions: v.optional(v.string()),
    status: v.union(v.literal("pending"), v.literal("signed")),
    signature: v.optional(v.string()),
    signatureType: v.optional(v.union(v.literal("drawn"), v.literal("typed"))),
    signedAt: v.optional(v.number()),
    signerIp: v.optional(v.string()),
    signerUserAgent: v.optional(v.string()),
    createdAt: v.number(),
    expiresAt: v.optional(v.number()),
  }).index("by_code", ["code"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
