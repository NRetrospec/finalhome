import { useState, useEffect, useRef } from "react";

interface ProjectsProps {
  setActiveTab: (tab: string) => void;
}

export function Projects({ setActiveTab }: ProjectsProps) {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [gridVisible, setGridVisible] = useState(true);

  // Portfolio projects - showcasing work across different industries
  const projects = [
    {
      id: 1,
      title: "Phresh Team — Gaming Community",
      description: "A cyberpunk-themed gaming platform with user profiles, leaderboards, quest tracking, and XP rewards. Features secure authentication, real-time updates, and smooth animations throughout.",
      tech: ["React", "TypeScript", "Convex", "Stripe"],
      video: "https://drive.google.com/file/d/1JADGEUyKb-vInSdQrnNUrpc9pGsBR8TR/view?usp=sharing",
      image: "/PhreshTeamCover.png",
      link: "https://phreshteam.tv/",
      industry: "Gaming"
    },
    {
      id: 2,
      title: "Payroll Pro — HR System",
      description: "HR and payroll management platform that enables organizations to manage employees, track time with GPS verification, process payroll, and store documents in one secure, centralized system. ",
      tech: ["React", "TypeScript", "MongoDB"],
      video: "/api/placeholder/800/450",
      image: "/Payroll-Pro-cover.png",
      link: "https://falconviews.netlify.app/",
      industry: "SaaS"
    },
    {
      id: 3,
      title: "Galo Logistics — Delivery Service",
      description: "An informational site for an Amazon DSP, providing transparency about driver roles, daily operations, delivery areas, and workload expectations for potential employees.",
      tech: ["React", "JavaScript", "Tailwind CSS"],
      video: "/api/placeholder/800/450",
      image: "/Galo-Cover.png",
      link: "https://bright-crisp-a0051e.netlify.app/",
      industry: "Logistics"
    },
    {
      id: 4,
      title: "GymFlow Pro — Fitness Studio",
      description: "A gym membership platform with class booking, membership management, and progress tracking. Clean dashboard interface with secure user authentication.",
      tech: ["React", "TypeScript", "Clerk", "Convex"],
      video: "/api/placeholder/800/450",
      image: "/gym-cover.png",
      link: "https://gym-brostho.netlify.app/",
      industry: "Fitness"
    },
    {
      id: 5,
      title: "Hooper — Sports Platform",
      description: "Basketball platform that serves two audiences: a coach portal for managing youth team rosters and schedules, and a social hub where players can discover events, challenge each other in 1v1 competitions, and buy or sell gear. It features player profiles, real-time messaging, a friends system, a marketplace, and Stripe-powered prize pools with wallet and dispute management.",
      tech: ["React", "Three.js", "GSAP"],
      video: "/api/placeholder/800/450",
      image: "/Youthbasketball-Cover.png",
      link: "https://youthbaksketcam.netlify.app/",
      industry: "Sports"
    },
    {
      id: 6,
      title: "FSO — Custom Order Store",
      description: "Cinematic e-commerce and booking platform for custom and premade rugs.",
      tech: ["React", "Vite", "Tailwind CSS"],
      video: "/api/placeholder/800/450",
      image: "/flystuff cover.png",
      link: "https://livirugs.netlify.app/",
      industry: "E-commerce"
    },
    {
      id: 7,
      title: "NRetrocade — Retro Arcade",
      description: "A nostalgic online arcade featuring classic Flash-era games with friends lists, guilds, and XP leveling. Users can play together, track progress, and compete on leaderboards.",
      tech: ["React", "TypeScript", "Clerk", "Convex"],
      video: "/api/placeholder/800/450",
      image: "/Nretrocade.png",
      link: "https://nretrocade.com/",
      industry: "Entertainment"
    },
    {
      id: 8,
      title: "Pixel Poke Arena — Web Game",
      description: "Web-based, turn-based tactical game that blends Pokémon nostalgia with strategic grid-based combat on an 8×5 battlefield. Players build custom decks, deploy Pokémon via drag-and-drop, and take on AI opponents in a fight to destroy the enemy base",
      tech: ["React", "Node.js", "MongoDB"],
      video: "/api/placeholder/800/450",
      image: "/Poke-AreaCover.png",
      link: "https://pixelpokearena.netlify.app/",
      industry: "Creative"
    },
    {
      id: 9,
      title: "GBA Link Up — Online Arcade",
      description: "Browser-based retro gaming platform that lets you play classic Game Boy Advance titles with an authentic arcade aesthetic, complete with CRT scanlines and neon pixel-art visuals. Connect with up to 4 friends via peer-to-peer WebRTC multiplayer rooms to relive the classic link cable experience with minimal latency.",
      tech: ["WebRTC", "TypeScript", "Netlify"],
      video: "/api/placeholder/800/450",
      image: "/GBALINK-COVER.png",
      link: "https://enchanting-meringue-01fb90.netlify.app/",
      industry: "Platform"
    },
    {
      id: 10,
      title: "Jenesis Beatz — Online Beatstore",
      description: "A premium online marketplace where artists can browse, preview, and purchase high-quality beats from talented producers. The platform features a dark, futuristic design with audio playback, shopping cart, favorites, and user authentication.",
      tech: ["React", "TypeScript", "Stripe", "Tailwind"],
      video: "/api/placeholder/800/450",
      image: "/music.png",
      link: "https://jenesisbeats.netlify.app/",
      industry: "E-commerce"
    },
    {
      id: 11,
      title: "Web Pokedex — Gaming Info",
      description: "Interactive React web application that lets users browse, search, and compare Pokémon through animated card layouts and detailed stat modals.",
      tech: ["React", "TypeScript", "API"],
      video: "/api/placeholder/800/450",
      image: "/WEB-POKEDEX.png",
      link: "https://transcendent-starship-743c93.netlify.app/",
      industry: "Creative"
    },
    {
      id: 12,
      title: "The Framer Thing",
      description: "Futuristic digital agency portfolio website featuring an immersive 3D holographic interface. Built with Vite, Three.js, and GSAP, it showcases a scroll-driven 3D cube navigation system with 180+ animated frames creating a cinematic user experience.",
      tech: ["React", "TypeScript", "Tailwind", "Vite"],
      video: "/api/placeholder/800/450",
      image: "/the-framer.png",
      link: "https://jazzy-kringle-6688b1.netlify.app/",
      industry: "Animation"
    },
  ];

  const visibleProjects = projects.slice(currentPage * 6, currentPage * 6 + 6);

  const togglePage = (direction: 'left' | 'right') => {
    if (direction === 'right' && currentPage === 1) return;
    if (direction === 'left' && currentPage === 0) return;
    setGridVisible(false);
    setTimeout(() => {
      setCurrentPage(prev => direction === 'right' ? prev + 1 : prev - 1);
      setCurrentVideo(0);
      setGridVisible(true);
    }, 400);
  };

  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) togglePage(diff > 0 ? 'right' : 'left');
    touchStartX.current = null;
  };

  // Carousel auto-rotation (no shuffle)
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setIsFading(true);
        setTimeout(() => {
          setCurrentVideo((prev) => (prev + 1) % visibleProjects.length);
          setIsFading(false);
        }, 1000); // fade duration 1s
      }, 7000); // 7 second interval
      return () => clearInterval(interval);
    }
  }, [isPaused, currentPage]);

  // Helper function to go to previous project
  const goToPrevious = () => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentVideo((prev) => (prev - 1 + visibleProjects.length) % visibleProjects.length);
      setIsFading(false);
    }, 100);
  };

  // Helper function to go to next project
  const goToNext = () => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentVideo((prev) => (prev + 1) % visibleProjects.length);
      setIsFading(false);
    }, 100);
  };

  // Helper function to render photo instead of video player
  const renderVideoPlayer = () => {
    return (
      <>
        <img
          src={visibleProjects[currentVideo].image}
          alt={visibleProjects[currentVideo].title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
      </>
    );
  };

  return (
    <section className="min-h-screen px-6 pt-24 pb-12">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Our Projects
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore our portfolio of cutting-edge web applications and digital experiences
          </p>
        </div>

        {/* Video Carousel */}
        <div className="mb-12">
          <div
            className="relative bg-gray-800 rounded-xl overflow-hidden shadow-2xl"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="aspect-video relative">
              {renderVideoPlayer()}

              {/* Left Arrow Button */}
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-gray-900/80 hover:bg-cyan-500/80 text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
                aria-label="Previous project"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>

              {/* Right Arrow Button */}
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-gray-900/80 hover:bg-cyan-500/80 text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
                aria-label="Next project"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>

              {/* Project info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 hidden md:block">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {visibleProjects[currentVideo].title}
                </h3>
                <p className="text-gray-300 mb-4 hidden md:block">
                  {visibleProjects[currentVideo].description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {visibleProjects[currentVideo].tech.map((tech: string) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm border border-cyan-500/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Video navigation */}
          <div className="flex justify-center mt-6 space-x-4">
            {visibleProjects.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentVideo(index);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentVideo === index
                    ? "bg-cyan-400 shadow-lg shadow-cyan-400/50"
                    : "bg-gray-600 hover:bg-gray-500"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Project Grid with page toggle */}
        <div className="flex items-center gap-4 lg:gap-6">
          {/* Left Arrow — desktop only, hidden on mobile (swipe instead) */}
          <button
            onClick={() => togglePage('left')}
            disabled={currentPage === 0}
            className={`hidden md:flex shrink-0 w-12 h-12 bg-gray-900/80 hover:bg-cyan-500/80 text-white rounded-full items-center justify-center transition-all duration-300 backdrop-blur-sm ${
              currentPage === 0 ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
            aria-label="Previous projects"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Grid wrapper */}
          <div className="flex-1 min-w-0">
            {/* Animated grid with swipe support on mobile */}
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              style={{
                opacity: gridVisible ? 1 : 0,
                transform: gridVisible ? 'translateX(0)' : `translateX(${currentPage === 0 ? '-24px' : '24px'})`,
                transition: 'opacity 0.4s ease, transform 0.4s ease',
              }}
            >
            {visibleProjects.map((project) => {
              const isCurrentlyShown = visibleProjects[currentVideo]?.id === project.id;

              return (
                <div
                  key={project.id}
                  className={`cyber-card cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                    isCurrentlyShown ? "ring-2 ring-cyan-400" : ""
                  }`}
                  onClick={() => {
                    setSelectedProject(project);
                    setIsModalOpen(true);
                  }}
                >
                  <div className="aspect-video mb-4 rounded-lg overflow-hidden relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 right-2 px-2 py-1 bg-gray-900/80 text-cyan-400 text-xs font-medium rounded backdrop-blur-sm">
                      {project.industry}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-cyan-400 mb-2">
                    {project.title}
                  </h3>

                  <p className="text-gray-300 mb-4 text-sm line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs border border-purple-500/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
            </div>

            {/* Page indicator dots */}
            <div className="flex justify-center mt-6 space-x-3">
              {[0, 1].map((page) => (
                <button
                  key={page}
                  onClick={() => {
                    if (page !== currentPage) togglePage(page > currentPage ? 'right' : 'left');
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    currentPage === page
                      ? "bg-cyan-400 shadow-lg shadow-cyan-400/50"
                      : "bg-gray-600 hover:bg-gray-500"
                  }`}
                  aria-label={`Page ${page + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Arrow — desktop only */}
          <button
            onClick={() => togglePage('right')}
            disabled={currentPage === 1}
            className={`hidden md:flex shrink-0 w-12 h-12 bg-gray-900/80 hover:bg-cyan-500/80 text-white rounded-full items-center justify-center transition-all duration-300 backdrop-blur-sm ${
              currentPage === 1 ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
            aria-label="Next projects"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Project?
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Let's discuss your vision and create something amazing together.
            Our team is ready to bring your ideas to life.
          </p>
          <button
            className="neon-button neon-button-cyan"
            onClick={() => setActiveTab("services")}
          >
            Get Started Today
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedProject && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-gray-800 border border-cyan-500/30 rounded-xl p-6 max-w-lg w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Back button — mobile only */}
            <button
              className="md:hidden mb-4 flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm"
              onClick={() => setIsModalOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Back
            </button>

            {/* Project image */}
            <div className="aspect-video mb-4 rounded-lg overflow-hidden">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Industry badge */}
            <span className="inline-block px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-medium rounded mb-3">
              {selectedProject.industry}
            </span>

            <h3 className="text-2xl font-bold text-white mb-3">
              {selectedProject.title}
            </h3>

            <p className="text-gray-300 mb-4">
              {selectedProject.description}
            </p>

            {/* Tech stack */}
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedProject.tech.map((tech: string) => (
                <span
                  key={tech}
                  className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs border border-purple-500/30"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="flex-1 px-4 py-3 bg-cyan-500 text-white font-medium rounded-lg hover:bg-cyan-400 transition-colors"
                onClick={() => {
                  window.open(selectedProject.link, '_blank');
                }}
              >
                View Live Site
              </button>
              <button
                className="flex-1 px-4 py-3 border border-purple-500 text-purple-400 font-medium rounded-lg hover:bg-purple-500/10 transition-colors"
                onClick={() => {
                  setIsModalOpen(false);
                  setActiveTab("services");
                }}
              >
                Want Something Similar?
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

