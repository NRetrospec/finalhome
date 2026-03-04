import { useState, useEffect } from "react";

interface ProjectsProps {
  setActiveTab: (tab: string) => void;
}

export function Projects({ setActiveTab }: ProjectsProps) {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      title: "NRetrocade — Retro Arcade",
      description: "A nostalgic online arcade featuring classic Flash-era games with friends lists, guilds, and XP leveling. Users can play together, track progress, and compete on leaderboards.",
      tech: ["React", "TypeScript", "Clerk", "Convex"],
      video: "/api/placeholder/800/450",
      image: "/Nretrocade.png",
      link: "https://nretrocade.com/",
      industry: "Entertainment"
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
      title: "Pixel Poke Arena — Strategy Game",
      description: "A turn-based strategy game with drag-and-drop deployment, grid-based combat, and AI opponents. Fully responsive with modern UI components.",
      tech: ["React", "TypeScript", "Tailwind", "Vite"],
      video: "/api/placeholder/800/450",
      image: "/Poke-AreaCover.png",
      link: "https://pixelpokearena.netlify.app/",
      industry: "Gaming"
    },
    {
      id: 6,
      title: "Jenesis Beatz — Online Beatstore",
      description: "A premium online marketplace where artists can browse, preview, and purchase high-quality beats from talented producers. The platform features a dark, futuristic design with audio playback, shopping cart, favorites, and user authentication.",
      tech: ["React", "TypeScript", "Stripe", "Tailwind"],
      video: "/api/placeholder/800/450",
      image: "/music.png",
      link: "https://jenesisbeats.netlify.app/",
      industry: "E-commerce"
    },
  ];

  // Carousel auto-rotation (no shuffle)
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setIsFading(true);
        setTimeout(() => {
          setCurrentVideo((prev) => (prev + 1) % projects.length);
          setIsFading(false);
        }, 1000); // fade duration 1s
      }, 7000); // 7 second interval
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  // Helper function to go to previous project
  const goToPrevious = () => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentVideo((prev) => (prev - 1 + projects.length) % projects.length);
      setIsFading(false);
    }, 100);
  };

  // Helper function to go to next project
  const goToNext = () => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentVideo((prev) => (prev + 1) % projects.length);
      setIsFading(false);
    }, 100);
  };

  // Helper function to render photo instead of video player
  const renderVideoPlayer = () => {
    return (
      <>
        <img
          src={projects[currentVideo].image}
          alt={projects[currentVideo].title}
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
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {projects[currentVideo].title}
                </h3>
                <p className="text-gray-300 mb-4">
                  {projects[currentVideo].description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {projects[currentVideo].tech.map((tech: string) => (
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
            {projects.map((_, index) => (
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

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => {
            // Check if this project is currently displayed in the carousel
            const isCurrentlyShown = projects[currentVideo]?.id === project.id;

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
                  {/* Industry badge */}
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

