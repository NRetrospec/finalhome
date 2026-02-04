interface HeroProps {
  setActiveTab: (tab: string) => void;
}

export function Hero({ setActiveTab }: HeroProps) {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="text-center max-w-4xl mx-auto">
        <div className="mb-8">
          {/* Pre-header brand */}
          <p className="text-cyan-400 font-medium tracking-widest uppercase text-sm mb-4 animate-glow">
            N Retrospec
          </p>

          {/* Outcome-focused headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Websites That Turn Visitors Into Customers
            </span>
          </h1>

          {/* Value proposition with pricing and timeline */}
          <p className="text-xl md:text-2xl text-gray-200 mb-4 leading-relaxed max-w-2xl mx-auto">
            Custom-built websites for growing businesses.
          </p>
          <p className="text-lg text-gray-400 mb-8">
            Starting at <span className="text-cyan-400 font-semibold">$1,000</span> · Delivered in <span className="text-purple-400 font-semibold">2-4 weeks</span> · No templates
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          <button
            className="neon-button neon-button-cyan group"
            onClick={() => setActiveTab('services')}
          >
            <span className="relative z-10">Get a Free Quote</span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-cyan-600/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          </button>

          <button
            className="neon-button neon-button-purple group"
            onClick={() => setActiveTab('projects')}
          >
            <span className="relative z-10">See Our Work</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-purple-600/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          </button>
        </div>

        {/* Trust signal */}
        <p className="text-gray-500 text-sm mb-12">
          No commitment required · Response within 24 hours
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="cyber-card">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-cyan-400 mb-2">Fast Load Times</h3>
            <p className="text-gray-300">Sites built to load in under 2 seconds. Your visitors won't wait around.</p>
          </div>

          <div className="cyber-card">
            <div className="text-3xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-purple-400 mb-2">Built for Your Brand</h3>
            <p className="text-gray-300">No cookie-cutter templates. Every design is crafted specifically for your business.</p>
          </div>

          <div className="cyber-card">
            <div className="text-3xl mb-4">🛡️</div>
            <h3 className="text-xl font-semibold text-pink-400 mb-2">You're Never Stuck</h3>
            <p className="text-gray-300">Ongoing support included. Questions? We're one message away.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
