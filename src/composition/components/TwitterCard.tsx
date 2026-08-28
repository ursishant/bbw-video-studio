import React from 'react';
import { interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { TwitterCardData } from '../../types';
import { BBW_THEME } from '../../theme';

interface TwitterCardProps {
  data: TwitterCardData;
  imageUrl: string;
  domain: string;
}

export const TwitterCard: React.FC<TwitterCardProps> = ({ data, imageUrl, domain }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  // Smooth 3D Transition
  const rotateX = interpolate(frame, [15, 60], [0, 10], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const rotateY = interpolate(frame, [15, 60], [0, -7], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const rotateZ = interpolate(frame, [15, 60], [0, 1.2], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Subtle continuous 3D floating motion
  const floatX = Math.sin(frame * 0.04) * 1.5;
  const floatY = Math.cos(frame * 0.035) * 2;
  const floatZ = interpolate(frame, [0, 180], [0, 35], { extrapolateRight: 'clamp' });

  // Glossy light beam reflection swipe
  const shineTranslate = interpolate(frame, [25, 65], [-1200, 1400], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Multi-line full highlighter progress
  const markerProgress = interpolate(frame, [18, 48], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

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
          gap: '24px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          boxSizing: 'border-box',
          position: 'relative',
          overflow: 'hidden',
          transformStyle: 'preserve-3d',
          transform: `scale(${entrance}) rotateX(${rotateX + floatX}deg) rotateY(${rotateY + floatY}deg) rotateZ(${rotateZ}deg) translateZ(${floatZ}px)`,
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

        {/* Header: User Profile with BBW Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', transform: 'translateZ(15px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                backgroundColor: BBW_THEME.white,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(2, 34, 94, 0.12)',
                border: '2px solid #E2E8F0',
                padding: '6px',
                boxSizing: 'border-box',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <img
                src={staticFile('assets/bbw_logo.png')}
                alt="BBW"
                style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 800, fontSize: '32px', color: BBW_THEME.primaryNavy, letterSpacing: '-0.5px' }}>
                  {data.accountName || 'BigBreakingWire'}
                </span>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#1D9BF0">
                  <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.79-4-4-4-.495 0-.965.084-1.4.238C14.55 2.475 13.18 1.6 11.6 1.6c-1.58 0-2.95.875-3.6 2.148-.435-.154-.905-.238-1.4-.238-2.21 0-4 1.79-4 4 0 .495.084.965.238 1.4C1.575 9.55.7 10.92.7 12.5c0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.79 4 4 4 .495 0 .965-.084 1.4-.238.65 1.273 2.02 2.148 3.6 2.148 1.58 0 2.95-.875 3.6-2.148.435.154.905.238 1.4.238 2.21 0 4-1.79 4-4 0-.495-.084-.965-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6zm-12.87 4.16l-4.24-4.24 1.41-1.41 2.83 2.83 6.36-6.36 1.41 1.41-7.77 7.77z"/>
                </svg>
              </div>
              <span style={{ fontSize: '24px', color: BBW_THEME.mutedGray, fontWeight: 500 }}>
                {data.handle || '@BigBreakingWire'}
              </span>
            </div>
          </div>

          <svg width="32" height="32" viewBox="0 0 24 24" fill={BBW_THEME.primaryNavy}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </div>

        {/* Text Content with Multi-Line Highlight */}
        <div
          style={{
            position: 'relative',
            fontSize: '34px',
            lineHeight: '1.45',
            color: BBW_THEME.black,
            fontWeight: 600,
            transform: 'translateZ(20px)',
          }}
        >
          {data.bulletPoints && data.bulletPoints.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {data.bulletPoints.slice(0, 2).map((point, idx) => {
                const isHighlightTarget = idx === 0;
                return (
                  <div key={idx} style={{ position: 'relative' }}>
                    <span
                      style={{
                        display: 'inline',
                        backgroundImage: isHighlightTarget
                          ? `linear-gradient(to right, ${BBW_THEME.highlightYellow} 0%, ${BBW_THEME.highlightYellow} 100%)`
                          : 'none',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: isHighlightTarget ? `${markerProgress}% 100%` : '0% 100%',
                        padding: isHighlightTarget ? '2px 8px' : '0',
                        borderRadius: '6px',
                        boxDecorationBreak: 'clone',
                        WebkitBoxDecorationBreak: 'clone',
                        color: BBW_THEME.black,
                      }}
                    >
                      {point}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div>
              <span
                style={{
                  display: 'inline',
                  backgroundImage: `linear-gradient(to right, ${BBW_THEME.highlightYellow} 0%, ${BBW_THEME.highlightYellow} 100%)`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: `${markerProgress}% 100%`,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  boxDecorationBreak: 'clone',
                  WebkitBoxDecorationBreak: 'clone',
                  color: BBW_THEME.black,
                }}
              >
                {data.text}
              </span>
            </div>
          )}
        </div>

        {/* Hero Image Card */}
        {imageUrl && (
          <div
            style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              border: '1px solid #E2E8F0',
              backgroundColor: BBW_THEME.lightGray,
              maxHeight: '440px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 30px rgba(2, 34, 94, 0.08)',
              transform: 'translateZ(25px)',
            }}
          >
            <img
              src={imageUrl}
              alt="News Hero"
              style={{
                width: '100%',
                height: '400px',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                backgroundColor: 'rgba(1, 22, 56, 0.9)',
                backdropFilter: 'blur(8px)',
                color: BBW_THEME.white,
                padding: '8px 18px',
                borderRadius: '16px',
                fontSize: '20px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}
            >
              <span>🔗</span>
              <span>{domain || 'bigbreakingwire.in'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
