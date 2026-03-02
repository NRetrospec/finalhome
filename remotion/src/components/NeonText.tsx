import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { colors } from "../lib/colors";
import { fadeIn, typewriter } from "../lib/animations";

interface NeonTextProps {
  text: string;
  color?: string;
  fontSize?: number;
  startFrame?: number;
  useTypewriter?: boolean;
  glowIntensity?: number;
  fontWeight?: number;
  textAlign?: "left" | "center" | "right";
}

export const NeonText: React.FC<NeonTextProps> = ({
  text,
  color = colors.cyan,
  fontSize = 48,
  startFrame = 0,
  useTypewriter = false,
  glowIntensity = 1,
  fontWeight = 700,
  textAlign = "center",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate opacity
  const opacity = fadeIn(frame, startFrame, 20);

  // Calculate scale with spring
  const scale = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  });

  // Typewriter effect
  const visibleChars = useTypewriter
    ? typewriter(frame, startFrame, text, 1)
    : text.length;
  const displayText = text.slice(0, visibleChars);

  // Glow pulse
  const glowCycle = (frame / fps) * Math.PI * 2;
  const glowAmount = 0.7 + Math.sin(glowCycle * 2) * 0.3 * glowIntensity;

  // Multiple text shadows for neon effect
  const textShadow = `
    0 0 ${10 * glowAmount}px ${color},
    0 0 ${20 * glowAmount}px ${color},
    0 0 ${40 * glowAmount}px ${color},
    0 0 ${80 * glowAmount}px ${color}
  `;

  return (
    <div
      style={{
        opacity,
        transform: `scale(${interpolate(scale, [0, 1], [0.8, 1])})`,
        fontSize,
        fontWeight,
        fontFamily: "Inter, system-ui, sans-serif",
        color: colors.textPrimary,
        textShadow,
        textAlign,
        lineHeight: 1.2,
        letterSpacing: "-0.02em",
      }}
    >
      {displayText}
      {useTypewriter && visibleChars < text.length && (
        <span
          style={{
            opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0,
            color,
          }}
        >
          |
        </span>
      )}
    </div>
  );
};
