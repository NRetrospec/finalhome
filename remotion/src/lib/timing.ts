// Video timing constants
export const FPS = 30;
export const TOTAL_DURATION = 60; // seconds
export const TOTAL_FRAMES = TOTAL_DURATION * FPS; // 1800 frames

// Scene timing configuration
export const scenes = {
  openingHook: {
    name: "Opening Hook",
    start: 0,
    end: 300, // 0-10 seconds
    duration: 300,
  },
  problemSolution: {
    name: "Problem/Solution",
    start: 300,
    end: 750, // 10-25 seconds
    duration: 450,
  },
  portfolioShowcase: {
    name: "Portfolio Showcase",
    start: 750,
    end: 1350, // 25-45 seconds
    duration: 600,
  },
  valueProposition: {
    name: "Value Proposition",
    start: 1350,
    end: 1650, // 45-55 seconds
    duration: 300,
  },
  callToAction: {
    name: "Call to Action",
    start: 1650,
    end: 1800, // 55-60 seconds
    duration: 150,
  },
};

// Transition duration in frames
export const TRANSITION_DURATION = 15; // 0.5 seconds

// Helper to check if frame is within a scene
export const isInScene = (
  frame: number,
  scene: { start: number; end: number }
): boolean => {
  return frame >= scene.start && frame < scene.end;
};

// Get local frame within a scene (0-based)
export const getLocalFrame = (
  globalFrame: number,
  sceneStart: number
): number => {
  return Math.max(0, globalFrame - sceneStart);
};
