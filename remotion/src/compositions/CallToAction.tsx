import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { colors, gradients } from "../lib/colors";
import { Logo } from "../components/Logo";
import { NeonText } from "../components/NeonText";

export const CallToAction: React.FC = () => {
  const frame = useCurrentFrame(); // Already relative to sequence (0-149)
  const { fps } = useVideoConfig();

  // Fade in (no fade out - ends on strong note)
  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Phase timing
  const logoStart = 0;
  const headlineStart = 20;
  const ctaStart = 50;
  const contactStart = 80;
  const finalGlowStart = 100;

  // Pulsing glow for CTA
  const glowIntensity = 0.5 + Math.sin((frame / fps) * Math.PI * 4) * 0.5;

  // Button scale animation
  const buttonScale = spring({
    frame: frame - ctaStart,
    fps,
    config: { damping: 8, stiffness: 100, mass: 0.5 },
  });

  // Final dramatic glow
  const finalGlow = interpolate(
    frame - finalGlowStart,
    [0, 50],
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
        opacity: fadeIn,
      }}
    >
      {/* Dramatic background glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 1200,
          height: 1200,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.cyan}${Math.floor(finalGlow * 30).toString(16).padStart(2, "0")} 0%, transparent 50%)`,
          filter: "blur(80px)",
        }}
      />

      {/* Animated rays */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * 360 + frame * 0.5;
        const rayOpacity = interpolate(
          Math.sin((frame + i * 20) * 0.05),
          [-1, 1],
          [0.05, 0.15]
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 4,
              height: 600,
              background: `linear-gradient(to top, ${colors.cyan}00, ${colors.cyan})`,
              transformOrigin: "bottom center",
              transform: `translateX(-50%) rotate(${angle}deg)`,
              opacity: rayOpacity * finalGlow,
            }}
          />
        );
      })}

      {/* Main content */}
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
        <Logo startFrame={logoStart} size={120} showGlow={true} />

        {/* Headline */}
        {frame >= headlineStart && (
          <div style={{ marginTop: 30 }}>
            <NeonText
              text="Ready to Build?"
              fontSize={64}
              color={colors.cyan}
              startFrame={headlineStart}
              glowIntensity={1.2}
            />
          </div>
        )}

        {/* CTA Button */}
        {frame >= ctaStart && (
          <div
            style={{
              marginTop: 40,
              transform: `scale(${Math.max(0, buttonScale)})`,
            }}
          >
            <div
              style={{
                padding: "20px 60px",
                borderRadius: 12,
                background: `linear-gradient(135deg, ${colors.cyan}, ${colors.purple})`,
                boxShadow: `
                  0 0 ${30 * glowIntensity}px ${colors.cyan},
                  0 0 ${60 * glowIntensity}px ${colors.purple}50,
                  inset 0 0 20px rgba(255,255,255,0.1)
                `,
                border: `2px solid ${colors.textPrimary}40`,
              }}
            >
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: colors.textPrimary,
                  fontFamily: "Inter, system-ui, sans-serif",
                  textShadow: `0 2px 4px rgba(0,0,0,0.3)`,
                }}
              >
                Get Started Today
              </span>
            </div>
          </div>
        )}

        {/* Contact info */}
        {frame >= contactStart && (
          <div
            style={{
              marginTop: 50,
              textAlign: "center",
              opacity: interpolate(frame - contactStart, [0, 20], [0, 1], {
                extrapolateRight: "clamp",
              }),
            }}
          >
            <div
              style={{
                fontSize: 24,
                color: colors.textSecondary,
                fontFamily: "Inter, system-ui, sans-serif",
                marginBottom: 12,
              }}
            >
              nretrospec.com
            </div>
            <div
              style={{
                fontSize: 20,
                color: colors.cyan,
                fontFamily: "Inter, system-ui, sans-serif",
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              Starting at $1,000 · Delivered in 2–4 Weeks
            </div>
            <div
              style={{
                fontSize: 16,
                color: colors.textMuted,
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              Custom Web Development · No Templates · Free Consultation
            </div>
          </div>
        )}
      </div>

      {/* Corner accents */}
      <div
        style={{
          position: "absolute",
          top: 30,
          left: 30,
          width: 80,
          height: 80,
          borderLeft: `3px solid ${colors.cyan}`,
          borderTop: `3px solid ${colors.cyan}`,
          opacity: 0.6,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 30,
          right: 30,
          width: 80,
          height: 80,
          borderRight: `3px solid ${colors.purple}`,
          borderTop: `3px solid ${colors.purple}`,
          opacity: 0.6,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 30,
          left: 30,
          width: 80,
          height: 80,
          borderLeft: `3px solid ${colors.purple}`,
          borderBottom: `3px solid ${colors.purple}`,
          opacity: 0.6,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 30,
          right: 30,
          width: 80,
          height: 80,
          borderRight: `3px solid ${colors.cyan}`,
          borderBottom: `3px solid ${colors.cyan}`,
          opacity: 0.6,
        }}
      />

      {/* Bottom tagline */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          width: "100%",
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontSize: 14,
            color: colors.textMuted,
            fontFamily: "Inter, system-ui, sans-serif",
            letterSpacing: 2,
          }}
        >
          N RETROSPEC © 2025
        </span>
      </div>
    </div>
  );
};
