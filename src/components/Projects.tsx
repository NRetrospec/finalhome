import { useState, useEffect, useMemo } from "react";

interface ProjectsProps {
  setActiveTab: (tab: string) => void;
}

// Fisher-Yates shuffle algorithm for randomizing array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export function Projects({ setActiveTab }: ProjectsProps) {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [nextVideo, setNextVideo] = useState(1);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shuffledProjects, setShuffledProjects] = useState<any[]>([]);
  const [cycleCount, setCycleCount] = useState(0);

  // All 10 projects - expanded from original 4
  const projects = [
    {
      id: 1,
      title: "Community Gaming Site (Phresh Team) ",
      description: "PhreshTeamTV is a thrilling cyberpunk gaming platform where players dive into quests, climb leaderboards, and level up their profiles in a neon-lit virtual world! 🚀 With features like personalized dashboards, real-time quest tracking, and global rankings, it's all about earning XP, unlocking rewards, and competing with friends. Built with React 18, TypeScript, and powered by Clerk for auth and Convex for the backend, this app delivers smooth animations via Framer Motion and a sleek UI with Tailwind CSS and shadcn/ui. Ready to hack the leaderboard? 🎮✨",
      tech: ["React", "Node.js", "", "Stripe"],
      video: "https://drive.google.com/file/d/1JADGEUyKb-vInSdQrnNUrpc9pGsBR8TR/view?usp=sharing",
      image: "/PhreshTeamCover.png",
      link: "https://phreshteam.tv/",
    },
    {
      id: 2,
      title: "Retro Online Arcade (NRetrocade)",
      description: "Nretrocade is a nostalgic blast from the past—a retro gaming paradise where you can dive into classic Flash games with friends! Built with React and TypeScript on the frontend, powered by Convex for real-time backend magic, and styled with Tailwind CSS for that pixel-perfect vibe, it features user authentication via Clerk, social panels for friends and guilds, XP leveling, and even ad integration. Relive the 90s and 2000s with seamless gameplay, all wrapped in a sleek, responsive interface!",
      tech: ["React", "Typescirpt", "Clerk", "Convex"],
      video: "/api/placeholder/800/450",
      image: "/Nretrocade.png",
      link: "https://nretrocade.com/",
    },
    {
      id: 3,
      title: "Amazon DSP Site",
      description: "This site is an informational overview for a Delivery Service Partner (DSP), designed to provide clear insight into day-to-day operations. It outlines what a typical workday looks like for drivers, including workload expectations, delivery areas covered, and average package volume handled per route. The goal is to set transparent expectations and give viewers a practical understanding of the scope and demands of the role.",
      tech: ["Javascript", "HTML", "Tailwind CSS", "React"],
      video: "/api/placeholder/800/450",
      image: "/Galo-Cover.png",
      link: "https://bright-crisp-a0051e.netlify.app/",
    },
    {
      id: 4,
      title: "Gym Membership Site",
      description: "GymFlow Pro is your ultimate gym buddy in app form! Pump up your fitness game with features like class bookings, membership management, and a sleek dashboard to track your progress—all wrapped in a secure, user-friendly interface. Built with the power trio of React, TypeScript, and Vite for lightning-fast performance, styled with Tailwind CSS and shadcn-ui components, and backed by Convex for robust data handling and Clerk for seamless authentication. Get ready to flex those digital muscles! 💪",
      tech: ["  CSS", "Clerk", "TypeScript", "Netlify"],
      video: "/api/placeholder/800/450",
      image: "/gym-cover.png",
      link: "https://gym-brostho.netlify.app/",
    },
    {
      id: 5,
      title: "Pixel Poke Arena",
      description: "Pixel Poke Arena is an exciting turn-based strategy game where players command Pokémon armies on an 8x5 grid battlefield. Deploy your creatures via drag-and-drop, watch them advance automatically, and engage in tactical combat against AI opponents. Built with React, TypeScript, Vite, Tailwind CSS, and shadcn/ui for a modern, responsive web experience.",
      tech: ["Next.js", "TypeScript", "Tailwind", "Vite"],
      video: "/api/placeholder/800/450",
      image: "/Poke-AreaCover.png",
      link: "https://pixelpokearena.netlify.app/",
    },
    {
      id: 6,
      title: "Online Bookstore   -    (Lofi Reads)",
      description: "Lofi Reads is a cozy book store application featuring a catalog of books across various genres, with shopping cart and wishlist functionality, built using React, Vite, TypeScript, Tailwind CSS, and shadcn/ui components",
      tech: ["React", "TypeScript", "Stripe", "Express"],
      video: "/api/placeholder/800/450",
      image: "/Bookstorecover.png",
      link: "https://lofireads.netlify.app/",
    },
    {
      id: 7,
      title: "Git Hub Repos",
      description: "Dive into all repos created",
      tech: ["React", "Node.js", "MongoDB", "Stripe"],
      video: "/api/placeholder/800/450",
      image: "/github-picture.png",
      link: "https://github.com/NRetrospec",
    },
    {
      id: 8,
      title: "Youtube",
      description: "Content",
      tech: ["React", "OpenWeather API", "Chart.js", "Leaflet"],
      video: "/api/placeholder/800/450",
      image: "/youtube-picture.png",
      link: "https://www.youtube.com/@NRetrospec",
    },
    
  ];

  // Initialize shuffled projects on mount
  useEffect(() => {
    setShuffledProjects(shuffleArray(projects));
  }, []);

  // Carousel auto-rotation with shuffle on cycle completion
  useEffect(() => {
    if (!isPaused && shuffledProjects.length > 0) {
      const interval = setInterval(() => {
        setIsFading(true);
        setTimeout(() => {
          setCurrentVideo((prev) => {
            const next = (prev + 1) % shuffledProjects.length;

            // Reshuffle when completing a full cycle (returning to index 0)
            if (next === 0) {
              setShuffledProjects(shuffleArray(projects));
              setCycleCount((count) => count + 1);
            }

            setNextVideo(next);
            return next;
          });
          setIsFading(false);
        }, 1000); // fade duration 1s
      }, 7000); // 7 second interval
      return () => clearInterval(interval);
    }
  }, [isPaused, shuffledProjects.length]);

  // Helper function to render photo instead of video player
  const renderVideoPlayer = () => {
    if (shuffledProjects.length === 0) return null;

    return (
      <>
        <img
          src={shuffledProjects[currentVideo].image}
          alt={shuffledProjects[currentVideo].title}
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

              {/* Project info overlay */}
              {shuffledProjects.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {shuffledProjects[currentVideo].title}
                  </h3>
                  <p className="text-gray-300 mb-4">
                    {shuffledProjects[currentVideo].description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {shuffledProjects[currentVideo].tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm border border-cyan-500/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Video navigation */}
          <div className="flex justify-center mt-6 space-x-4">
            {shuffledProjects.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentVideo(index);
                  setIsPlaying(false);
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

        {/* Project Grid - All 10 Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project) => {
            // Check if this project is currently displayed in the carousel
            const isCurrentlyShown = shuffledProjects.length > 0 &&
              shuffledProjects[currentVideo]?.id === project.id;

            return (
              <div
                key={project.id}
                className={`cyber-card cursor-pointer transition-all duration-300 hover:scale-105 ${
                  isCurrentlyShown ? "ring-2 ring-cyan-400" : ""
                }`}
                onClick={() => {
                  setSelectedProject(project);
                  setIsModalOpen(true);
                }}
              >
                <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="text-xl font-bold text-cyan-400 mb-2">
                  {project.title}
                </h3>

                <p className="text-gray-300 mb-4 text-sm">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-sm border border-purple-500/30"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-cyan-500/30 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-2xl font-bold text-cyan-400 mb-4">
              {selectedProject.title}
            </h3>
            <p className="text-gray-300 mb-6">
              {selectedProject.description}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400 transition-colors"
                onClick={() => {
                  window.open(selectedProject.link, '_blank');
                  setIsModalOpen(false);
                }}
              >
                View Project
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

