import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { colors, gradients } from "../lib/colors";
import { scenes } from "../lib/timing";
import { projects } from "../lib/projectData";
import { ProjectCard } from "../components/ProjectCard";
import { NeonText } from "../components/NeonText";

export const PortfolioShowcase: React.FC = () => {
  const frame = useCurrentFrame(); // Already relative to sequence (0-599)
  const { width, height } = useVideoConfig();
  const scene = scenes.portfolioShowcase;

  // Fade in/out
  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [scene.duration - 30, scene.duration],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Each project gets 100 frames (about 3.3 seconds)
  const framesPerProject = 100;
  const currentProjectIndex = Math.min(
    Math.floor(frame / framesPerProject),
    projects.length - 1
  );
  const projectLocalFrame = frame % framesPerProject;

  // Project counter animation
  const counterText = `${currentProjectIndex + 1} / ${projects.length}`;

  // Progress bar
  const overallProgress = frame / scene.duration;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: gradients.radial,
        position: "relative",
        overflow: "hidden",
        opacity: fadeIn * fadeOut,
      }}
    >
      {/* Animated background particles */}
      {Array.from({ length: 20 }).map((_, i) => {
        const x = (width / 20) * i + Math.sin(frame * 0.02 + i) * 30;
        const y = height / 2 + Math.cos(frame * 0.015 + i * 0.5) * 200;
        const size = 4 + Math.sin(frame * 0.03 + i) * 2;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: i % 3 === 0 ? colors.cyan : i % 3 === 1 ? colors.purple : colors.pink,
              opacity: 0.3,
              filter: "blur(2px)",
            }}
          />
        );
      })}

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 40,
          width: "100%",
          textAlign: "center",
        }}
      >
        <NeonText
          text="Our Work"
          fontSize={48}
          color={colors.cyan}
          startFrame={0}
          glowIntensity={0.6}
        />
      </div>

      {/* Project counter */}
      <div
        style={{
          position: "absolute",
          top: 120,
          right: 80,
          fontSize: 24,
          fontWeight: 600,
          color: colors.textSecondary,
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {counterText}
      </div>

      {/* Main project display */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {projects.map((project, index) => {
          const isActive = index === currentProjectIndex;
          const isPrevious = index === currentProjectIndex - 1;
          const isNext = index === currentProjectIndex + 1;

          if (!isActive && !isPrevious && !isNext) return null;

          // Calculate position and scale
          let xOffset = 0;
          let scale = 1;
          let opacity = 1;
          let zIndex = 1;

          if (isPrevious) {
            xOffset = -350;
            scale = 0.7;
            opacity = interpolate(projectLocalFrame, [0, 30], [0.5, 0], {
              extrapolateRight: "clamp",
            });
            zIndex = 0;
          } else if (isNext) {
            xOffset = 350;
            scale = 0.7;
            opacity = interpolate(projectLocalFrame, [70, 100], [0, 0.5], {
              extrapolateLeft: "clamp",
            });
            zIndex = 0;
          } else if (isActive) {
            // Entry animation
            const entryOffset = interpolate(projectLocalFrame, [0, 30], [100, 0], {
              extrapolateRight: "clamp",
            });
            xOffset = entryOffset;

            // Exit animation
            if (projectLocalFrame > 70) {
              xOffset = interpolate(projectLocalFrame, [70, 100], [0, -100], {
                extrapolateLeft: "clamp",
              });
            }
            zIndex = 2;
          }

          return (
            <div
              key={project.id}
              style={{
                position: "absolute",
                transform: `translateX(${xOffset}px) scale(${scale})`,
                opacity,
                zIndex,
              }}
            >
              <ProjectCard
                project={project}
                startFrame={index * framesPerProject}
                isActive={isActive}
              />
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: "50%",
          transform: "translateX(-50%)",
          width: 400,
          height: 4,
          background: `${colors.cyan}30`,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${overallProgress * 100}%`,
            height: "100%",
            background: gradients.primary,
            boxShadow: `0 0 10px ${colors.cyan}`,
          }}
        />
      </div>

      {/* Project dots */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 12,
        }}
      >
        {projects.map((_, index) => (
          <div
            key={index}
            style={{
              width: index === currentProjectIndex ? 24 : 8,
              height: 8,
              borderRadius: 4,
              background:
                index === currentProjectIndex
                  ? colors.cyan
                  : `${colors.cyan}40`,
              boxShadow:
                index === currentProjectIndex
                  ? `0 0 10px ${colors.cyan}`
                  : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
};
