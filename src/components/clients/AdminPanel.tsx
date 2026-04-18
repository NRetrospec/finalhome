import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../../convex/_generated/dataModel";

interface AdminPanelProps {
  onClose: () => void;
}

const DEFAULT_PRICES = { standard: "$1,000", discounted: "$100" };

export function AdminPanel({ onClose }: AdminPanelProps) {
  const [adminSecret, setAdminSecret] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"create" | "list">("create");

  const [form, setForm] = useState({
    code: "",
    clientName: "",
    agreementType: "standard" as "standard" | "discounted",
    price: "",
    timeline: "",
    hourlyRate: "",
    customNotes: "",
  });

  const agreements = useQuery(
    api.agreements.listAgreements,
    isAuthenticated ? { adminSecret } : "skip"
  );

  const createAgreement = useMutation(api.agreements.createAgreement);
  const deleteAgreement = useMutation(api.agreements.deleteAgreement);

  const handleAuth = () => {
    if (!adminSecret.trim()) {
      toast.error("Please enter the admin password.");
      return;
    }
    setIsAuthenticated(true);
  };

  const generateCode = () => {
    setForm((f) => ({ ...f, code: Math.floor(100000 + Math.random() * 900000).toString() }));
  };

  const handleTypeChange = (type: "standard" | "discounted") => {
    setForm((f) => ({
      ...f,
      agreementType: type,
      price: f.price === DEFAULT_PRICES[f.agreementType] || f.price === "" ? DEFAULT_PRICES[type] : f.price,
    }));
  };

  const handleCreate = async () => {
    if (!form.code || !form.clientName || !form.price || !form.timeline) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!/^\d{6}$/.test(form.code)) {
      toast.error("Code must be exactly 6 digits.");
      return;
    }
    try {
      await createAgreement({
        adminSecret,
        code: form.code,
        clientName: form.clientName,
        agreementType: form.agreementType,
        price: form.price,
        timeline: form.timeline,
        hourlyRate: form.hourlyRate || undefined,
        customNotes: form.customNotes || undefined,
      });
      toast.success(`Agreement created! Code: ${form.code}`);
      setForm({
        code: "",
        clientName: "",
        agreementType: "standard",
        price: "",
        timeline: "",
        hourlyRate: "",
        customNotes: "",
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create agreement");
    }
  };

  const handleDelete = async (id: Id<"agreements">, clientName: string) => {
    if (!confirm(`Delete agreement for ${clientName}?`)) return;
    try {
      await deleteAgreement({ adminSecret, agreementId: id });
      toast.success("Agreement deleted");
    } catch {
      toast.error("Failed to delete agreement");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-sm">
          <div className="bg-gray-900/60 backdrop-blur-md border border-purple-500/20 rounded-2xl p-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/30 mb-5">
              <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">Admin Portal</h2>
            <p className="text-gray-500 text-sm mb-6">Enter your admin password to manage agreements.</p>
            <input
              type="password"
              value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAuth()}
              placeholder="Admin password"
              className="w-full px-4 py-3 rounded-xl bg-gray-800/60 border border-gray-600/50 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/70 mb-4"
            />
            <button
              onClick={handleAuth}
              className="w-full py-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-semibold transition-colors mb-3"
            >
              Enter
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              ← Back to Client Portal
            </button>
          </div>
          <p className="text-center text-gray-700 text-xs mt-4">
            N Retrospec 
          </p>
        </div>
      </div>
    );
  }

  if (agreements === null) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <h2 className="text-white font-semibold mb-2">Incorrect Password</h2>
          <button
            onClick={() => { setIsAuthenticated(false); setAdminSecret(""); }}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
            <p className="text-gray-500 text-sm">Manage client service agreements</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 text-sm transition-colors flex items-center gap-1"
          >
            ← Client Portal
          </button>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl overflow-hidden border border-gray-700/50 mb-6">
          <button
            onClick={() => setActiveTab("create")}
            className={`flex-1 py-3 font-medium text-sm transition-colors ${
              activeTab === "create" ? "bg-purple-500/20 text-purple-400" : "text-gray-400 hover:text-gray-300"
            }`}
          >
            + New Agreement
          </button>
          <button
            onClick={() => setActiveTab("list")}
            className={`flex-1 py-3 font-medium text-sm transition-colors ${
              activeTab === "list" ? "bg-purple-500/20 text-purple-400" : "text-gray-400 hover:text-gray-300"
            }`}
          >
            All Agreements {agreements !== undefined && `(${agreements.length})`}
          </button>
        </div>

        {activeTab === "create" && (
          <div className="bg-gray-900/60 backdrop-blur-md border border-purple-500/20 rounded-2xl p-6 space-y-5">
            {/* Agreement type */}
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Agreement Type</label>
              <div className="flex gap-3">
                {(["standard", "discounted"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleTypeChange(type)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                      form.agreementType === type
                        ? type === "standard"
                          ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-400"
                          : "bg-purple-500/20 border-purple-500/40 text-purple-400"
                        : "bg-gray-800/40 border-gray-700/40 text-gray-400 hover:text-gray-300"
                    }`}
                  >
                    {type === "standard" ? "Standard ($1,000)" : "Discounted ($100)"}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Access code */}
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Access Code *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.replace(/\D/g, "").slice(0, 6) }))}
                    placeholder="000000"
                    maxLength={6}
                    className="flex-1 px-3 py-2.5 rounded-lg bg-gray-800/60 border border-gray-600/50 text-white text-sm font-mono focus:outline-none focus:border-purple-500/70"
                  />
                  <button
                    onClick={generateCode}
                    className="px-3 py-2.5 rounded-lg bg-gray-700/60 hover:bg-gray-700 text-gray-300 text-xs transition-colors border border-gray-600/30"
                    title="Auto-generate"
                  >
                    Auto
                  </button>
                </div>
                <p className="text-gray-600 text-xs mt-1">Can match invoice number</p>
              </div>

              {/* Client name */}
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Client Name *</label>
                <input
                  type="text"
                  value={form.clientName}
                  onChange={(e) => setForm((f) => ({ ...f, clientName: e.target.value }))}
                  placeholder="John Smith"
                  className="w-full px-3 py-2.5 rounded-lg bg-gray-800/60 border border-gray-600/50 text-white text-sm focus:outline-none focus:border-purple-500/70"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Price */}
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Price *</label>
                <input
                  type="text"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder={DEFAULT_PRICES[form.agreementType]}
                  className="w-full px-3 py-2.5 rounded-lg bg-gray-800/60 border border-gray-600/50 text-white text-sm focus:outline-none focus:border-purple-500/70"
                />
              </div>

              {/* Timeline */}
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Timeline *</label>
                <input
                  type="text"
                  value={form.timeline}
                  onChange={(e) => setForm((f) => ({ ...f, timeline: e.target.value }))}
                  placeholder="2–3 weeks"
                  className="w-full px-3 py-2.5 rounded-lg bg-gray-800/60 border border-gray-600/50 text-white text-sm focus:outline-none focus:border-purple-500/70"
                />
              </div>
            </div>

            {form.agreementType === "standard" && (
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">
                  Hourly Rate for Extra Revisions
                </label>
                <input
                  type="text"
                  value={form.hourlyRate}
                  onChange={(e) => setForm((f) => ({ ...f, hourlyRate: e.target.value }))}
                  placeholder="$75"
                  className="w-full px-3 py-2.5 rounded-lg bg-gray-800/60 border border-gray-600/50 text-white text-sm focus:outline-none focus:border-purple-500/70"
                />
              </div>
            )}

            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">
                Custom Notes <span className="text-gray-600">(optional)</span>
              </label>
              <textarea
                value={form.customNotes}
                onChange={(e) => setForm((f) => ({ ...f, customNotes: e.target.value }))}
                placeholder="Additional scope details, special terms, or project-specific notes..."
                rows={3}
                className="w-full px-3 py-2.5 rounded-lg bg-gray-800/60 border border-gray-600/50 text-white text-sm focus:outline-none focus:border-purple-500/70 resize-none"
              />
            </div>

            <button
              onClick={handleCreate}
              className="w-full py-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-semibold transition-all hover:scale-[1.01]"
            >
              Create Agreement
            </button>
          </div>
        )}

        {activeTab === "list" && (
          <div className="space-y-3">
            {agreements === undefined ? (
              <div className="text-center text-gray-500 py-12">Loading...</div>
            ) : agreements.length === 0 ? (
              <div className="text-center text-gray-600 py-12">
                <p className="mb-2">No agreements created yet.</p>
                <button onClick={() => setActiveTab("create")} className="text-purple-400 text-sm hover:text-purple-300">
                  Create your first one →
                </button>
              </div>
            ) : (
              agreements.map((a) => (
                <div
                  key={a._id}
                  className="bg-gray-900/60 backdrop-blur-md border border-gray-700/30 rounded-xl p-4 flex items-start justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="font-mono text-cyan-400 text-sm font-bold tracking-widest">{a.code}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${
                          a.status === "signed"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        }`}
                      >
                        {a.status}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          a.agreementType === "discounted"
                            ? "bg-purple-500/20 text-purple-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {a.agreementType}
                      </span>
                    </div>
                    <p className="text-white text-sm font-medium truncate">{a.clientName}</p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {a.price} · {a.timeline} · Created{" "}
                      {new Date(a.createdAt).toLocaleDateString()}
                      {a.signedAt && ` · Signed ${new Date(a.signedAt).toLocaleDateString()}`}
                    </p>
                    {a.status === "signed" && a.signerIp && (
                      <p className="text-gray-700 text-xs mt-0.5">IP: {a.signerIp}</p>
                    )}
                  </div>
                  {a.status === "pending" && (
                    <button
                      onClick={() => handleDelete(a._id, a.clientName)}
                      className="text-gray-600 hover:text-red-400 transition-colors text-sm shrink-0 mt-1"
                      title="Delete agreement"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
