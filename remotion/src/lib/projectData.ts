// Portfolio project data for the video
export interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  industry: string;
  image: string;
  color: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Phresh Team",
    description: "Modern team collaboration platform",
    tech: ["React", "TypeScript", "Node.js"],
    industry: "SaaS",
    image: "PhreshTeamCover.png",
    color: "#06b6d4",
  },
  {
    id: 2,
    title: "NRetroCade",
    description: "Retro gaming arcade experience",
    tech: ["Next.js", "Three.js", "WebGL"],
    industry: "Gaming",
    image: "Nretrocade.png",
    color: "#a855f7",
  },
  {
    id: 3,
    title: "Galo Fitness",
    description: "Premium fitness studio website",
    tech: ["React", "Tailwind", "Framer"],
    industry: "Fitness",
    image: "Galo-Cover.png",
    color: "#ec4899",
  },
  {
    id: 4,
    title: "Elite Gym",
    description: "Full-featured gym management",
    tech: ["Vue.js", "Firebase", "Stripe"],
    industry: "Health",
    image: "gym-cover.png",
    color: "#06b6d4",
  },
  {
    id: 5,
    title: "Poké Area",
    description: "Interactive Pokémon database",
    tech: ["React", "REST API", "CSS3"],
    industry: "Entertainment",
    image: "Poke-AreaCover.png",
    color: "#a855f7",
  },
  {
    id: 6,
    title: "Digital Bookstore",
    description: "E-commerce book platform",
    tech: ["Next.js", "PostgreSQL", "Auth"],
    industry: "E-Commerce",
    image: "Bookstorecover.png",
    color: "#ec4899",
  },
];

// Service offerings for value proposition
export const services = [
  {
    title: "Custom Web Development",
    description: "Tailored solutions for your unique needs",
    icon: "💻",
  },
  {
    title: "UI/UX Design",
    description: "Beautiful, intuitive interfaces",
    icon: "🎨",
  },
  {
    title: "Performance Optimization",
    description: "Lightning-fast load times",
    icon: "⚡",
  },
  {
    title: "SEO & Analytics",
    description: "Data-driven growth strategies",
    icon: "📈",
  },
];

// Key benefits/stats
export const stats = [
  { value: "50+", label: "Projects Delivered" },
  { value: "100%", label: "Client Satisfaction" },
  { value: "24/7", label: "Support Available" },
  { value: "2-4", label: "Week Delivery" },
];
