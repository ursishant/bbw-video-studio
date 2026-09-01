import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ArticleSection } from '../../types';
import { BBW_THEME } from '../../theme';

interface ArticleViewProps {
  title: string;
  sections: ArticleSection[];
  domain: string;
  category?: string;
  activeSectionIndex?: number;
}

export const ArticleView: React.FC<ArticleViewProps> = ({
  title,
  sections,
  domain,
  category = 'Economy',
  activeSectionIndex = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Entrance spring
  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  // Smooth 3D Perspective transition
  const rotateX = interpolate(frame, [10, 50], [0, 9], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const rotateY = interpolate(frame, [10, 50], [0, 6], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const rotateZ = interpolate(frame, [10, 50], [0, -1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Subtle 3D camera float
  const floatY = Math.sin(frame * 0.04) * 2;
  const floatZ = interpolate(frame, [0, 150], [0, 30], { extrapolateRight: 'clamp' });

  // Glossy light beam reflection swipe
  const shineTranslate = interpolate(frame, [18, 55], [-1200, 1400], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Multi-line full highlighter progress
  const highlightProgress = interpolate(frame, [12, 42], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Continuous smooth vertical article scroll from start to end
  const scrollDistance = Math.min(180, (sections.length - 1) * 90);
  const scrollY = interpolate(frame, [0, durationInFrames], [0, -scrollDistance], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const sectionDuration = Math.max(1, durationInFrames / Math.max(1, sections.length));
  const dynamicActiveIndex = Math.min(
    sections.length - 1,
    Math.floor(frame / sectionDuration)
  );
  const effectiveActiveIndex = activeSectionIndex !== undefined && activeSectionIndex > 0
    ? activeSectionIndex
    : dynamicActiveIndex;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1400px',
        boxSizing: 'border-box',
        padding: '32px',
      }}
    >
      <div
        style={{
          width: '980px',
          backgroundColor: BBW_THEME.white,
          borderRadius: '36px',
          padding: '44px 40px',
          boxShadow: '0 35px 90px -15px rgba(2, 34, 94, 0.18), 0 0 0 1px rgba(2, 34, 94, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          boxSizing: 'border-box',
          position: 'relative',
          overflow: 'hidden',
          transformStyle: 'preserve-3d',
          transform: `scale(${entrance}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) translateY(${floatY}px) translateZ(${floatZ}px)`,
        }}
      >
        {/* Glossy Reflection Beam */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '350px',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.45), transparent)',
            transform: `translateX(${shineTranslate}px) skewX(-25deg)`,
            pointerEvents: 'none',
            zIndex: 30,
          }}
        />

        {/* Top Header Badge Bar: Category & Domain */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `2px solid ${BBW_THEME.lightGray}`,
            paddingBottom: '14px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            transform: 'translateZ(15px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                backgroundColor: BBW_THEME.breakingRed,
                color: BBW_THEME.white,
                fontSize: '15px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                padding: '4px 14px',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(220, 6, 24, 0.3)',
              }}
            >
              <span style={{ fontSize: '9px' }}>●</span>
              <span>{category.toUpperCase()}</span>
            </span>
            <span style={{ color: BBW_THEME.mutedGray }}>•</span>
            <span style={{ fontSize: '18px', color: BBW_THEME.primaryNavy, fontWeight: 700 }}>
              {domain || 'bigbreakingwire.in'}
            </span>
          </div>
          <span style={{ fontSize: '16px', color: BBW_THEME.mutedGray, fontWeight: 600 }}>
            Published Today
          </span>
        </div>

        {/* Fixed Article Title */}
        <h1
          style={{
            fontSize: '38px',
            fontWeight: 900,
            lineHeight: '1.24',
            color: BBW_THEME.black,
            margin: '2px 0 0 0',
            fontFamily: '"Times New Roman", Times, Georgia, serif',
            letterSpacing: '-0.03em',
            transform: 'translateZ(20px)',
          }}
        >
          {title}
        </h1>

        {/* Scrollable Supportive Article Content Area with Smooth translateY */}
        <div
          style={{
            height: '460px',
            overflow: 'hidden',
            position: 'relative',
            transform: 'translateZ(25px)',
            maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              transform: `translateY(${scrollY}px)`,
              transition: 'transform 0.05s linear',
            }}
          >
            {sections.map((sec, idx) => {
              const isCurrentlyActive = idx === effectiveActiveIndex;
              const sectionStartFrame = idx * sectionDuration;
              const sectionHighlightProgress = interpolate(
                frame,
                [sectionStartFrame + 6, sectionStartFrame + 30],
                [0, 100],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
              );

              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: isCurrentlyActive ? '#FFFFFF' : BBW_THEME.lightGray,
                    border: isCurrentlyActive ? `2px solid ${BBW_THEME.navyLight}` : '1px solid #E2E8F0',
                    borderRadius: '22px',
                    padding: '22px 26px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    boxShadow: isCurrentlyActive ? '0 12px 30px rgba(2, 34, 94, 0.12)' : 'none',
                    opacity: isCurrentlyActive ? 1 : 0.82,
                    transform: isCurrentlyActive ? 'scale(1.01)' : 'scale(1)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {sec.heading && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h2
                        style={{
                          fontSize: '23px',
                          fontWeight: 800,
                          color: BBW_THEME.primaryNavy,
                          margin: 0,
                          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                          letterSpacing: '-0.5px',
                        }}
                      >
                        {sec.heading}
                      </h2>
                    </div>
                  )}

                  {/* Multi-line Full Highlighter covering entire text across all lines */}
                  <div
                    style={{
                      fontSize: '25px',
                      lineHeight: '1.55',
                      color: BBW_THEME.black,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline',
                        backgroundImage: isCurrentlyActive
                          ? `linear-gradient(to right, ${BBW_THEME.highlightYellow} 0%, ${BBW_THEME.highlightYellow} 100%)`
                          : 'none',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: isCurrentlyActive ? `${sectionHighlightProgress}% 100%` : '0% 100%',
                        padding: isCurrentlyActive ? '2px 6px' : '0',
                        borderRadius: '6px',
                        boxDecorationBreak: 'clone',
                        WebkitBoxDecorationBreak: 'clone',
                        fontWeight: isCurrentlyActive ? 700 : 500,
                        color: BBW_THEME.black,
                      }}
                    >
                      {sec.content}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
