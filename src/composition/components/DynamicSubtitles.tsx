import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { SubtitleWord } from '../../types';
import { BBW_THEME } from '../../theme';

interface DynamicSubtitlesProps {
  words: SubtitleWord[];
  highlightColor?: string;
}

export const DynamicSubtitles: React.FC<DynamicSubtitlesProps> = ({ words, highlightColor = BBW_THEME.breakingRed }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  if (!words || words.length === 0) return null;

  // Find active word
  const activeWordIndex = words.findIndex(
    (w) => currentTime >= w.start && currentTime <= w.end + 0.15
  );

  const currentOrLastIndex =
    activeWordIndex !== -1
      ? activeWordIndex
      : words.findLastIndex((w) => currentTime >= w.end && currentTime <= w.end + 0.45);

  if (currentOrLastIndex === -1) return null;

  // Show a window of 4 words around active word
  const windowSize = 4;
  const startIndex = Math.max(0, Math.floor(currentOrLastIndex / windowSize) * windowSize);
  const visibleWords = words.slice(startIndex, startIndex + windowSize);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '120px',
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
        pointerEvents: 'none',
      }}
    >
      {/* Subtitle Pill using Official Midnight Navy & Breaking Red brand palette */}
      <div
        style={{
          backgroundColor: BBW_THEME.navyDark, // #011638
          border: `2px solid ${BBW_THEME.navyLight}`, // #174A91
          backdropFilter: 'blur(16px)',
          padding: '14px 32px',
          borderRadius: '26px',
          boxShadow: '0 16px 40px rgba(1, 22, 56, 0.45)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          maxWidth: '900px',
        }}
      >
        {visibleWords.map((item, idx) => {
          const globalIdx = startIndex + idx;
          const isActive = globalIdx === currentOrLastIndex;

          return (
            <span
              key={idx}
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "Montserrat", "Outfit", sans-serif',
                fontSize: isActive ? '44px' : '40px',
                fontWeight: 900,
                letterSpacing: '-0.5px',
                color: BBW_THEME.white,
                backgroundColor: isActive ? highlightColor : 'transparent',
                padding: isActive ? '4px 16px' : '4px 2px',
                borderRadius: '12px',
                transform: isActive ? 'scale(1.08)' : 'scale(1)',
                transition: 'all 0.08s ease-out',
                display: 'inline-block',
                boxShadow: isActive ? `0 4px 18px ${highlightColor}80` : 'none',
                textShadow: isActive ? 'none' : '0 2px 6px rgba(0,0,0,0.6)',
              }}
            >
              {item.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
