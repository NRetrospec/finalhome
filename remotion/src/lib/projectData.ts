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
    description: "Cyberpunk gaming community with leaderboards & XP rewards",
    tech: ["React", "TypeScript", "Convex", "Stripe"],
    industry: "Gaming",
    image: "PhreshTeamCover.png",
    color: "#06b6d4",
  },
  {
    id: 2,
    title: "NRetrocade",
    description: "Nostalgic online arcade with guilds & multiplayer",
    tech: ["React", "TypeScript", "Clerk", "Convex"],
    industry: "Entertainment",
    image: "Nretrocade.png",
    color: "#a855f7",
  },
  {
    id: 3,
    title: "Galo Logistics",
    description: "Amazon DSP delivery service site for driver recruitment",
    tech: ["React", "JavaScript", "Tailwind CSS"],
    industry: "Logistics",
    image: "Galo-Cover.png",
    color: "#ec4899",
  },
  {
    id: 4,
    title: "GymFlow Pro",
    description: "Gym membership platform with class booking & tracking",
    tech: ["React", "TypeScript", "Clerk", "Convex"],
    industry: "Fitness",
    image: "gym-cover.png",
    color: "#06b6d4",
  },
  {
    id: 5,
    title: "The Framer Thing",
    description: "Futuristic 3D holographic digital agency portfolio",
    tech: ["React", "TypeScript", "Tailwind", "Vite"],
    industry: "Animation",
    image: "the-framer.png",
    color: "#a855f7",
  },
  {
    id: 6,
    title: "Jenesis Beatz",
    description: "Premium online beatstore with cart & audio playback",
    tech: ["React", "TypeScript", "Stripe", "Tailwind"],
    industry: "E-Commerce",
    image: "music.png",
    color: "#ec4899",
  },
];

// Service offerings for value proposition — matches live site
export const services = [
  {
    title: "Website Development",
    description: "Built from scratch, ready to launch — $1,000",
    icon: "💻",
  },
  {
    title: "Website + Logo Design",
    description: "Complete branding package — $2,000",
    icon: "🎨",
  },
  {
    title: "Ongoing Maintenance",
    description: "Updates, security & support — $500/mo",
    icon: "🛡️",
  },
  {
    title: "Free Consultation",
    description: "No commitment — response in 24 hours",
    icon: "📞",
  },
];

// Key stats / proof points
export const stats = [
  { value: "100%", label: "Custom — No Templates" },
  { value: "6+", label: "Projects Delivered" },
  { value: "2-4", label: "Week Delivery" },
  { value: "24/7", label: "Support Included" },
];
