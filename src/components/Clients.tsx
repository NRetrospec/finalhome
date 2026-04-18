import { useState } from "react";
import { CodeEntry } from "./clients/CodeEntry";
import { AgreementViewer } from "./clients/AgreementViewer";
import { AdminPanel } from "./clients/AdminPanel";

type ClientView = "code-entry" | "agreement" | "success" | "admin";

export function Clients() {
  const [view, setView] = useState<ClientView>("code-entry");
  const [code, setCode] = useState("");

  if (view === "admin") {
    return <AdminPanel onClose={() => setView("code-entry")} />;
  }

  if (view === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 mb-6">
            <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Agreement Signed!</h2>
          <p className="text-gray-400 mb-2">
            Your service agreement has been successfully signed and submitted.
          </p>
          <p className="text-gray-500 text-sm">
            N Retrospec will be in touch shortly to get your project started.
          </p>
          <div className="mt-8 p-4 rounded-2xl bg-green-500/5 border border-green-500/20">
            <p className="text-green-400 text-sm font-medium">✓ Securely stored in our system</p>
            <p className="text-gray-600 text-xs mt-1">
              Keep your access code for your records.
            </p>
          </div>
          <button
            onClick={() => { setView("code-entry"); setCode(""); }}
            className="mt-6 text-gray-600 hover:text-gray-400 text-sm transition-colors"
          >
            ← Back to portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {view === "code-entry" && (
        <CodeEntry
          onSuccess={(c) => { setCode(c); setView("agreement"); }}
          onAdminAccess={() => setView("admin")}
        />
      )}
      {view === "agreement" && (
        <AgreementViewer code={code} onSigned={() => setView("success")} />
      )}
    </>
  );
}
