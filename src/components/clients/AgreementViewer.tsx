import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { SignaturePad } from "./SignaturePad";
import { getAgreementSections } from "../../utils/agreementTemplates";
import { toast } from "sonner";

interface AgreementViewerProps {
  code: string;
  onSigned: () => void;
}

async function getClientIP(): Promise<string | undefined> {
  try {
    const res = await fetch("https://api64.ipify.org?format=json");
    const data = await res.json();
    return data.ip;
  } catch {
    return undefined;
  }
}

export function AgreementViewer({ code, onSigned }: AgreementViewerProps) {
  const agreement = useQuery(api.agreements.getAgreementByCode, { code });
  const submitSignature = useMutation(api.agreements.submitSignedAgreement);

  const [signature, setSignature] = useState<string | null>(null);
  const [signatureType, setSignatureType] = useState<"drawn" | "typed">("drawn");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 60) {
        setHasScrolled(true);
      }
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  if (agreement === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-cyan-400">
          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading agreement...
        </div>
      </div>
    );
  }

  if (!agreement) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-400">Agreement not found.</p>
      </div>
    );
  }

  if (agreement.status === "signed") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 mb-5">
            <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Already Signed</h2>
          <p className="text-gray-400 text-sm">
            This agreement was signed on{" "}
            {agreement.signedAt
              ? new Date(agreement.signedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
              : "a prior date"}
            .
          </p>
        </div>
      </div>
    );
  }

  const sections = getAgreementSections({
    clientName: agreement.clientName,
    agreementType: agreement.agreementType,
    price: agreement.price,
    timeline: agreement.timeline,
    hourlyRate: agreement.hourlyRate,
    customNotes: agreement.customNotes,
    createdAt: agreement.createdAt,
  });

  const handleSubmit = async () => {
    if (!signature) {
      toast.error("Please provide your signature before submitting.");
      return;
    }
    setIsSubmitting(true);
    try {
      const signerIp = await getClientIP();
      await submitSignature({
        code,
        signature,
        signatureType,
        signedAt: Date.now(),
        signerIp,
        signerUserAgent: navigator.userAgent,
      });
      onSigned();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
              agreement.agreementType === "discounted"
                ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                : "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
            }`}
          >
            {agreement.agreementType === "discounted" ? "Discounted Rate" : "Standard Rate"}
          </span>
          <h1 className="text-2xl font-bold text-white mt-3 mb-1">Service Agreement</h1>
          <p className="text-gray-500 text-sm">Prepared for: {agreement.clientName}</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-3 mb-8 text-xs">
          {[
            { label: "Read", done: true },
            { label: "Sign", done: hasScrolled },
            { label: "Submit", done: !!signature },
          ].map((step, i, arr) => (
            <div key={step.label} className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
                    step.done ? "bg-cyan-500 text-black" : "bg-gray-700/80 text-gray-500"
                  }`}
                >
                  {i + 1}
                </div>
                <span className={`transition-colors duration-300 ${step.done ? "text-cyan-400" : "text-gray-500"}`}>
                  {step.label}
                </span>
              </div>
              {i < arr.length - 1 && <div className="w-8 h-px bg-gray-700" />}
            </div>
          ))}
        </div>

        {/* Agreement document */}
        <div
          ref={scrollRef}
          className="bg-gray-900/60 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-6 md:p-8 max-h-[55vh] overflow-y-auto space-y-5 text-sm leading-relaxed mb-6 scroll-smooth"
        >
          {sections.map((section, i) => (
            <div key={i}>
              {section.type === "header" && (
                <div className="text-center border-b border-cyan-500/20 pb-5 mb-2">
                  <h2 className="text-base font-bold text-white tracking-wide">{section.title}</h2>
                </div>
              )}
              {section.type === "intro" && (
                <p className="text-gray-400 italic border-l-2 border-cyan-500/30 pl-4">{section.body}</p>
              )}
              {section.type === "section" && (
                <div className="space-y-2">
                  {section.title && (
                    <h3 className="font-semibold text-cyan-400 text-sm">{section.title}</h3>
                  )}
                  {section.body && <p className="text-gray-300">{section.body}</p>}
                  {section.bullets && (
                    <ul className="space-y-1 ml-2">
                      {section.bullets.map((b, j) => (
                        <li key={j} className="text-gray-300 flex items-start gap-2">
                          <span className="text-cyan-500/70 mt-0.5 shrink-0">•</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.note && (
                    <p className="text-gray-500 italic text-xs mt-1">{section.note}</p>
                  )}
                </div>
              )}
            </div>
          ))}

          {!hasScrolled && (
            <div className="sticky bottom-0 py-3 text-center text-xs text-gray-500 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none">
              ↓ Scroll down to read the full agreement
            </div>
          )}
        </div>

        {/* Signature section */}
        <div
          className={`bg-gray-900/60 backdrop-blur-md border rounded-2xl p-6 mb-6 transition-all duration-500 ${
            hasScrolled
              ? "border-cyan-500/20 opacity-100"
              : "border-gray-700/20 opacity-40 pointer-events-none select-none"
          }`}
        >
          <h3 className="font-semibold text-white mb-1">
            {hasScrolled ? "Your Signature" : "Please read the full agreement above"}
          </h3>
          {hasScrolled && (
            <p className="text-gray-500 text-xs mb-4">
              By signing, you confirm you have read and agree to all terms above.
            </p>
          )}
          <SignaturePad
            onChange={(sig, type) => {
              setSignature(sig);
              setSignatureType(type);
            }}
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!signature || isSubmitting || !hasScrolled}
          className={`w-full py-4 rounded-xl font-semibold text-base transition-all duration-300 ${
            signature && !isSubmitting && hasScrolled
              ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02]"
              : "bg-gray-800/50 text-gray-600 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Submitting...
            </span>
          ) : (
            "Submit Signed Agreement"
          )}
        </button>

        <p className="text-center text-gray-600 text-xs mt-4">
          By submitting, you are legally bound by the terms of this agreement.
        </p>
      </div>
    </div>
  );
}
