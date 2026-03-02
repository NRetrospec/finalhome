import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { colors, gradients } from "../lib/colors";
import { scenes } from "../lib/timing";
import { CodeRain } from "../components/CodeRain";
import { Logo } from "../components/Logo";
import { NeonText } from "../components/NeonText";

export const OpeningHook: React.FC = () => {
  const frame = useCurrentFrame(); // Already relative to sequence (0-299)
  const { width, height } = useVideoConfig();
  const scene = scenes.openingHook;

  // Phase 1: Code rain intensifies (0-90 frames / 0-3s)
  const codeRainOpacity = interpolate(frame, [0, 90], [0.1, 0.4], {
    extrapolateRight: "clamp",
  });

  // Phase 2: Logo appears (60-150 frames / 2-5s)
  const logoStart = 60;

  // Phase 3: Tagline appears (120-180 frames / 4-6s)
  const taglineStart = 120;

  // Phase 4: Secondary text (180-240 frames / 6-8s)
  const secondaryStart = 180;

  // Phase 5: Fade transition (270-300 frames / 9-10s)
  const fadeOutStart = 270;
  const fadeOut = interpolate(frame, [fadeOutStart, scene.duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Glowing orbs in background
  const orb1X = 200 + Math.sin(frame * 0.02) * 50;
  const orb1Y = 300 + Math.cos(frame * 0.015) * 30;
  const orb2X = width - 300 + Math.sin(frame * 0.025) * 40;
  const orb2Y = height - 400 + Math.cos(frame * 0.02) * 50;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: gradients.radial,
        position: "relative",
        overflow: "hidden",
        opacity: fadeOut,
      }}
    >
      {/* Background orbs */}
      <div
        style={{
          position: "absolute",
          left: orb1X,
          top: orb1Y,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.cyan}20 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: orb2X,
          top: orb2Y,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.purple}20 0%, transparent 70%)`,
          filter: "blur(50px)",
        }}
      />

      {/* Code rain effect */}
      <CodeRain columnCount={40} speed={1.2} opacity={codeRainOpacity} />

      {/* Main content container */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        {/* Logo */}
        {frame >= logoStart && (
          <Logo startFrame={logoStart} size={180} showGlow={true} />
        )}

        {/* Main tagline */}
        {frame >= taglineStart && (
          <div style={{ marginTop: 40 }}>
            <NeonText
              text="Build The Future"
              fontSize={72}
              color={colors.cyan}
              startFrame={taglineStart}
              useTypewriter={true}
              glowIntensity={1.2}
            />
          </div>
        )}

        {/* Secondary text */}
        {frame >= secondaryStart && (
          <div style={{ marginTop: 24 }}>
            <NeonText
              text="Custom Web Development"
              fontSize={36}
              color={colors.purple}
              startFrame={secondaryStart}
              fontWeight={400}
              glowIntensity={0.6}
            />
          </div>
        )}

        {/* Decorative line */}
        {frame >= secondaryStart + 30 && (
          <div
            style={{
              marginTop: 40,
              width: interpolate(
                frame - secondaryStart - 30,
                [0, 30],
                [0, 300],
                { extrapolateRight: "clamp" }
              ),
              height: 2,
              background: gradients.primary,
              boxShadow: `0 0 10px ${colors.cyan}, 0 0 20px ${colors.cyan}`,
            }}
          />
        )}
      </div>

      {/* Corner decorations */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 40,
          width: 60,
          height: 60,
          borderLeft: `3px solid ${colors.cyan}`,
          borderTop: `3px solid ${colors.cyan}`,
          opacity: interpolate(frame, [0, 30], [0, 0.6], {
            extrapolateRight: "clamp",
          }),
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 40,
          right: 40,
          width: 60,
          height: 60,
          borderRight: `3px solid ${colors.purple}`,
          borderBottom: `3px solid ${colors.purple}`,
          opacity: interpolate(frame, [0, 30], [0, 0.6], {
            extrapolateRight: "clamp",
          }),
        }}
      />
    </div>
  );
};
