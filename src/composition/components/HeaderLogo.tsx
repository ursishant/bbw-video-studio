import React from 'react';
import { interpolate, staticFile, useCurrentFrame } from 'remotion';

export const HeaderLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        position: 'absolute',
        top: 48,
        right: 48,
        zIndex: 100,
        opacity,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(16px)',
        padding: '16px 32px',
        borderRadius: '30px',
        boxShadow: '0 12px 36px rgba(2, 34, 94, 0.16), 0 0 0 1.5px rgba(2, 34, 94, 0.08)',
        border: '1.5px solid rgba(255, 255, 255, 0.9)',
      }}
    >
      <img
        src={staticFile('assets/bbw_logo.png')}
        alt="BigBreakingWire Logo"
        style={{
          height: '68px',
          width: 'auto',
          display: 'block',
          objectFit: 'contain',
        }}
      />
    </div>
  );
};
