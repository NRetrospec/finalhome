import { interpolate, spring, Easing } from "remotion";

// Spring configurations
export const springConfig = {
  fast: { damping: 200, mass: 0.5, stiffness: 200 },
  medium: { damping: 100, mass: 0.8, stiffness: 150 },
  slow: { damping: 50, mass: 1, stiffness: 100 },
  bouncy: { damping: 12, mass: 0.5, stiffness: 200 },
};

// Fade in animation
export const fadeIn = (
  frame: number,
  startFrame: number,
  duration: number = 15
): number => {
  return interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

// Fade out animation
export const fadeOut = (
  frame: number,
  endFrame: number,
  duration: number = 15
): number => {
  return interpolate(frame, [endFrame - duration, endFrame], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

// Slide in from direction
export const slideIn = (
  frame: number,
  fps: number,
  startFrame: number,
  direction: "left" | "right" | "top" | "bottom" = "left",
  distance: number = 100
): number => {
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: springConfig.medium,
  });

  const directionMultiplier =
    direction === "right" || direction === "bottom" ? 1 : -1;
  return interpolate(progress, [0, 1], [distance * directionMultiplier, 0]);
};

// Scale up animation
export const scaleUp = (
  frame: number,
  fps: number,
  startFrame: number,
  from: number = 0,
  to: number = 1
): number => {
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: springConfig.bouncy,
  });
  return interpolate(progress, [0, 1], [from, to]);
};

// Typewriter effect - returns number of visible characters
export const typewriter = (
  frame: number,
  startFrame: number,
  text: string,
  charsPerFrame: number = 0.5
): number => {
  const elapsed = Math.max(0, frame - startFrame);
  return Math.min(Math.floor(elapsed * charsPerFrame), text.length);
};

// Glow pulse animation
export const glowPulse = (
  frame: number,
  fps: number,
  intensity: number = 1
): number => {
  const cycle = (frame / fps) * Math.PI * 2;
  return 0.5 + Math.sin(cycle) * 0.5 * intensity;
};

// Stagger delay for multiple items
export const staggerDelay = (
  index: number,
  delayPerItem: number = 5
): number => {
  return index * delayPerItem;
};

// Easing presets
export const easings = {
  easeOutExpo: Easing.out(Easing.exp),
  easeInOutCubic: Easing.inOut(Easing.cubic),
  easeOutBack: Easing.out(Easing.back(1.7)),
};
