import { useState } from "react";
import { Toaster } from "sonner";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { Projects } from "./components/Projects";
import { Contact } from "./components/Contact";
import "./styles/animations.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");

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
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="cyber-grid"></div>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="relative z-10">
        {renderContent()}
      </main>
      <Toaster theme="dark" />
    </div>
  );
}
