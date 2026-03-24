import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { colors, gradients } from "../lib/colors";

// Brand new Scene 1 — completely different from the code rain / logo opener
// Uses a dramatic "problem-reveal" with red warning stats, then brand flash
export const OpeningHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase timing (total: 300 frames / 10s)
  const HEADLINE_IN = 8;        // problem headline slides in
  const STAT_1_IN = 55;         // first stat
  const STAT_2_IN = 85;         // second stat
  const STAT_3_IN = 115;        // third stat
  const FLASH_START = 155;      // white flash + brand reveal
  const BRAND_IN = 160;
  const SLOGAN_IN = 205;
  const FADE_OUT_START = 272;

  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [FADE_OUT_START, 300], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pulsing red warning glow for problem phase
  const warningGlow = 0.06 + Math.abs(Math.sin(frame * 0.04)) * 0.1;

  // White flash on brand reveal
  const flashOpacity = interpolate(
    frame,
    [FLASH_START, FLASH_START + 4, FLASH_START + 18],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Phase boundary
  const isProblemPhase = frame < BRAND_IN;

  // Brand spring pop
  const brandScale = spring({
    frame: frame - BRAND_IN,
    fps,
    config: { damping: 14, stiffness: 220, mass: 0.7 },
  });

  // Divider line grows after brand
  const dividerWidth = interpolate(frame, [BRAND_IN + 18, BRAND_IN + 50], [0, 640], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const sloganOpacity = interpolate(frame, [SLOGAN_IN, SLOGAN_IN + 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sloganY = interpolate(frame, [SLOGAN_IN, SLOGAN_IN + 28], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const stats = [
    { value: "53%", label: "of visitors leave if your site takes 3+ seconds to load", startFrame: STAT_1_IN },
    { value: "75%", label: "judge your credibility based on design alone", startFrame: STAT_2_IN },
    { value: "88%", label: "won't return after a single bad experience", startFrame: STAT_3_IN },
  ];

  // Scanning line across screen
  const scanLineY = ((frame * 4) % 1100) - 20;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "radial-gradient(ellipse at center, #0c0c0f 0%, #04040a 100%)",
        position: "relative",
        overflow: "hidden",
        opacity: fadeIn * fadeOut,
      }}
    >
      {/* Red warning ambient (problem phase only) */}
      {isProblemPhase && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 1400,
            height: 1000,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(239,68,68,${warningGlow}) 0%, transparent 65%)`,
            filter: "blur(80px)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Cyan ambient (brand phase) */}
      {!isProblemPhase && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 1200,
            height: 1200,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${colors.cyan}18 0%, ${colors.purple}0a 50%, transparent 70%)`,
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Subtle grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          pointerEvents: "none",
        }}
      />

      {/* Scan line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: scanLineY,
          width: "100%",
          height: 2,
          background: `linear-gradient(90deg, transparent 0%, ${isProblemPhase ? "rgba(239,68,68,0.25)" : colors.cyan + "25"} 40%, ${isProblemPhase ? "rgba(239,68,68,0.25)" : colors.cyan + "25"} 60%, transparent 100%)`,
          pointerEvents: "none",
        }}
      />

      {/* White flash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "white",
          opacity: flashOpacity,
          pointerEvents: "none",
          zIndex: 50,
        }}
      />

      {/* === PROBLEM PHASE (frames 0–155) === */}
      {isProblemPhase && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 40,
          }}
        >
          {/* Headline */}
          <div
            style={{
              opacity: interpolate(frame, [HEADLINE_IN, HEADLINE_IN + 22], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              transform: `translateY(${interpolate(frame, [HEADLINE_IN, HEADLINE_IN + 22], [28, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}px)`,
              textAlign: "center",
              marginBottom: 56,
            }}
          >
            <div
              style={{
                fontSize: 42,
                fontWeight: 700,
                color: "#ef4444",
                fontFamily: "Inter, system-ui, sans-serif",
                textTransform: "uppercase",
                letterSpacing: 4,
                marginBottom: 8,
                textShadow: "0 0 30px rgba(239,68,68,0.7)",
              }}
            >
              The Hard Truth
            </div>
            <div
              style={{
                fontSize: 68,
                fontWeight: 900,
                color: "#f9fafb",
                fontFamily: "Inter, system-ui, sans-serif",
                textTransform: "uppercase",
                letterSpacing: -1,
                lineHeight: 1.05,
              }}
            >
              Your Website Is<br />
              <span style={{ color: "#ef4444", textShadow: "0 0 20px rgba(239,68,68,0.5)" }}>
                Losing You Customers
              </span>
            </div>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              alignItems: "flex-start",
              maxWidth: 860,
            }}
          >
            {stats.map((stat) => {
              const opacity = interpolate(frame, [stat.startFrame, stat.startFrame + 18], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const xOffset = interpolate(frame, [stat.startFrame, stat.startFrame + 18], [-50, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });

              return (
                <div
                  key={stat.value}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 28,
                    opacity,
                    transform: `translateX(${xOffset}px)`,
                  }}
                >
                  {/* Red accent bar */}
                  <div
                    style={{
                      width: 4,
                      height: 52,
                      background: "#ef4444",
                      boxShadow: "0 0 14px rgba(239,68,68,0.8)",
                      borderRadius: 2,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 60,
                      fontWeight: 900,
                      color: "#ef4444",
                      fontFamily: "Inter, system-ui, sans-serif",
                      textShadow: "0 0 22px rgba(239,68,68,0.8)",
                      minWidth: 130,
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </span>
                  <span
                    style={{
                      fontSize: 22,
                      color: "#9ca3af",
                      fontFamily: "Inter, system-ui, sans-serif",
                      lineHeight: 1.3,
                      maxWidth: 500,
                    }}
                  >
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* === BRAND REVEAL PHASE (frames 160–300) === */}
      {!isProblemPhase && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Brand name */}
          <div
            style={{
              transform: `scale(${Math.max(0, brandScale)})`,
              opacity: Math.max(0, brandScale),
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 96,
                fontWeight: 900,
                fontFamily: "Inter, system-ui, sans-serif",
                background: gradients.primary,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: -3,
                lineHeight: 1,
                filter: `drop-shadow(0 0 40px ${colors.cyan}55)`,
              }}
            >
              N RETROSPEC
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              width: dividerWidth,
              height: 3,
              background: gradients.primary,
              margin: "28px 0",
              boxShadow: `0 0 18px ${colors.cyan}80`,
              borderRadius: 2,
            }}
          />

          {/* Slogan */}
          <div
            style={{
              opacity: sloganOpacity,
              transform: `translateY(${sloganY}px)`,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 30,
                fontWeight: 500,
                color: "#e5e7eb",
                fontFamily: "Inter, system-ui, sans-serif",
                letterSpacing: 0.5,
                lineHeight: 1.4,
              }}
            >
              Websites That Turn Visitors Into Customers
            </div>
            <div
              style={{
                marginTop: 14,
                fontSize: 18,
                color: colors.textMuted,
                fontFamily: "Inter, system-ui, sans-serif",
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              We Fix That.
            </div>
          </div>
        </div>
      )}

      {/* Corner brackets */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 40,
          width: 56,
          height: 56,
          borderLeft: `3px solid ${isProblemPhase ? "#ef4444" : colors.cyan}`,
          borderTop: `3px solid ${isProblemPhase ? "#ef4444" : colors.cyan}`,
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 40,
          right: 40,
          width: 56,
          height: 56,
          borderRight: `3px solid ${isProblemPhase ? "#ef4444" : colors.purple}`,
          borderBottom: `3px solid ${isProblemPhase ? "#ef4444" : colors.purple}`,
          opacity: 0.5,
        }}
      />
    </div>
  );
};
