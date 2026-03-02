import React from "react";
import { Composition } from "remotion";
import { NRetrospecTrailer } from "./Video";
import { FPS, TOTAL_FRAMES } from "./lib/timing";

// Individual scene compositions for testing
import { OpeningHook } from "./compositions/OpeningHook";
import { ProblemSolution } from "./compositions/ProblemSolution";
import { PortfolioShowcase } from "./compositions/PortfolioShowcase";
import { ValueProposition } from "./compositions/ValueProposition";
import { CallToAction } from "./compositions/CallToAction";
import { scenes } from "./lib/timing";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Main full video composition */}
      <Composition
        id="NRetrospecTrailer"
        component={NRetrospecTrailer}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />

      {/* Individual scene compositions for preview/testing */}
      <Composition
        id="OpeningHook"
        component={OpeningHook}
        durationInFrames={scenes.openingHook.duration}
        fps={FPS}
        width={1920}
        height={1080}
      />

      <Composition
        id="ProblemSolution"
        component={ProblemSolution}
        durationInFrames={scenes.problemSolution.duration}
        fps={FPS}
        width={1920}
        height={1080}
      />

      <Composition
        id="PortfolioShowcase"
        component={PortfolioShowcase}
        durationInFrames={scenes.portfolioShowcase.duration}
        fps={FPS}
        width={1920}
        height={1080}
      />

      <Composition
        id="ValueProposition"
        component={ValueProposition}
        durationInFrames={scenes.valueProposition.duration}
        fps={FPS}
        width={1920}
        height={1080}
      />

      <Composition
        id="CallToAction"
        component={CallToAction}
        durationInFrames={scenes.callToAction.duration}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
