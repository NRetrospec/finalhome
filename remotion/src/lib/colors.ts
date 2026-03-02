// N Retrospec Brand Colors
export const colors = {
  // Primary brand colors
  background: "#111827", // gray-900
  backgroundDark: "#0a0f1a",
  cyan: "#06b6d4",
  purple: "#a855f7",
  pink: "#ec4899",

  // Text colors
  textPrimary: "#ffffff",
  textSecondary: "#9ca3af", // gray-400
  textMuted: "#6b7280", // gray-500

  // Card backgrounds
  cardBg: "rgba(17, 24, 39, 0.8)",
  cardBorder: "rgba(6, 182, 212, 0.3)",

  // Badge backgrounds
  techBadgeBg: "rgba(168, 85, 247, 0.2)",
  techBadgeText: "#c084fc",
  industryBadgeBg: "rgba(6, 182, 212, 0.2)",
  industryBadgeText: "#22d3ee",

  // Glow effects
  cyanGlow: "rgba(6, 182, 212, 0.5)",
  purpleGlow: "rgba(168, 85, 247, 0.5)",
  pinkGlow: "rgba(236, 72, 153, 0.5)",
};

// Gradient combinations
export const gradients = {
  primary: `linear-gradient(135deg, ${colors.cyan}, ${colors.purple})`,
  accent: `linear-gradient(135deg, ${colors.purple}, ${colors.pink})`,
  full: `linear-gradient(135deg, ${colors.cyan}, ${colors.purple}, ${colors.pink})`,
  radial: `radial-gradient(circle at center, ${colors.backgroundDark} 0%, ${colors.background} 100%)`,
};
