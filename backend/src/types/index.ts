// ============================================================
// ATHLETE//ZERO — Core TypeScript Types
// ============================================================

export type PlayerRole = 'BATSMAN' | 'BOWLER' | 'ALL_ROUNDER' | 'WICKET_KEEPER';
export type BattingStyle = 'RIGHT_HAND' | 'LEFT_HAND';
export type BowlingStyle = 'FAST' | 'MEDIUM' | 'SPIN' | 'NONE';
export type Personality = 'AGGRESSIVE' | 'CALM' | 'SHOWMAN' | 'UNDERDOG' | 'VETERAN';
export type Specialty =
  | 'BIG_HITTER'
  | 'SPIN_WIZARD'
  | 'PACE_KING'
  | 'CLUTCH_PLAYER'
  | 'STREET_FIGHTER'
  | 'ANCHOR';

// ---- Player ----
export interface Player {
  id: string;
  name: string;
  role: PlayerRole;
  battingStyle: BattingStyle;
  bowlingStyle: BowlingStyle;
  personality: Personality;
  specialty: Specialty;
  level: number;
  xp: number;
  followers: number;
  confidence: number; // 0-100
  fitness: number; // 0-100
  reputation: number; // 0-100
  totalMatches: number;
  totalRuns: number;
  totalWickets: number;
  createdAt: string;
}

export interface CreatePlayerDTO {
  name: string;
  role: PlayerRole;
  battingStyle: BattingStyle;
  bowlingStyle: BowlingStyle;
  personality: Personality;
  specialty: Specialty;
}

// ---- Match ----
export type MatchPhase = 'POWERPLAY' | 'MIDDLE' | 'DEATH' | 'SUPER_OVER';
export type EventType =
  | 'SIX'
  | 'FOUR'
  | 'WICKET'
  | 'DOT'
  | 'RUN'
  | 'WIDE'
  | 'NO_BALL'
  | 'MILESTONE'
  | 'MOMENTUM_SHIFT'
  | 'CROWD_SURGE'
  | 'CLUTCH_MOMENT'
  | 'COMEBACK'
  | 'DROPPED_CATCH'
  | 'REVIEW';

export interface BallEvent {
  over: number;
  ball: number;
  overBall: string;          // e.g. "18.4"
  eventType: EventType;
  description: string;        // commentary line
  cinematic: string;          // one-line cinematic caption
  runs: number;
  playerRuns: number;
  teamScore: number;
  wickets: number;
  momentumShift: number;      // -10 to +10
  momentum: number;           // running 0-100
  crowdEnergy: number;        // 0-100
  crowdSound: CrowdSound;
  isHighlight: boolean;
  isBoundary: boolean;
  isSix: boolean;
  isWicket: boolean;
  tensionLevel: number;       // 0-100, drives UI tension effects
}

export type CrowdSound =
  | 'ROAR'
  | 'GASP'
  | 'CHANT'
  | 'MURMUR'
  | 'SILENCE'
  | 'EXPLOSION'
  | 'WAVE';

export type NarrativeAct =
  | 'OPENING_STATEMENT'   // overs 1-4
  | 'EARLY_DRAMA'         // overs 5-8
  | 'MIDDLE_GRIND'        // overs 9-12
  | 'TENSION_BUILD'       // overs 13-16
  | 'DEATH_APPROACH'      // overs 17-18
  | 'LAST_OVER_CHAOS'     // over 19
  | 'FINALE';             // over 20

export interface OverSummary {
  over: number;
  phase: MatchPhase;
  act: NarrativeAct;
  runsInOver: number;
  wicketsInOver: number;
  scoreAtEnd: string;          // e.g. "142/3"
  momentumAtEnd: number;
  crowdEnergyAtEnd: number;
  overHeadline: string;        // dramatic one-liner for the over
  highlightBall: string;       // e.g. "18.4" of the most dramatic ball
  events: BallEvent[];
}

export interface MomentumPoint {
  over: number;
  momentum: number;            // 0-100
  crowdEnergy: number;
  tensionLevel: number;
  label?: string;              // e.g. "WICKET FALLS", "SIX!"
}

export interface MatchTimeline {
  events: BallEvent[];
  overs: OverSummary[];
  momentumGraph: MomentumPoint[];
  totalOvers: number;
  finalScore: number;
  finalWickets: number;
  targetScore: number;
  requiredRunRate: number;
  playerRuns: number;
  playerWickets: number;
  playerStrikeRate: number;
  result: 'WIN' | 'LOSS' | 'TIED';
  winMargin: string;
  winType: 'LAST_BALL' | 'LAST_OVER' | 'COMFORTABLE' | 'CRUSHING' | 'SUPER_OVER';
  narrativeArc: string;        // one-paragraph story of the match
  mvpMoment: string;
  mvpBall: string;             // e.g. "19.6"
  peakMomentum: number;
  highestCrowdEnergy: number;
  totalSixes: number;
  totalFours: number;
  dramaticMoments: string[];   // top 3 cinematic moments
  
  // ---- Emotional Momentum System ----
  hypeScore: number;           // 0-100
  pressureIndex: number;       // 0-100 average or peak pressure
  clutchFactor: number;        // 0-100 (player's clutch performance under pressure)
  confidenceSwings: { over: number; change: number; reason: string }[];
}

export interface MatchContext {
  playerId: string;
  opponentName: string;
  opponentDifficulty: number; // 1-10
  rivalryIntensity: number; // 0-100
  venue: string;
  matchType: 'T20' | 'IPL_QUALIFIER' | 'WORLD_CUP' | 'RIVALRY_MATCH';
  isPlayoffMatch: boolean;
}

export interface MatchState {
  id: string;
  context: MatchContext;
  timeline: MatchTimeline;
  xpEarned: number;
  followersGained: number;
  confidenceChange: number;
  reputationChange: number;
  startedAt: string;
  completedAt: string | null;
}

// ---- AI Story ----
export interface StoryOutput {
  headline: string;
  subheadline: string;
  coach: string;
  rival: string;
  fans: string[];
  commentary: string[];
  hashtags: string[];
  sponsor: string;
  analystTake: string;
  breakingNews: string;
  viralTweet: string;
  memeCaption: string;
}

// ---- Commentary ----
export interface CommentaryLine {
  id: string;
  text: string;
  tone: 'HYPE' | 'DRAMATIC' | 'TENSE' | 'CELEBRATORY' | 'SHOCKED';
  intensity: number; // 1-10
  timestamp: string;
}

// ---- Social Feed ----
export type PostType = 'FAN' | 'ANALYST' | 'MEDIA' | 'RIVAL' | 'COACH' | 'MEME';

export interface SocialPost {
  id: string;
  author: string;
  handle: string;
  avatar: string; // emoji
  content: string;
  postType: PostType;
  likes: number;
  retweets: number;
  replies: number;
  timestamp: string;
  isVerified: boolean;
  hashtags: string[];
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'HYPE';
}

export interface SocialFeed {
  posts: SocialPost[];
  trendingHashtags: TrendingHashtag[];
  totalBuzz: number;
  sentimentScore: number; // 0-100
}

export interface TrendingHashtag {
  tag: string;
  count: number;
  trend: 'RISING' | 'STABLE' | 'VIRAL';
}

// ---- Rival ----
export type RivalTier = 'LOCAL' | 'REGIONAL' | 'NATIONAL' | 'LEGEND';

export interface Rival {
  id: string;
  name: string;
  nickname: string;
  tier: RivalTier;
  personality: Personality;
  level: number;
  intensityScore: number; // 0-100
  trashTalk: string[];
  catchphrase: string;
  weaknesses: string[];
  strengths: string[];
  avatarEmoji: string;
  rivalryHistory: string;
}

export interface RivalResponse {
  rivalId: string;
  playerResponse: string;
  rivalReaction: string;
  intensityChange: number;
  crowdReaction: string;
  mediaHeadline: string;
}

// ---- Sponsor ----
export interface SponsorOffer {
  id: string;
  brand: string;
  tagline: string;
  offerValue: string; // e.g. "₹50L deal"
  requirement: string;
  expiresIn: string;
  category: 'SPORTS_GEAR' | 'ENERGY_DRINK' | 'LUXURY' | 'TECH' | 'LIFESTYLE';
  logoEmoji: string;
  isExclusive: boolean;
}

// ---- Progression ----
export interface ProgressionUpdate {
  xpGained: number;
  xpTotal: number;
  levelBefore: number;
  levelAfter: number;
  leveledUp: boolean;
  followersGained: number;
  followersTotal: number;
  confidenceChange: number;
  reputationChange: number;
  unlockedMilestone: string | null;
  newTitle: string | null;
}

// ---- API Responses ----
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}
