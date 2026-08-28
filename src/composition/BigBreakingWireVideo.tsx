import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { HeaderLogo } from './components/HeaderLogo';
import { TwitterCard } from './components/TwitterCard';
import { ArticleView } from './components/ArticleView';
import { AnimatedChartScene } from './components/AnimatedChartScene';
import { DynamicSubtitles } from './components/DynamicSubtitles';
import { OutroCTA } from './components/OutroCTA';
import { VideoSchema } from '../types';
import { BBW_THEME } from '../theme';

export const BigBreakingWireVideo: React.FC<VideoSchema> = ({
  title,
  domain,
  imageUrl,
  category,
  twitterCard,
  articleSections = [],
  chartData,
  outro,
  audioUrl,
  bgMusicUrl,
  subtitleColor = BBW_THEME.breakingRed,
  words = [],
}) => {
  const { fps, durationInFrames } = useVideoConfig();

  // Duration calculations
  const outroDurationFrames = Math.round(3.2 * fps);
  const contentFrames = Math.max(1, durationInFrames - outroDurationFrames);

  const hasChart = chartData && chartData.enabled !== false && chartData.title;

  // Scene timing split
  let twitterDuration: number;
  let chartDuration: number = 0;
  let articleDuration: number;

  if (hasChart) {
    twitterDuration = Math.round(contentFrames * 0.28);
    chartDuration = Math.round(contentFrames * 0.32);
    articleDuration = contentFrames - twitterDuration - chartDuration;
  } else {
    twitterDuration = Math.round(contentFrames * 0.38);
    articleDuration = contentFrames - twitterDuration;
  }

  const numSections = Math.max(1, articleSections.length);
  const sectionDuration = Math.round(articleDuration / numSections);

  // Helper to normalize audio path for Remotion staticFile
  const resolveAudioSrc = (src?: string) => {
    if (!src) return '';
    if (src.startsWith('http://') || src.startsWith('https://')) return src;
    return staticFile(src.replace(/^\/+/, ''));
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BBW_THEME.lightGray,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Immersive Ambient Background Layer with Subtle Vignette */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 18% 18%, rgba(2, 34, 94, 0.08), transparent 45%),
            radial-gradient(circle at 82% 82%, rgba(220, 6, 24, 0.06), transparent 50%),
            ${BBW_THEME.lightGray}
          `,
          zIndex: 0,
        }}
      />

      {/* Voiceover Speech Audio */}
      {audioUrl && (
        <Audio
          src={resolveAudioSrc(audioUrl)}
          volume={1.0}
        />
      )}

      {/* Background Music Track */}
      {bgMusicUrl !== 'none' && (
        <Audio
          src={bgMusicUrl ? resolveAudioSrc(bgMusicUrl) : staticFile('assets/news_beat.wav')}
          volume={0.11}
          loop
        />
      )}

      {/* Top Persistent Official Logo */}
      <Sequence from={0} durationInFrames={contentFrames}>
        <HeaderLogo />
      </Sequence>

      {/* SCENE 1: Twitter / X UI Card with 3D Motion */}
      <Sequence from={0} durationInFrames={twitterDuration}>
        <TwitterCard
          data={twitterCard}
          imageUrl={imageUrl}
          domain={domain}
        />
        {/* SFX: Marker highlight swipe */}
        <Sequence from={18} durationInFrames={20}>
          <Audio src={staticFile('assets/marker_sfx.wav')} volume={0.32} />
        </Sequence>
      </Sequence>

      {/* OPTIONAL SCENE 2: 3D Adaptive Financial Chart */}
      {hasChart && (
        <Sequence from={twitterDuration} durationInFrames={chartDuration}>
          <Audio src={staticFile('assets/whoosh.wav')} volume={0.3} />
          <AnimatedChartScene
            data={chartData}
            category={category}
            domain={domain}
          />
        </Sequence>
      )}

      {/* SCENE 3+: Article Sections with 3D Motion & Supportive Scrolling */}
      {articleSections.map((sec, idx) => {
        const baseOffset = twitterDuration + chartDuration;
        const startFrame = baseOffset + idx * sectionDuration;
        const duration =
          idx === numSections - 1
            ? contentFrames - startFrame
            : sectionDuration;

        return (
          <Sequence key={idx} from={startFrame} durationInFrames={duration}>
            <Audio src={staticFile('assets/whoosh.wav')} volume={0.28} />
            <ArticleView
              title={title}
              sections={articleSections}
              domain={domain}
              category={category}
              activeSectionIndex={idx}
            />
            <Sequence from={16} durationInFrames={20}>
              <Audio src={staticFile('assets/marker_sfx.wav')} volume={0.28} />
            </Sequence>
          </Sequence>
        );
      })}

      {/* SCENE 4: Outro CTA with Clean Brand Chime */}
      <Sequence from={contentFrames} durationInFrames={outroDurationFrames}>
        <OutroCTA
          headline={outro?.headline}
          tagline={outro?.tagline}
          subtext={outro?.subtext}
        />
        <Audio src={staticFile('assets/outro_sfx.wav')} volume={0.65} />
        <Sequence from={38} durationInFrames={15}>
          <Audio src={staticFile('assets/click.wav')} volume={0.55} />
        </Sequence>
      </Sequence>

      {/* Dynamic Word-by-Word Subtitles Overlay */}
      <Sequence from={0} durationInFrames={contentFrames}>
        <DynamicSubtitles words={words} highlightColor={subtitleColor} />
      </Sequence>
    </AbsoluteFill>
  );
};
