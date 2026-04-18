import { useState, useRef, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface CodeEntryProps {
  onSuccess: (code: string) => void;
  onAdminAccess: () => void;
}

export function CodeEntry({ onSuccess, onAdminAccess }: CodeEntryProps) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const agreement = useQuery(
    api.agreements.getAgreementByCode,
    submittedCode !== null ? { code: submittedCode } : "skip"
  );

  useEffect(() => {
    if (submittedCode === null || agreement === undefined) return;
    setIsLoading(false);
    if (agreement === null) {
      setError("Invalid code. Please check and try again.");
      setSubmittedCode(null);
    } else if (agreement.status === "signed") {
      setError("This agreement has already been signed.");
      setSubmittedCode(null);
    } else {
      onSuccess(submittedCode);
    }
  }, [agreement, submittedCode, onSuccess]);

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    setError("");
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter") handleSubmit();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (paste.length === 6) {
      setDigits(paste.split(""));
      inputRefs.current[5]?.focus();
    }
    e.preventDefault();
  };

  const handleSubmit = () => {
    const code = digits.join("");
    if (code.length !== 6) {
      setError("Please enter all 6 digits.");
      return;
    }
    setIsLoading(true);
    setError("");
    setSubmittedCode(code);
  };

  const isComplete = digits.every((d) => d !== "");

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-5">
            <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Client Portal</h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Enter your 6-digit access code to view and sign your service agreement.
          </p>
        </div>

        <div className="bg-gray-900/60 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-8">
          <p className="text-xs text-gray-500 text-center mb-5 uppercase tracking-widest">Access Code</p>

          <div className="flex gap-2 justify-center mb-6">
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                className={`w-12 h-14 text-center text-xl font-bold rounded-lg border-2 bg-gray-800/60 text-white transition-all duration-200 focus:outline-none focus:scale-105 ${
                  digit
                    ? "border-cyan-500 shadow-lg shadow-cyan-500/20 text-cyan-300"
                    : "border-gray-600/50 focus:border-cyan-500/60"
                }`}
              />
            ))}
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!isComplete || isLoading}
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
              isComplete && !isLoading
                ? "bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02]"
                : "bg-gray-700/50 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Verifying...
              </span>
            ) : (
              "Access Agreement"
            )}
          </button>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          Your code was provided by N Retrospec. Contact us if you need assistance.
        </p>

        <div className="text-center mt-8">
          <button
            onClick={onAdminAccess}
            className="text-gray-800 hover:text-gray-600 text-xs transition-colors duration-200"
          >
            Admin Portal
          </button>
        </div>
      </div>
    </div>
  );
}
