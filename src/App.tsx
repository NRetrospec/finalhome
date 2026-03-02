import { useState } from "react";
import { Toaster } from "sonner";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { Projects } from "./components/Projects";
import { Contact } from "./components/Contact";
import { SplashScreen } from "./components/SplashScreen";
import { AnimatedBackground } from "./components/AnimatedBackground";
import "./styles/animations.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [showSplash, setShowSplash] = useState(
    () => !sessionStorage.getItem('nretrospec-intro-seen')
  );

  const handleSplashDone = () => {
    sessionStorage.setItem('nretrospec-intro-seen', '1');
    setShowSplash(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <Hero setActiveTab={setActiveTab} />;
      case "services":
        return <Services />;
      case "projects":
        return <Projects setActiveTab={setActiveTab} />;
      case "contact":
        return <Contact />;
      default:
        return <Hero setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen text-white" style={{ background: 'radial-gradient(circle at center, #0a0f1a 0%, #111827 100%)' }}>
      {showSplash && <SplashScreen onDone={handleSplashDone} />}
      <AnimatedBackground />
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="relative z-10">
        {renderContent()}
      </main>
      <Toaster theme="dark" />
    </div>
  );
}
