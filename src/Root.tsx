import React from 'react';
import { Composition } from 'remotion';
import { BigBreakingWireVideo } from './composition/BigBreakingWireVideo';
import { VideoSchema } from './types';

export const defaultShortVideoProps: VideoSchema = {
  title: "NVIDIA Q2 FY2027: Revenue Surges 106% to $96.2 Billion",
  hookHeadline: "Nvidia just shattered Wall Street with a massive 96.2 billion dollar quarter!",
  domain: "bigbreakingwire.in",
  category: "Business",
  imageUrl: "https://i0.wp.com/bigbreakingwire.in/wp-content/uploads/2026/08/DH1L4415-HDR-20220527-r5.jpg?fit=2560%2C1707&ssl=1",
  twitterCard: {
    accountName: "BigBreakingWire",
    handle: "@BigBreakingWire",
    verified: true,
    text: "NVIDIA Q2 FY2027 revenue reached $96.2 billion, up 106% year-on-year.\n\nData Center revenue exploded 117% YoY to $89.0 billion.\n\nGAAP net income skyrocketed 126% to $59.69 billion ($2.46 EPS).",
    bulletPoints: [
      "NVIDIA Q2 FY2027 revenue reached $96.2 billion (+106% YoY).",
      "Data Center revenue exploded 117% YoY to $89.0 billion.",
      "Net income skyrocketed 126% to $59.69 billion ($2.46 EPS)."
    ],
    highlightPhrase: "revenue reached $96.2 billion"
  },
  articleSections: [
    {
      heading: "⚡ Record Breaking Growth",
      content: "NVIDIA Q2 FY2027 revenue reached $96.2 billion, up 106% year-on-year and 18% from the previous quarter.",
      highlight: "reached $96.2 billion, up 106%"
    },
    {
      heading: "📊 Data Center & Net Income",
      content: "Data Center revenue rose 117% year-on-year to $89.0 billion. Net income skyrocketed 126% to $59.69 billion.",
      highlight: "Data Center revenue rose 117%"
    }
  ],
  chartData: {
    enabled: true,
    type: "combo-trend",
    title: "NVIDIA Revenue Trajectory (YoY Growth)",
    subtitle: "Quarterly Revenue in Billions USD",
    prevLabel: "Q2 FY2026",
    prevValue: 46.7,
    prevFormatted: "$46.7B",
    currLabel: "Q2 FY2027",
    currValue: 96.2,
    currFormatted: "$96.2B",
    changeBadge: "+106% YoY SURGE",
    isPositive: true
  },
  takeaways: [
    "Revenue surged 106% to $96.2 Billion.",
    "Data center segment hit $89.0 Billion.",
    "Q3 guidance forecast at $108 Billion."
  ],
  outro: {
    headline: "Big Breaking Wire",
    tagline: "NEWS. FAST. FIRST.",
    subtext: "Like • Share • Subscribe"
  },
  durationInSeconds: 22,
  words: []
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* BigBreakingWire 9:16 Shorts Composition (1080x1920) */}
      <Composition
        id="BigBreakingWireVideo"
        component={BigBreakingWireVideo as any}
        durationInFrames={30 * 22}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultShortVideoProps}
        calculateMetadata={({ props }) => {
          const duration = typeof props.durationInSeconds === 'number' ? props.durationInSeconds : 22;
          return {
            durationInFrames: Math.ceil(duration * 30),
            props,
          };
        }}
      />
    </>
  );
};
