import React from 'react';
import { interpolate, staticFile, useCurrentFrame } from 'remotion';

export const HeaderLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        position: 'absolute',
        top: 36,
        right: 36,
        zIndex: 50,
        opacity,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(10px)',
        padding: '8px 16px',
        borderRadius: '20px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(0, 0, 0, 0.08)',
      }}
    >
      <img
        src={staticFile('assets/bbw_logo.png')}
        alt="BigBreakingWire Logo"
        style={{
          height: '28px',
          width: 'auto',
          display: 'block',
          objectFit: 'contain',
        }}
      />
    </div>
  );
};
