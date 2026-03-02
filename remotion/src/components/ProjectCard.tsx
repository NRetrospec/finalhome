import React from "react";
import { useCurrentFrame, useVideoConfig, spring, Img, staticFile } from "remotion";
import { colors } from "../lib/colors";
import { TechBadge } from "./TechBadge";
import type { Project } from "../lib/projectData";

interface ProjectCardProps {
  project: Project;
  startFrame?: number;
  isActive?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  startFrame = 0,
  isActive = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entry animation
  const entryProgress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 100, stiffness: 150, mass: 0.8 },
  });

  // Scale animation when active
  const scale = isActive ? 1 : 0.9;
  const opacity = isActive ? 1 : 0.5;

  // Glow effect
  const glowIntensity = 0.5 + Math.sin((frame / fps) * Math.PI * 2) * 0.3;

  return (
    <div
      style={{
        width: 500,
        background: colors.cardBg,
        borderRadius: 16,
        overflow: "hidden",
        border: `2px solid ${project.color}`,
        boxShadow: `0 0 ${30 * glowIntensity}px ${project.color}60`,
        transform: `scale(${entryProgress * scale})`,
        opacity: entryProgress * opacity,
      }}
    >
      {/* Project Image */}
      <div
        style={{
          width: "100%",
          height: 280,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Img
          src={staticFile(project.image)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 100,
            background: `linear-gradient(transparent, ${colors.background})`,
          }}
        />
        {/* Industry badge */}
        <div
          style={{
            position: "absolute",
            top: 16,
            right: 16,
          }}
        >
          <TechBadge text={project.industry} variant="industry" startFrame={startFrame + 10} />
        </div>
      </div>

      {/* Project Info */}
      <div style={{ padding: 24 }}>
        <h3
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: colors.textPrimary,
            marginBottom: 8,
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          {project.title}
        </h3>
        <p
          style={{
            fontSize: 16,
            color: colors.textSecondary,
            marginBottom: 16,
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          {project.description}
        </p>
        {/* Tech stack */}
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {project.tech.map((tech, index) => (
            <TechBadge
              key={tech}
              text={tech}
              startFrame={startFrame + 15 + index * 3}
              variant="tech"
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
