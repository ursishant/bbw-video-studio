import React from 'react';
import { interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { BBW_THEME } from '../../theme';

interface OutroCTAProps {
  headline?: string;
  tagline?: string;
  subtext?: string;
}

export const OutroCTA: React.FC<OutroCTAProps> = ({
  tagline = 'NEWS. FAST. FIRST.',
  subtext = 'Like • Share • Subscribe',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const scale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Cursor animation: glides in from bottom-right (frame 15 to 38), clicks at frame 38
  const cursorX = interpolate(frame, [15, 38], [750, 540], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const cursorY = interpolate(frame, [15, 38], [1400, 1170], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const isClicked = frame >= 38;

  // Button click scale pulse
  const clickScale = isClicked
    ? interpolate(frame, [38, 42, 48], [1, 0.92, 1], { extrapolateRight: 'clamp' })
    : 1;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        opacity,
        position: 'relative',
        boxSizing: 'border-box',
        padding: '40px',
      }}
    >
      {/* Main Branding Card */}
      <div
        style={{
          width: '940px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          transform: `scale(${scale})`,
          gap: '34px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        {/* Official BigBreakingWire Logo in Outro */}
        <div
          style={{
            backgroundColor: BBW_THEME.white,
            padding: '28px 60px',
            borderRadius: '32px',
            boxShadow: '0 24px 60px rgba(2, 34, 94, 0.16)',
            border: '2px solid rgba(2, 34, 94, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={staticFile('assets/bbw_logo.png')}
            alt="BigBreakingWire"
            style={{
              height: '110px',
              width: 'auto',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '26px',
            fontWeight: 800,
            letterSpacing: '8px',
            color: BBW_THEME.mutedGray,
            textTransform: 'uppercase',
          }}
        >
          {tagline}
        </div>

        {/* Like • Share • Subscribe Banner */}
        <div
          style={{
            fontSize: '48px',
            fontWeight: 900,
            color: BBW_THEME.primaryNavy,
            letterSpacing: '-0.5px',
            marginTop: '10px',
          }}
        >
          {subtext}
        </div>

        {/* Animated Subscribe Button */}
        <div
          style={{
            marginTop: '16px',
            transform: `scale(${clickScale})`,
            transition: 'transform 0.1s ease',
          }}
        >
          <div
            style={{
              backgroundColor: isClicked ? BBW_THEME.primaryNavy : BBW_THEME.breakingRed,
              color: BBW_THEME.white,
              padding: '22px 64px',
              borderRadius: '50px',
              fontSize: '34px',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
              boxShadow: isClicked
                ? '0 8px 24px rgba(2, 34, 94, 0.3)'
                : '0 16px 36px rgba(220, 6, 24, 0.4)',
              transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
              letterSpacing: '0.5px',
            }}
          >
            {isClicked ? (
              <svg width="38" height="38" viewBox="0 0 24 24" fill="#FFFFFF">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
              </svg>
            ) : (
              <svg width="38" height="38" viewBox="0 0 24 24" fill="#FFFFFF">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
            <span>{isClicked ? 'SUBSCRIBED' : 'SUBSCRIBE'}</span>
          </div>
        </div>
      </div>

      {/* Animated Mouse Cursor */}
      <div
        style={{
          position: 'absolute',
          left: cursorX,
          top: cursorY,
          zIndex: 80,
          pointerEvents: 'none',
          filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.35))',
        }}
      >
        <svg width="48" height="48" viewBox="0 0 24 24" fill="#0F172A">
          <path d="M3 3l7 18 3-7 7-3L3 3z" stroke="#FFFFFF" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
};
