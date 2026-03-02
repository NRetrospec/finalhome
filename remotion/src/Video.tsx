import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { colors } from "./lib/colors";
import { scenes, TRANSITION_DURATION } from "./lib/timing";
import { OpeningHook } from "./compositions/OpeningHook";
import { ProblemSolution } from "./compositions/ProblemSolution";
import { PortfolioShowcase } from "./compositions/PortfolioShowcase";
import { ValueProposition } from "./compositions/ValueProposition";
import { CallToAction } from "./compositions/CallToAction";
import { TransitionWipe } from "./components/TransitionWipe";

export const NRetrospecTrailer: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.background,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* Scene 1: Opening Hook (0-300 frames / 0-10s) */}
      <Sequence from={scenes.openingHook.start} durationInFrames={scenes.openingHook.duration}>
        <OpeningHook />
      </Sequence>

      {/* Transition 1 -> 2 */}
      <TransitionWipe
        startFrame={scenes.openingHook.end - TRANSITION_DURATION}
        duration={TRANSITION_DURATION * 2}
        direction="right"
        color={colors.cyan}
      />

      {/* Scene 2: Problem/Solution (300-750 frames / 10-25s) */}
      <Sequence from={scenes.problemSolution.start} durationInFrames={scenes.problemSolution.duration}>
        <ProblemSolution />
      </Sequence>

      {/* Transition 2 -> 3 */}
      <TransitionWipe
        startFrame={scenes.problemSolution.end - TRANSITION_DURATION}
        duration={TRANSITION_DURATION * 2}
        direction="bottom"
        color={colors.purple}
      />

      {/* Scene 3: Portfolio Showcase (750-1350 frames / 25-45s) */}
      <Sequence from={scenes.portfolioShowcase.start} durationInFrames={scenes.portfolioShowcase.duration}>
        <PortfolioShowcase />
      </Sequence>

      {/* Transition 3 -> 4 */}
      <TransitionWipe
        startFrame={scenes.portfolioShowcase.end - TRANSITION_DURATION}
        duration={TRANSITION_DURATION * 2}
        direction="left"
        color={colors.pink}
      />

      {/* Scene 4: Value Proposition (1350-1650 frames / 45-55s) */}
      <Sequence from={scenes.valueProposition.start} durationInFrames={scenes.valueProposition.duration}>
        <ValueProposition />
      </Sequence>

      {/* Transition 4 -> 5 */}
      <TransitionWipe
        startFrame={scenes.valueProposition.end - TRANSITION_DURATION}
        duration={TRANSITION_DURATION * 2}
        direction="top"
        color={colors.cyan}
      />

      {/* Scene 5: Call to Action (1650-1800 frames / 55-60s) */}
      <Sequence from={scenes.callToAction.start} durationInFrames={scenes.callToAction.duration}>
        <CallToAction />
      </Sequence>
    </AbsoluteFill>
  );
};
