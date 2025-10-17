import { useState, useEffect } from "react";

interface ProjectsProps {
  setActiveTab: (tab: string) => void;
}

export function Projects({ setActiveTab }: ProjectsProps) {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [nextVideo, setNextVideo] = useState(1);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const projects = [
    {
      id: 1,
      title: "Community Gaming Blog ",
      description: "Modern React-based gaming blog platform with real-time interaction",
      tech: ["React", "Node.js", "MongoDB", "Stripe"],
      video: "https://drive.google.com/file/d/1JADGEUyKb-vInSdQrnNUrpc9pGsBR8TR/view?usp=sharing",
      image: "/Phrest-team.png",
      link: "https://iridescent-druid-0cf7ba.netlify.app/",
    },
    {
      id: 2,
      title: "Retro Arcade",
      description: "Old School Flash Games Presented in a Modern Way",
      tech: ["Vue.js", "Python", "PostgreSQL", "D3.js"],
      video: "/api/placeholder/800/450",
      image: "/Nretrocade.png",
      link: "https://nretrocade.onrender.com/",
    },
    {
      id: 3,
      title: "Git Hub Repos",
      description: "Dive into all repos created",
      tech: ["React", "Node.js", "MongoDB", "Stripe"],
      video: "/api/placeholder/800/450",
      image: "/github-picture.png",
      link: "https://github.com/NRetrospec",
    },
    {
      id: 4,
      title: "Youtube Content",
      description: "Retro Content",
      tech: ["Svelte", "Three.js", "GSAP", "Netlify"],
      video: "/api/placeholder/800/450",
      image: "/youtube-picture.png",
      link: "https://www.youtube.com/@NRetrospec",
    },
  ];

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setIsFading(true);
        setTimeout(() => {
          setCurrentVideo((prev) => {
            const next = (prev + 1) % projects.length;
            setNextVideo(next);
            return next;
          });
          setIsFading(false);
        }, 1000); // fade duration 1s
      }, 7000);
      return () => clearInterval(interval);
    }
  }, [isPaused, projects.length]);

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

              {/* Project info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {projects[currentVideo].title}
                </h3>
                <p className="text-gray-300 mb-4">
                  {projects[currentVideo].description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {projects[currentVideo].tech.map((tech) => (
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

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`cyber-card cursor-pointer transition-all duration-300 hover:scale-105 ${
                currentVideo === index ? "ring-2 ring-cyan-400" : ""
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
              
              <p className="text-gray-300 mb-4">
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
          ))}
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

