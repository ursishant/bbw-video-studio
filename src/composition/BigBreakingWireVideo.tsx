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
  audioUrl = '',
  bgMusicUrl,
  subtitleColor = BBW_THEME.breakingRed,
  sceneOrder = 'hook-first',
  words = [],
}) => {
  const { fps, durationInFrames } = useVideoConfig();

  // Duration calculations
  const outroDurationFrames = Math.round(3.0 * fps);
  const contentFrames = Math.max(1, durationInFrames - outroDurationFrames);

  const hasChart = Boolean(chartData && chartData.enabled !== false && chartData.title);
  const numSections = Math.max(1, articleSections.length);

  // 🎯 Smart Sentence-Aware Scene Timing synced with VO Word Timestamps
  let twitterDuration: number;
  let chartDuration: number = 0;
  let articleDuration: number;

  if (words && words.length > 0) {
    // Find natural sentence endings in the speech
    const sentenceEndFrames = words
      .filter((w) => /[.!?:\u2014]$/.test(w.word.trim()))
      .map((w) => Math.round(w.end * fps));

    if (hasChart) {
      // Scene 1: Twitter Hook (ideal ~32% of speech)
      const idealTwitterEnd = Math.round(contentFrames * 0.32);
      const matchedTwitterEnd = sentenceEndFrames.find(
        (f) => f >= Math.round(fps * 2.5) && f <= Math.round(contentFrames * 0.45)
      ) || idealTwitterEnd;
      twitterDuration = Math.min(contentFrames - Math.round(fps * 5), Math.max(Math.round(fps * 3), matchedTwitterEnd));

      // Scene 2: Chart (ideal ~32% of speech)
      const remainingFrames = contentFrames - twitterDuration;
      const idealChartEnd = twitterDuration + Math.round(remainingFrames * 0.5);
      const matchedChartEnd = sentenceEndFrames.find(
        (f) => f > twitterDuration + Math.round(fps * 2.5) && f <= twitterDuration + Math.round(remainingFrames * 0.7)
      ) || idealChartEnd;
      chartDuration = Math.max(Math.round(fps * 3), matchedChartEnd - twitterDuration);

      // Scene 3: Article Takeaways
      articleDuration = Math.max(Math.round(fps * 2), contentFrames - twitterDuration - chartDuration);
    } else {
      // Scene 1: Twitter Hook (ideal ~42% of speech)
      const idealTwitterEnd = Math.round(contentFrames * 0.42);
      const matchedTwitterEnd = sentenceEndFrames.find(
        (f) => f >= Math.round(fps * 3) && f <= Math.round(contentFrames * 0.58)
      ) || idealTwitterEnd;
      twitterDuration = Math.min(contentFrames - Math.round(fps * 3), Math.max(Math.round(fps * 3), matchedTwitterEnd));

      // Scene 2: Article View Deep Dive
      articleDuration = contentFrames - twitterDuration;
    }
  } else {
    // Fallback if no words timestamps
    if (hasChart) {
      twitterDuration = Math.round(contentFrames * 0.32);
      chartDuration = Math.round(contentFrames * 0.32);
      articleDuration = contentFrames - twitterDuration - chartDuration;
    } else {
      twitterDuration = Math.round(contentFrames * 0.45);
      articleDuration = contentFrames - twitterDuration;
    }
  }

  // Dynamic Scene Start Offsets based on user-chosen flow direction
  let twitterStart = 0;
  let chartStart = 0;
  let articleStart = 0;

  if (sceneOrder === 'article-first') {
    articleStart = 0;
    if (hasChart) {
      chartStart = articleDuration;
      twitterStart = articleDuration + chartDuration;
    } else {
      twitterStart = articleDuration;
    }
  } else if (sceneOrder === 'chart-first' && hasChart) {
    chartStart = 0;
    twitterStart = chartDuration;
    articleStart = chartDuration + twitterDuration;
  } else {
    // Default 'hook-first': Twitter -> Chart -> Article
    twitterStart = 0;
    chartStart = twitterDuration;
    articleStart = twitterDuration + chartDuration;
  }

  // Helper to normalize audio path for Remotion staticFile
  const resolveAudioSrc = (src?: string) => {
    if (!src) return '';
    if (src.startsWith('https://') || (src.startsWith('http://') && !src.includes('localhost') && !src.includes('127.0.0.1'))) {
      return src;
    }
    let cleanPath = src;
    if (src.includes('audio/') || src.includes('assets/') || src.includes('broll/')) {
      const match = src.match(/(audio|assets|broll)\/[^?#]+/);
      if (match) {
        cleanPath = match[0];
      }
    }
    cleanPath = cleanPath.replace(/^\/+/, '').replace(/^public\//, '');
    return staticFile(cleanPath);
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

      {/* SCENE: Twitter / X UI Card with 3D Motion */}
      {twitterDuration > 0 && (
        <Sequence from={twitterStart} durationInFrames={twitterDuration}>
          {twitterStart > 0 && <Audio src={staticFile('assets/whoosh.wav')} volume={0.3} />}
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
      )}

      {/* OPTIONAL SCENE: 3D Adaptive Financial Chart */}
      {hasChart && chartDuration > 0 && (
        <Sequence from={chartStart} durationInFrames={chartDuration}>
          <Audio src={staticFile('assets/whoosh.wav')} volume={0.3} />
          <AnimatedChartScene
            data={chartData}
            category={category}
            domain={domain}
          />
        </Sequence>
      )}

      {/* SCENE: Article View with Unified 3D Depth & Timed Section Highlighting */}
      {articleDuration > 0 && (
        <Sequence
          from={articleStart}
          durationInFrames={articleDuration}
        >
          {articleStart > 0 && <Audio src={staticFile('assets/whoosh.wav')} volume={0.28} />}
          <ArticleView
            title={title}
            sections={articleSections}
            domain={domain}
            category={category}
            activeSectionIndex={0}
          />
          <Sequence from={16} durationInFrames={20}>
            <Audio src={staticFile('assets/marker_sfx.wav')} volume={0.28} />
          </Sequence>
        </Sequence>
      )}

      {/* SCENE 4: Outro CTA with Clean Brand Chime */}
      <Sequence from={contentFrames} durationInFrames={outroDurationFrames}>
        <OutroCTA
          headline={outro?.headline}
          tagline={outro?.tagline}
          subtext={outro?.subtext}
        />
        <Audio src={staticFile('assets/outro_sfx.wav')} volume={0.65} />
        <Sequence from={35} durationInFrames={15}>
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
