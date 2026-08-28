import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ChartData } from '../../types';
import { BBW_THEME } from '../../theme';

interface DataPoint {
  label: string;
  value: number;
  formatted?: string;
  isPeak?: boolean;
  color?: string;
}

interface AnimatedChartSceneProps {
  data?: ChartData;
  category?: string;
  domain?: string;
}

export const AnimatedChartScene: React.FC<AnimatedChartSceneProps> = ({
  data,
  category = 'Markets',
  domain = 'bigbreakingwire.in',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!data) return null;

  const chartType = data.type || 'combo-trend';

  // Default points dataset
  const points: DataPoint[] = data.datapoints && data.datapoints.length > 0
    ? data.datapoints
    : [
        { label: 'Q1 FY26', value: 26.0, formatted: '$26.0B' },
        { label: 'Q2 FY26', value: 46.7, formatted: '$46.7B' },
        { label: 'Q3 FY26', value: 35.1, formatted: '$35.1B' },
        { label: 'Q4 FY26', value: 60.9, formatted: '$60.9B' },
        { label: 'Q1 FY27', value: 72.5, formatted: '$72.5B' },
        { label: 'Q2 FY27', value: 96.2, formatted: '$96.2B', isPeak: true },
      ];

  // If user provided prevValue & currValue, adapt points
  if (!data.datapoints && data.prevValue && data.currValue) {
    const pVal = data.prevValue;
    const cVal = data.currValue;
    points[1] = { label: data.prevLabel || 'Previous', value: pVal, formatted: data.prevFormatted || `${pVal}` };
    points[5] = { label: data.currLabel || 'Current', value: cVal, formatted: data.currFormatted || `${cVal}`, isPeak: true };
    points[0] = { label: 'Start', value: Math.round(pVal * 0.65), formatted: `$${Math.round(pVal * 0.65)}B` };
    points[2] = { label: 'Mid-1', value: Math.round(pVal * 0.85), formatted: `$${Math.round(pVal * 0.85)}B` };
    points[3] = { label: 'Mid-2', value: Math.round(pVal * 1.25), formatted: `$${Math.round(pVal * 1.25)}B` };
    points[4] = { label: 'Mid-3', value: Math.round(cVal * 0.78), formatted: `$${Math.round(cVal * 0.78)}B` };
  }

  // Entrance spring
  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  // 3D Perspective tilt
  const rotateX = interpolate(frame, [10, 50], [0, 8], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const rotateY = interpolate(frame, [10, 50], [0, -5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const floatY = Math.sin(frame * 0.04) * 2;
  const floatZ = interpolate(frame, [0, 150], [0, 25], { extrapolateRight: 'clamp' });

  // Light beam swipe
  const shineTranslate = interpolate(frame, [18, 55], [-1200, 1400], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Badge pop spring
  const badgeSpring = spring({
    frame: Math.max(0, frame - 38),
    fps,
    config: { damping: 12, stiffness: 140 },
  });

  // Dimensions
  const chartWidth = 840;
  const chartHeight = 320;
  const paddingX = 40;
  const paddingBottom = 40;
  const paddingTop = 30;

  const maxVal = Math.max(...points.map((p) => p.value)) * 1.18 || 100;
  const numPoints = points.length;
  const stepX = (chartWidth - paddingX * 2) / Math.max(1, numPoints - 1);

  const coords = points.map((p, i) => {
    const x = paddingX + i * stepX;
    const rawY = chartHeight - paddingBottom - (p.value / maxVal) * (chartHeight - paddingBottom - paddingTop);
    return { x, y: rawY, ...p };
  });

  const lineProgress = interpolate(frame, [10, 48], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const totalLength = 1200;

  const pathD = coords.reduce((acc, curr, i) => {
    return i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${pathD} L ${coords[coords.length - 1].x} ${chartHeight - paddingBottom} L ${coords[0].x} ${chartHeight - paddingBottom} Z`;

  // Donut slices dataset if pie/donut mode is active
  const donutSlices = [
    { label: 'Data Center AI', value: 89.0, percent: '88%', color: '#02225E' },
    { label: 'Gaming GPUs', value: 3.8, percent: '7%', color: '#3B82F6' },
    { label: 'Professional Auto', value: 3.4, percent: '5%', color: '#DC0618' },
  ];

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
          padding: '40px 38px',
          boxShadow: '0 35px 90px -15px rgba(2, 34, 94, 0.18), 0 0 0 1px rgba(2, 34, 94, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          boxSizing: 'border-box',
          position: 'relative',
          overflow: 'hidden',
          transformStyle: 'preserve-3d',
          transform: `scale(${entrance}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${floatY}px) translateZ(${floatZ}px)`,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Outfit", "Inter", sans-serif',
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

        {/* Top Header Badge Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `2px solid ${BBW_THEME.lightGray}`,
            paddingBottom: '14px',
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
            Market Intelligence
          </span>
        </div>

        {/* Headline & Floating Surge Delta */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', transform: 'translateZ(20px)' }}>
          <div>
            <h1
              style={{
                fontSize: '36px',
                fontWeight: 900,
                lineHeight: '1.2',
                color: BBW_THEME.black,
                margin: 0,
                letterSpacing: '-0.5px',
              }}
            >
              {data.title || 'Growth Trajectory & Performance'}
            </h1>
            {data.subtitle && (
              <p style={{ margin: '4px 0 0 0', fontSize: '19px', color: BBW_THEME.mutedGray, fontWeight: 600 }}>
                {data.subtitle}
              </p>
            )}
          </div>

          {/* Floating Surge Badge */}
          {data.changeBadge && (
            <div
              style={{
                transform: `scale(${badgeSpring})`,
                backgroundColor: 'rgba(220, 6, 24, 0.1)',
                border: `2px solid ${BBW_THEME.breakingRed}`,
                color: BBW_THEME.breakingRed,
                padding: '8px 18px',
                borderRadius: '20px',
                fontSize: '22px',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 8px 24px rgba(220, 6, 24, 0.18)',
                whiteSpace: 'nowrap',
              }}
            >
              <span>▲</span>
              <span>{data.changeBadge}</span>
            </div>
          )}
        </div>

        {/* World-Class Dynamic Chart Canvas Container */}
        <div
          style={{
            height: '420px',
            backgroundColor: BBW_THEME.lightGray,
            borderRadius: '24px',
            border: '1.5px solid #E2E8F0',
            padding: '24px 20px 16px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            boxSizing: 'border-box',
            transform: 'translateZ(25px)',
          }}
        >
          {/* TYPE A & B: COMBO TREND / AREA SPLINE */}
          {chartType !== 'donut-breakdown' && (
            <div style={{ position: 'relative', width: '100%', height: `${chartHeight}px` }}>
              {/* Horizontal Gridlines */}
              <div style={{ position: 'absolute', top: `${paddingTop}px`, left: '30px', right: '30px', bottom: `${paddingBottom}px`, pointerEvents: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1.5px dashed #CBD5E1', width: '100%' }} />
                <div style={{ borderBottom: '1.5px dashed #CBD5E1', width: '100%' }} />
                <div style={{ borderBottom: '1.5px dashed #CBD5E1', width: '100%' }} />
              </div>

              {/* Column Bars Layer (for combo-trend) */}
              {chartType === 'combo-trend' && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: `${paddingBottom}px`, display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', padding: `0 ${paddingX - 20}px` }}>
                  {points.map((p, idx) => {
                    const barSpring = spring({
                      frame: Math.max(0, frame - 4 - idx * 4),
                      fps,
                      config: { damping: 14, stiffness: 90 },
                    });
                    const heightPercent = (p.value / maxVal) * 100 * barSpring;
                    const isFinalPeak = p.isPeak || idx === points.length - 1;

                    return (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '8px',
                          width: '80px',
                          height: '100%',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <div
                          style={{
                            fontSize: isFinalPeak ? '22px' : '17px',
                            fontWeight: 900,
                            color: isFinalPeak ? BBW_THEME.breakingRed : BBW_THEME.primaryNavy,
                            fontFamily: '"Montserrat", "Outfit", sans-serif',
                            opacity: barSpring,
                            transform: `translateY(${(1 - barSpring) * 10}px)`,
                          }}
                        >
                          {p.formatted || p.value}
                        </div>

                        <div
                          style={{
                            width: isFinalPeak ? '54px' : '46px',
                            height: `${Math.max(8, heightPercent)}%`,
                            background: isFinalPeak
                              ? `linear-gradient(180deg, ${BBW_THEME.primaryNavy} 0%, #0F172A 100%)`
                              : 'linear-gradient(180deg, #3B82F6 0%, #1D4ED8 100%)',
                            borderRadius: '14px 14px 6px 6px',
                            boxShadow: isFinalPeak
                              ? '0 12px 28px rgba(2, 34, 94, 0.35)'
                              : '0 8px 18px rgba(37, 99, 235, 0.25)',
                            position: 'relative',
                          }}
                        >
                          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '5px', backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: '14px 14px 0 0' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* SVG Trend Spline Overlay */}
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                  overflow: 'visible',
                }}
              >
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#DC0618" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#DC0618" stopOpacity="0.0" />
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#DC0618" floodOpacity="0.5" />
                  </filter>
                </defs>

                <path
                  d={areaD}
                  fill="url(#areaGradient)"
                  opacity={lineProgress}
                />

                <path
                  d={pathD}
                  fill="none"
                  stroke={BBW_THEME.breakingRed}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glow)"
                  strokeDasharray={totalLength}
                  strokeDashoffset={(1 - lineProgress) * totalLength}
                />

                {coords.map((pt, idx) => {
                  const pointEntrance = spring({
                    frame: Math.max(0, frame - 12 - idx * 5),
                    fps,
                    config: { damping: 10, stiffness: 120 },
                  });

                  return (
                    <g key={idx} transform={`translate(${pt.x}, ${pt.y}) scale(${pointEntrance})`}>
                      <circle r="9" fill={BBW_THEME.white} stroke={BBW_THEME.breakingRed} strokeWidth="4" />
                      <circle r="4" fill={BBW_THEME.breakingRed} />
                    </g>
                  );
                })}
              </svg>

              {/* X-Axis Timeline Labels */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '4px',
                  left: 0,
                  right: 0,
                  display: 'flex',
                  justifyContent: 'space-around',
                  padding: `0 ${paddingX - 20}px`,
                }}
              >
                {points.map((p, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: '80px',
                      textAlign: 'center',
                      fontSize: '18px',
                      fontWeight: 800,
                      color: p.isPeak ? BBW_THEME.primaryNavy : BBW_THEME.mutedGray,
                    }}
                  >
                    {p.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TYPE C: DONUT / PIE BREAKDOWN */}
          {chartType === 'donut-breakdown' && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: '100%', padding: '0 20px' }}>
              <div style={{ position: 'relative', width: '220px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="220" height="220" viewBox="0 0 220 220">
                  <circle cx="110" cy="110" r="85" fill="none" stroke="#E2E8F0" strokeWidth="34" />
                  <circle
                    cx="110"
                    cy="110"
                    r="85"
                    fill="none"
                    stroke={BBW_THEME.primaryNavy}
                    strokeWidth="34"
                    strokeDasharray="534"
                    strokeDashoffset={534 * (1 - lineProgress * 0.88)}
                    strokeLinecap="round"
                    transform="rotate(-90 110 110)"
                  />
                  <circle
                    cx="110"
                    cy="110"
                    r="85"
                    fill="none"
                    stroke={BBW_THEME.breakingRed}
                    strokeWidth="34"
                    strokeDasharray="534"
                    strokeDashoffset={534 * (1 - lineProgress * 0.07)}
                    strokeLinecap="round"
                    transform="rotate(226 110 110)"
                  />
                </svg>
                <div style={{ position: 'absolute', textAlign: 'center' }}>
                  <div style={{ fontSize: '38px', fontWeight: 900, color: BBW_THEME.primaryNavy }}>88%</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: BBW_THEME.mutedGray }}>DOMINANCE</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '380px' }}>
                {donutSlices.map((slice, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', padding: '12px 20px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '16px', height: '16px', backgroundColor: slice.color, borderRadius: '4px' }} />
                      <span style={{ fontSize: '19px', fontWeight: 800, color: BBW_THEME.black }}>{slice.label}</span>
                    </div>
                    <span style={{ fontSize: '20px', fontWeight: 900, color: slice.color }}>{slice.percent}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chart Legend */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '28px',
              borderTop: '1px solid #E2E8F0',
              paddingTop: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: 700, color: BBW_THEME.primaryNavy }}>
              <div style={{ width: '18px', height: '18px', backgroundColor: '#3B82F6', borderRadius: '4px' }} />
              <span>Reported Metric (Quarterly)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: 700, color: BBW_THEME.breakingRed }}>
              <div style={{ width: '24px', height: '4px', backgroundColor: BBW_THEME.breakingRed, borderRadius: '2px' }} />
              <span>Growth Trendline</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
