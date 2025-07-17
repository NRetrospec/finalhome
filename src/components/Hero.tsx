interface HeroProps {
  setActiveTab: (tab: string) => void;
}

export function Hero({ setActiveTab }: HeroProps) {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="text-center max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-glow">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              N Retrospec
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Crafting cutting-edge web experiences with modern technology.
            <br />
            <span className="text-cyan-400">Full-stack development</span> • 
            <span className="text-purple-400"> Custom design</span> • 
            <span className="text-pink-400"> Ongoing support</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button className="neon-button neon-button-cyan group">
            <span className="relative z-10">Start Your Project</span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-cyan-600/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          </button>
          
          <button
            className="neon-button neon-button-purple group"
            onClick={() => setActiveTab('projects')}
          >
            <span className="relative z-10">View Our Work</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-purple-600/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="cyber-card">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-cyan-400 mb-2">Lightning Fast</h3>
            <p className="text-gray-400">Optimized performance and modern frameworks for blazing-fast websites.</p>
          </div>
          
          <div className="cyber-card">
            <div className="text-3xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-purple-400 mb-2">Custom Design</h3>
            <p className="text-gray-400">Unique, responsive designs tailored to your brand and vision.</p>
          </div>
          
          <div className="cyber-card">
            <div className="text-3xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-pink-400 mb-2">Full Support</h3>
            <p className="text-gray-400">Ongoing maintenance and support to keep your site running smoothly.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
