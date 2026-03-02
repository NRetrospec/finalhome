import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, random } from "remotion";
import { colors } from "../lib/colors";

interface CodeRainProps {
  columnCount?: number;
  speed?: number;
  opacity?: number;
}

const CODE_CHARS = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

export const CodeRain: React.FC<CodeRainProps> = ({
  columnCount = 30,
  speed = 1,
  opacity = 0.3,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Generate stable columns
  const columns = useMemo(() => {
    return Array.from({ length: columnCount }, (_, i) => ({
      x: (width / columnCount) * i + random(`col-x-${i}`) * 20,
      speed: 0.5 + random(`col-speed-${i}`) * 1.5,
      chars: Array.from(
        { length: 30 },
        (_, j) => CODE_CHARS[Math.floor(random(`char-${i}-${j}`) * CODE_CHARS.length)]
      ),
      offset: random(`col-offset-${i}`) * height,
      color: random(`col-color-${i}`) > 0.7 ? colors.purple : colors.cyan,
    }));
  }, [columnCount, width, height]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        opacity,
      }}
    >
      {columns.map((col, colIndex) => {
        // Calculate vertical position
        const yOffset = ((frame * col.speed * speed * 3) + col.offset) % (height + 500);

        return (
          <div
            key={colIndex}
            style={{
              position: "absolute",
              left: col.x,
              top: yOffset - 500,
              display: "flex",
              flexDirection: "column",
              fontFamily: "monospace",
              fontSize: 16,
              lineHeight: 1.2,
            }}
          >
            {col.chars.map((char, charIndex) => {
              // First character is brightest
              const brightness = charIndex === 0 ? 1 : Math.max(0, 1 - charIndex * 0.08);
              const charColor =
                charIndex === 0
                  ? colors.textPrimary
                  : col.color;

              return (
                <span
                  key={charIndex}
                  style={{
                    color: charColor,
                    opacity: brightness,
                    textShadow:
                      charIndex === 0
                        ? `0 0 10px ${col.color}, 0 0 20px ${col.color}`
                        : "none",
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
