import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { colors } from "../lib/colors";
import { fadeIn, slideIn } from "../lib/animations";

interface CyberCardProps {
  children: React.ReactNode;
  startFrame?: number;
  width?: number | string;
  height?: number | string;
  slideFrom?: "left" | "right" | "top" | "bottom";
  borderColor?: string;
  padding?: number;
}

export const CyberCard: React.FC<CyberCardProps> = ({
  children,
  startFrame = 0,
  width = 400,
  height = "auto",
  slideFrom = "left",
  borderColor = colors.cyan,
  padding = 24,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animations
  const opacity = fadeIn(frame, startFrame, 15);
  const slideOffset = slideIn(frame, fps, startFrame, slideFrom, 50);

  // Border scan animation
  const scanProgress = interpolate(
    (frame - startFrame) % 120,
    [0, 120],
    [0, 100],
    { extrapolateRight: "clamp" }
  );

  // Glow pulse
  const glowPulse = 0.3 + Math.sin((frame / fps) * Math.PI * 2) * 0.2;

  // Transform based on slide direction
  const transform =
    slideFrom === "left" || slideFrom === "right"
      ? `translateX(${slideOffset}px)`
      : `translateY(${slideOffset}px)`;

  return (
    <div
      style={{
        opacity,
        transform,
        width,
        height,
        padding,
        background: colors.cardBg,
        borderRadius: 12,
        border: `1px solid ${borderColor}`,
        boxShadow: `
          0 0 ${20 * glowPulse}px ${borderColor}40,
          inset 0 0 ${30 * glowPulse}px ${borderColor}10
        `,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated border scan effect */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: `${scanProgress}%`,
          width: 100,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${borderColor}, transparent)`,
          transform: "translateX(-50%)",
        }}
      />

      {/* Corner accents */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 20,
          height: 20,
          borderTop: `2px solid ${borderColor}`,
          borderLeft: `2px solid ${borderColor}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 20,
          height: 20,
          borderTop: `2px solid ${borderColor}`,
          borderRight: `2px solid ${borderColor}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 20,
          height: 20,
          borderBottom: `2px solid ${borderColor}`,
          borderLeft: `2px solid ${borderColor}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: 20,
          height: 20,
          borderBottom: `2px solid ${borderColor}`,
          borderRight: `2px solid ${borderColor}`,
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
};
