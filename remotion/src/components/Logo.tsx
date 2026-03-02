import React from "react";
import { useCurrentFrame, useVideoConfig, spring, Img, staticFile, interpolate } from "remotion";
import { colors } from "../lib/colors";

interface LogoProps {
  startFrame?: number;
  size?: number;
  showGlow?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  startFrame = 0,
  size = 200,
  showGlow = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scale animation
  const scale = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 12, stiffness: 100, mass: 0.8 },
  });

  // Rotation animation (subtle)
  const rotation = interpolate(
    frame - startFrame,
    [0, 30],
    [-10, 0],
    { extrapolateRight: "clamp" }
  );

  // Glow pulse
  const glowIntensity = 0.5 + Math.sin((frame / fps) * Math.PI * 2) * 0.3;

  // Opacity fade in
  const opacity = interpolate(
    frame - startFrame,
    [0, 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${scale}) rotate(${rotation}deg)`,
        opacity,
      }}
    >
      {/* Glow effect behind logo */}
      {showGlow && (
        <div
          style={{
            position: "absolute",
            width: size * 1.5,
            height: size * 1.5,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${colors.cyan}40 0%, transparent 70%)`,
            filter: `blur(${20 * glowIntensity}px)`,
          }}
        />
      )}

      {/* Logo image */}
      <Img
        src={staticFile("Nretrospec-logos-FINALS.png")}
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          position: "relative",
          zIndex: 1,
          filter: showGlow
            ? `drop-shadow(0 0 ${10 * glowIntensity}px ${colors.cyan})`
            : "none",
        }}
      />
    </div>
  );
};
