import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { colors, gradients } from "../lib/colors";
import { scenes } from "../lib/timing";
import { CyberCard } from "../components/CyberCard";
import { NeonText } from "../components/NeonText";

export const ProblemSolution: React.FC = () => {
  const frame = useCurrentFrame(); // Already relative to sequence (0-449)
  const { fps } = useVideoConfig();
  const scene = scenes.problemSolution;

  // Fade in
  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Phase timing
  const problemCardStart = 30;
  const vsStart = 150;
  const solutionCardStart = 180;
  const highlightStart = 300;
  const fadeOutStart = scene.duration - 30;

  const fadeOut = interpolate(
    frame,
    [fadeOutStart, scene.duration],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Template problems
  const templateProblems = [
    "Generic designs",
    "Slow loading times",
    "Limited customization",
    "Poor mobile experience",
  ];

  // Custom solutions
  const customSolutions = [
    "Unique brand identity",
    "Blazing fast performance",
    "Fully tailored features",
    "Mobile-first design",
  ];

  // VS animation
  const vsScale = spring({
    frame: frame - vsStart,
    fps,
    config: { damping: 10, stiffness: 100, mass: 0.5 },
  });

  // Highlight animation (which side is highlighted)
  const highlightProgress = interpolate(
    frame - highlightStart,
    [0, 150],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

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
      {/* Background grid */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `
            linear-gradient(${colors.cyan}10 1px, transparent 1px),
            linear-gradient(90deg, ${colors.cyan}10 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          opacity: 0.3,
        }}
      />

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 60,
          width: "100%",
          textAlign: "center",
        }}
      >
        <NeonText
          text="Why Custom?"
          fontSize={56}
          color={colors.cyan}
          startFrame={10}
          glowIntensity={0.8}
        />
      </div>

      {/* Comparison container */}
      <div
        style={{
          position: "absolute",
          top: 180,
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 80,
        }}
      >
        {/* Template side (Problem) */}
        <div
          style={{
            opacity: interpolate(highlightProgress, [0, 0.5], [1, 0.4], {
              extrapolateRight: "clamp",
            }),
            transform: `scale(${interpolate(highlightProgress, [0, 0.5], [1, 0.95], {
              extrapolateRight: "clamp",
            })})`,
          }}
        >
          {frame >= problemCardStart && (
            <CyberCard
              startFrame={problemCardStart}
              width={450}
              slideFrom="left"
              borderColor={colors.pink}
              padding={32}
            >
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: colors.pink,
                  marginBottom: 24,
                  fontFamily: "Inter, system-ui, sans-serif",
                  textAlign: "center",
                }}
              >
                ❌ Template Websites
              </div>
              {templateProblems.map((problem, index) => {
                const itemStart = problemCardStart + 30 + index * 20;
                const itemOpacity = interpolate(
                  frame - itemStart,
                  [0, 15],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );
                return (
                  <div
                    key={problem}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 16,
                      opacity: itemOpacity,
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: colors.pink,
                        marginRight: 12,
                        boxShadow: `0 0 10px ${colors.pink}`,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 20,
                        color: colors.textSecondary,
                        fontFamily: "Inter, system-ui, sans-serif",
                      }}
                    >
                      {problem}
                    </span>
                  </div>
                );
              })}
            </CyberCard>
          )}
        </div>

        {/* VS divider */}
        {frame >= vsStart && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: 350,
              transform: `scale(${vsScale})`,
            }}
          >
            <div
              style={{
                width: 4,
                height: 100,
                background: `linear-gradient(to bottom, transparent, ${colors.purple})`,
              }}
            />
            <div
              style={{
                fontSize: 48,
                fontWeight: 900,
                color: colors.purple,
                textShadow: `0 0 20px ${colors.purple}, 0 0 40px ${colors.purple}`,
                margin: "20px 0",
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              VS
            </div>
            <div
              style={{
                width: 4,
                height: 100,
                background: `linear-gradient(to bottom, ${colors.purple}, transparent)`,
              }}
            />
          </div>
        )}

        {/* Custom side (Solution) */}
        <div
          style={{
            opacity: interpolate(highlightProgress, [0.5, 1], [0.6, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            transform: `scale(${interpolate(highlightProgress, [0.5, 1], [0.95, 1.05], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })})`,
          }}
        >
          {frame >= solutionCardStart && (
            <CyberCard
              startFrame={solutionCardStart}
              width={450}
              slideFrom="right"
              borderColor={colors.cyan}
              padding={32}
            >
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: colors.cyan,
                  marginBottom: 24,
                  fontFamily: "Inter, system-ui, sans-serif",
                  textAlign: "center",
                }}
              >
                ✓ Custom Development
              </div>
              {customSolutions.map((solution, index) => {
                const itemStart = solutionCardStart + 30 + index * 20;
                const itemOpacity = interpolate(
                  frame - itemStart,
                  [0, 15],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );
                return (
                  <div
                    key={solution}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 16,
                      opacity: itemOpacity,
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: colors.cyan,
                        marginRight: 12,
                        boxShadow: `0 0 10px ${colors.cyan}`,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 20,
                        color: colors.textPrimary,
                        fontFamily: "Inter, system-ui, sans-serif",
                      }}
                    >
                      {solution}
                    </span>
                  </div>
                );
              })}
            </CyberCard>
          )}
        </div>
      </div>

      {/* Bottom tagline */}
      {frame >= highlightStart + 50 && (
        <div
          style={{
            position: "absolute",
            bottom: 80,
            width: "100%",
            textAlign: "center",
          }}
        >
          <NeonText
            text="Stand Out From The Crowd"
            fontSize={40}
            color={colors.purple}
            startFrame={highlightStart + 50}
            glowIntensity={0.8}
          />
        </div>
      )}
    </div>
  );
};
