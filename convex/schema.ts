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
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
