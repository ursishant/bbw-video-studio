export interface SubtitleWord {
  word: string;
  start: number; // in seconds
  end: number;   // in seconds
}

export interface TwitterCardData {
  accountName: string;
  handle: string;
  avatarUrl?: string;
  verified?: boolean;
  text: string;
  bulletPoints?: string[];
  highlightPhrase?: string;
}

export interface ArticleSection {
  heading?: string;
  content: string;
  highlight?: string;
}

export interface ChartData {
  enabled?: boolean;
  type?: 'combo-trend' | 'area-spline' | 'bar-comparison' | 'donut-breakdown';
  title: string;
  subtitle?: string;
  metricUnit?: string;
  prevLabel: string;
  prevValue: number;
  prevFormatted?: string;
  currLabel: string;
  currValue: number;
  currFormatted?: string;
  changeBadge?: string;
  isPositive?: boolean;
  datapoints?: Array<{ label: string; value: number; formatted?: string; isPeak?: boolean }>;
}

export interface VideoSchema {
  title: string;
  hookHeadline: string;
  domain: string;
  category?: string;
  imageUrl: string;
  twitterCard: TwitterCardData;
  articleSections: ArticleSection[];
  chartData?: ChartData;
  takeaways: string[];
  outro: {
    headline: string;
    tagline: string;
    subtext: string;
  };
  audioUrl?: string;
  bgMusicUrl?: string;
  subtitleColor?: string;
  sceneOrder?: 'hook-first' | 'article-first' | 'chart-first';
  durationInSeconds: number;
  words: SubtitleWord[];
  voice?: string;
  speechRate?: string;
}
