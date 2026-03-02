import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { colors, gradients } from "../lib/colors";
import { scenes } from "../lib/timing";
import { stats, services } from "../lib/projectData";
import { NeonText } from "../components/NeonText";
import { CyberCard } from "../components/CyberCard";

export const ValueProposition: React.FC = () => {
  const frame = useCurrentFrame(); // Already relative to sequence (0-299)
  const { fps } = useVideoConfig();
  const scene = scenes.valueProposition;

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

  // Phase timing
  const statsStart = 30;
  const servicesStart = 120;

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
      {/* Radial gradient accent */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.purple}15 0%, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 50,
          width: "100%",
          textAlign: "center",
        }}
      >
        <NeonText
          text="Why Choose Us"
          fontSize={52}
          color={colors.cyan}
          startFrame={0}
          glowIntensity={0.8}
        />
      </div>

      {/* Stats row */}
      <div
        style={{
          position: "absolute",
          top: 160,
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: 60,
        }}
      >
        {stats.map((stat, index) => {
          const statStart = statsStart + index * 15;
          const scale = spring({
            frame: frame - statStart,
            fps,
            config: { damping: 12, stiffness: 150, mass: 0.5 },
          });

          // Animated counter effect
          const targetValue = parseInt(stat.value) || 0;
          const displayValue = stat.value.includes("+")
            ? `${Math.min(
                Math.floor(interpolate(frame - statStart, [0, 30], [0, targetValue], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })),
                targetValue
              )}+`
            : stat.value.includes("/")
            ? stat.value
            : stat.value.includes("%")
            ? `${Math.min(
                Math.floor(interpolate(frame - statStart, [0, 30], [0, targetValue], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })),
                targetValue
              )}%`
            : stat.value;

          return (
            <div
              key={stat.label}
              style={{
                textAlign: "center",
                transform: `scale(${Math.max(0, scale)})`,
                opacity: Math.max(0, scale),
              }}
            >
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 800,
                  fontFamily: "Inter, system-ui, sans-serif",
                  background: gradients.primary,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "none",
                  filter: `drop-shadow(0 0 10px ${colors.cyan}50)`,
                }}
              >
                {displayValue}
              </div>
              <div
                style={{
                  fontSize: 16,
                  color: colors.textSecondary,
                  fontFamily: "Inter, system-ui, sans-serif",
                  marginTop: 8,
                }}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Services grid */}
      <div
        style={{
          position: "absolute",
          top: 360,
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: 30,
          padding: "0 80px",
        }}
      >
        {services.map((service, index) => {
          const serviceStart = servicesStart + index * 20;
          const cardColors = [colors.cyan, colors.purple, colors.pink, colors.cyan];

          return (
            frame >= serviceStart && (
              <CyberCard
                key={service.title}
                startFrame={serviceStart}
                width={260}
                height={200}
                slideFrom={index % 2 === 0 ? "bottom" : "top"}
                borderColor={cardColors[index]}
                padding={24}
              >
                <div
                  style={{
                    fontSize: 40,
                    marginBottom: 12,
                    textAlign: "center",
                  }}
                >
                  {service.icon}
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: colors.textPrimary,
                    fontFamily: "Inter, system-ui, sans-serif",
                    textAlign: "center",
                    marginBottom: 8,
                  }}
                >
                  {service.title}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: colors.textSecondary,
                    fontFamily: "Inter, system-ui, sans-serif",
                    textAlign: "center",
                    lineHeight: 1.4,
                  }}
                >
                  {service.description}
                </div>
              </CyberCard>
            )
          );
        })}
      </div>

      {/* Bottom accent line */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: "50%",
          transform: "translateX(-50%)",
          width: interpolate(frame, [0, 60], [0, 600], {
            extrapolateRight: "clamp",
          }),
          height: 2,
          background: gradients.full,
          boxShadow: `0 0 20px ${colors.purple}`,
        }}
      />
    </div>
  );
};
