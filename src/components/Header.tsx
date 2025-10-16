import { useState } from 'react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Header({ activeTab, setActiveTab }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const tabs = [
    { id: "home", label: "Home" },
    { id: "services", label: "Services" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-cyan-500/20 overflow-visible">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            
            <img src="/Nretrospec logos FINALS-word.png" alt="N Retrospec" className="h-60 absolute left-30 top-[-70px]  w-auto z-10" />
          </div>
          
          <nav className="hidden md:flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/25"
                    : "text-gray-300 hover:text-cyan-400 hover:bg-gray-800/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-300 hover:text-cyan-400 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden" onClick={closeMenu}>
          <div 
            className="fixed top-0 right-0 h-full w-64 bg-gray-950 backdrop-blur-xl p-4 transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={closeMenu}
              className="absolute top-4 right-4 text-gray-300 hover:text-cyan-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex flex-col space-y-4 mt-16">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    closeMenu();
                  }}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 text-left text-base text-gray-50 [text-shadow:0_2px_4px_rgba(0,0,0,0.7)] border border-gray-700/50 ${
                    activeTab === tab.id
                      ? "bg-cyan-500/50 text-cyan-200 shadow-lg shadow-cyan-500/30"
                      : "bg-gray-800/60 hover:text-cyan-200 hover:bg-gray-800/80"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
