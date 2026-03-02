import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { colors } from "../lib/colors";

interface TransitionWipeProps {
  startFrame: number;
  duration?: number;
  direction?: "left" | "right" | "top" | "bottom";
  color?: string;
}

export const TransitionWipe: React.FC<TransitionWipeProps> = ({
  startFrame,
  duration = 15,
  direction = "right",
  color = colors.cyan,
}) => {
  const frame = useCurrentFrame();

  // Calculate progress
  const progress = interpolate(
    frame,
    [startFrame, startFrame + duration / 2, startFrame + duration],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  if (progress === 0) return null;

  // Calculate clip path based on direction
  let clipPath = "";
  switch (direction) {
    case "right":
      clipPath = `inset(0 ${(1 - progress) * 100}% 0 0)`;
      break;
    case "left":
      clipPath = `inset(0 0 0 ${(1 - progress) * 100}%)`;
      break;
    case "top":
      clipPath = `inset(${(1 - progress) * 100}% 0 0 0)`;
      break;
    case "bottom":
      clipPath = `inset(0 0 ${(1 - progress) * 100}% 0)`;
      break;
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: `linear-gradient(135deg, ${color}, ${colors.purple})`,
        clipPath,
        zIndex: 100,
      }}
    >
      {/* Glowing edge */}
      <div
        style={{
          position: "absolute",
          [direction === "right" || direction === "left" ? "width" : "height"]: 4,
          [direction === "right" ? "right" : direction === "left" ? "left" : direction === "top" ? "top" : "bottom"]: 0,
          [direction === "right" || direction === "left" ? "height" : "width"]: "100%",
          background: colors.textPrimary,
          boxShadow: `0 0 20px ${colors.textPrimary}, 0 0 40px ${color}`,
        }}
      />
    </div>
  );
};
