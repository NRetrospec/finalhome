import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { Projects } from "./components/Projects";
import { Contact } from "./components/Contact";
import { PaymentSuccess } from "./components/PaymentSuccess";
import "./styles/animations.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Check for Stripe success/cancel parameters
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get("success");
    const canceled = urlParams.get("canceled");
    const stripeSessionId = urlParams.get("session_id");

    if (success === "true" && stripeSessionId) {
      setSessionId(stripeSessionId);
      setShowPaymentSuccess(true);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (canceled === "true") {
      // Handle canceled payment
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <Hero setActiveTab={setActiveTab} />;
      case "services":
        return <Services />;
      case "projects":
        return <Projects />;
      case "contact":
        return <Contact />;
      default:
        return <Hero setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="cyber-grid"></div>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="relative z-10">
        {renderContent()}
      </main>
      <Toaster theme="dark" />
      
      {showPaymentSuccess && sessionId && (
  <PaymentSuccess
    sessionId={sessionId}
    onClose={() => setShowPaymentSuccess(false)}
    redirectHome={() => {
      setShowPaymentSuccess(false);
      setActiveTab("home");
    }}
  />
)}

    </div>
  );
}
