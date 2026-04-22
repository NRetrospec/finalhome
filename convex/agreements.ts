import { v } from "convex/values";
import { mutation, query, action, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";

export const getAgreementByCode = query({
  args: { code: v.string() },
  handler: async (ctx, { code }) => {
    return await ctx.db
      .query("agreements")
      .withIndex("by_code", (q) => q.eq("code", code))
      .first();
  },
});

export const _getByCode = internalQuery({
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

export const sendAgreementEmail = action({
  args: { code: v.string(), pdfBase64: v.optional(v.string()) },
  handler: async (ctx, { code, pdfBase64 }) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("RESEND_API_KEY not configured — skipping email");
      return;
    }

    const agreement = await ctx.runQuery(internal.agreements._getByCode, { code });
    if (!agreement) return;

    const signedDate = agreement.signedAt
      ? new Date(agreement.signedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Unknown";

    const techStackRow =
      agreement.techStack?.length
        ? `<tr><td style="padding:8px 0;color:#6b7280;font-size:14px;vertical-align:top">Tech Stack</td><td style="padding:8px 0">${agreement.techStack.join(", ")}</td></tr>`
        : "";

    const revisionsRow = agreement.revisions
      ? `<tr><td style="padding:8px 0;color:#6b7280;font-size:14px">Revisions</td><td style="padding:8px 0">${agreement.revisions} rounds</td></tr>`
      : "";

    const html = `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f5f5f5">
<div style="background:#111827;color:white;padding:24px;border-radius:12px;margin-bottom:16px">
  <h1 style="margin:0;font-size:22px;color:#22d3ee">Agreement Signed ✓</h1>
  <p style="margin:6px 0 0;color:#9ca3af;font-size:14px">N Retrospec — Service Agreement</p>
</div>
<div style="background:white;padding:24px;border-radius:12px;margin-bottom:16px">
  <table style="width:100%;border-collapse:collapse">
    <tr><td style="padding:8px 0;color:#6b7280;font-size:14px">Client</td><td style="padding:8px 0;font-weight:bold">${agreement.clientName}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;font-size:14px">Code</td><td style="padding:8px 0;font-family:monospace">${agreement.code}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;font-size:14px">Type</td><td style="padding:8px 0;text-transform:capitalize">${agreement.agreementType}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;font-size:14px">Price</td><td style="padding:8px 0">${agreement.price}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;font-size:14px">Timeline</td><td style="padding:8px 0">${agreement.timeline}</td></tr>
    ${techStackRow}${revisionsRow}
    <tr><td style="padding:8px 0;color:#6b7280;font-size:14px">Signed At</td><td style="padding:8px 0">${signedDate}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;font-size:14px">Signer IP</td><td style="padding:8px 0;font-family:monospace;font-size:13px">${agreement.signerIp ?? "Unknown"}</td></tr>
  </table>
</div>
${pdfBase64 ? `<p style="color:#6b7280;font-size:12px;text-align:center">The signed agreement PDF is attached.</p>` : ""}
</body></html>`;

    const fromEmail = process.env.RESEND_FROM_EMAIL ?? "agreements@nretrospec.com";

    const payload: Record<string, unknown> = {
      from: `N Retrospec <${fromEmail}>`,
      to: ["nretrobot5@gmail.com"],
      subject: `Agreement Signed — ${agreement.clientName} (#${agreement.code})`,
      html,
    };

    if (pdfBase64) {
      payload.attachments = [
        { filename: `agreement-${agreement.code}.pdf`, content: pdfBase64 },
      ];
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("Resend API error:", await res.text());
    }
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
    techStack: v.optional(v.array(v.string())),
    revisions: v.optional(v.string()),
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
