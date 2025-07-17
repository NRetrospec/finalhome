import { useState } from "react";

export function Projects() {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "Modern React-based shopping platform with real-time inventory",
      tech: ["React", "Node.js", "MongoDB", "Stripe"],
      video: "https://drive.google.com/file/d/1JADGEUyKb-vInSdQrnNUrpc9pGsBR8TR/view?usp=sharing",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=450&fit=crop",
    },
    {
      id: 2,
      title: "SaaS Dashboard",
      description: "Analytics dashboard with real-time data visualization",
      tech: ["Vue.js", "Python", "PostgreSQL", "D3.js"],
      video: "/api/placeholder/800/450",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop",
    },
    {
      id: 3,
      title: "Mobile App Backend",
      description: "Scalable API for iOS/Android social media application",
      tech: ["Express.js", "MongoDB", "Redis", "AWS"],
      video: "/api/placeholder/800/450",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=450&fit=crop",
    },
    {
      id: 4,
      title: "Portfolio Website",
      description: "Creative portfolio with smooth animations and 3D elements",
      tech: ["Svelte", "Three.js", "GSAP", "Netlify"],
      video: "/api/placeholder/800/450",
      image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=450&fit=crop",
    },
  ];

  // Helper function to render video player based on source
  const renderVideoPlayer = () => {
    if (!isPlaying) {
      return (
        <>
          <img
            src={projects[currentVideo].image}
            alt={projects[currentVideo].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => setIsPlaying(true)}
              className="w-20 h-20 bg-cyan-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-cyan-400 hover:bg-cyan-500/30 transition-all duration-300 group"
            >
              <svg className="w-8 h-8 text-cyan-400 ml-1 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          </div>
        </>
      );
    }

    if (projects[currentVideo].video.includes('drive.google.com')) {
      const videoId = projects[currentVideo].video.match(/\/d\/([^\/]+)/)?.[1] || '';
      return (
        <iframe
          src={`https://drive.google.com/file/d/${videoId}/preview`}
          className="w-full h-full"
          frameBorder="0"
          allowFullScreen
        />
      );
    }

    return (
      <video
        src={projects[currentVideo].video}
        autoPlay
        controls
        className="w-full h-full object-cover"
      />
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
          <div className="relative bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
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
                setCurrentVideo(index);
                setIsPlaying(false);
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
          <button className="neon-button neon-button-cyan">
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  );
}

