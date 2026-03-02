import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { colors } from "../lib/colors";

interface TechBadgeProps {
  text: string;
  startFrame?: number;
  variant?: "tech" | "industry";
  index?: number;
}

export const TechBadge: React.FC<TechBadgeProps> = ({
  text,
  startFrame = 0,
  variant = "tech",
  index = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Staggered animation
  const delay = index * 3;
  const scale = spring({
    frame: frame - startFrame - delay,
    fps,
    config: { damping: 15, stiffness: 200, mass: 0.5 },
  });

  const bgColor = variant === "tech" ? colors.techBadgeBg : colors.industryBadgeBg;
  const textColor = variant === "tech" ? colors.techBadgeText : colors.industryBadgeText;
  const borderColor = variant === "tech" ? colors.purple : colors.cyan;

  return (
    <span
      style={{
        display: "inline-block",
        padding: "6px 12px",
        borderRadius: 6,
        background: bgColor,
        color: textColor,
        fontSize: 14,
        fontWeight: 500,
        fontFamily: "Inter, system-ui, sans-serif",
        border: `1px solid ${borderColor}40`,
        transform: `scale(${scale})`,
        opacity: scale,
        marginRight: 8,
        marginBottom: 8,
      }}
    >
      {text}
    </span>
  );
};
