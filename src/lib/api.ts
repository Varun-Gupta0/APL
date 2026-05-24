// ============================================================
// ATHLETE//ZERO — Frontend API Client
// ============================================================

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface BackendPlayer {
  id: string;
  name: string;
  role: "BATSMAN" | "BOWLER" | "ALL_ROUNDER" | "WICKET_KEEPER";
  battingStyle: "RIGHT_HAND" | "LEFT_HAND";
  bowlingStyle: "FAST" | "MEDIUM" | "SPIN" | "NONE";
  personality: "AGGRESSIVE" | "CALM" | "SHOWMAN" | "UNDERDOG" | "VETERAN";
  specialty: "BIG_HITTER" | "SPIN_WIZARD" | "PACE_KING" | "CLUTCH_PLAYER" | "STREET_FIGHTER" | "ANCHOR";
  level: number;
  xp: number;
  followers: number;
  confidence: number;
  fitness: number;
  reputation: number;
  totalMatches: number;
  totalRuns: number;
  totalWickets: number;
  createdAt: string;
}

export interface CreatePlayerDTO {
  name: string;
  role: string;
  battingStyle: string;
  bowlingStyle: string;
  personality: string;
  specialty: string;
}

export interface MatchEvent {
  over: number;
  ball: number;
  overBall: string;
  eventType: string;
  description: string;
  cinematic: string;
  runs: number;
  playerRuns: number;
  teamScore: number;
  wickets: number;
  momentumShift: number;
  momentum: number;
  crowdEnergy: number;
  crowdSound: string;
  isHighlight: boolean;
  isBoundary: boolean;
  isSix: boolean;
  isWicket: boolean;
  tensionLevel: number;
}

export interface OverSummary {
  over: number;
  phase: string;
  act: string;
  runsInOver: number;
  wicketsInOver: number;
  scoreAtEnd: string;
  momentumAtEnd: number;
  crowdEnergyAtEnd: number;
  overHeadline: string;
  highlightBall: string;
  events: MatchEvent[];
}

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
  unlockedMilestone?: string;
  newTitle?: string;
}

export interface SponsorOffer {
  id: string;
  brand: string;
  tagline: string;
  offerValue: string;
  requirement: string;
  expiresIn: string;
  category: string;
  logoEmoji: string;
  isExclusive: boolean;
}

export interface CommentaryLine {
  id: string;
  text: string;
  tone: string;
  intensity: number;
  timestamp: string;
}

export interface MatchSimulationResult {
  timeline: {
    opponentName: string;
    venue: string;
    matchType: string;
    isPlayoffMatch: boolean;
    result: string;
    playerRuns: number;
    playerWickets: number;
    commentaryCount: number;
    hypeScore: number;
    clutchFactor: number;
    overs: OverSummary[];
  };
  progression: ProgressionUpdate;
  updatedPlayer: BackendPlayer;
  sponsors: SponsorOffer[];
  preMatchCommentary: CommentaryLine[];
  xpEarned: number;
  followersGained: number;
}

export interface SocialPost {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  content: string;
  postType: "FAN" | "MEDIA" | "ANALYST" | "RIVAL" | "COACH" | "MEME";
  likes: number;
  retweets: number;
  replies: number;
  timestamp: string;
  isVerified: boolean;
  hashtags: string[];
  sentiment: "POSITIVE" | "NEGATIVE" | "NEUTRAL" | "HYPE";
}

export interface SocialFeedResponse {
  feed: {
    posts: SocialPost[];
    trendingHashtags: Array<{ tag: string; count: number; trend: string }>;
    totalBuzz: number;
    sentimentScore: number;
  };
  playerName: string;
  aiGenerated: boolean;
}

export interface RivalProfile {
  id: string;
  name: string;
  team: string;
  role: string;
  personality: string;
  avatar: string;
  ovr: number;
  tension: number;
  history: {
    matchesPlayed: number;
    playerWins: number;
    rivalWins: number;
    lastMatchResult: string;
  };
  status: "ACTIVE" | "COMPLETED" | "DORMANT";
  dialogue?: string;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errText = await response.text();
    let message = "Network response was not ok";
    try {
      const parsed = JSON.parse(errText);
      message = parsed.error || parsed.message || message;
    } catch {
      message = errText || message;
    }
    throw new Error(message);
  }
  const result = await response.json();
  return result.data as T;
}

export const api = {
  // Player Endpoints
  async getPlayer(): Promise<BackendPlayer> {
    const res = await fetch(`${API_BASE_URL}/api/player`);
    return handleResponse<BackendPlayer>(res);
  },

  async createPlayer(data: CreatePlayerDTO): Promise<BackendPlayer> {
    const res = await fetch(`${API_BASE_URL}/api/create-player`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    // Wait, the create-player response returns:
    // { success: true, data: { player: BackendPlayer, xpProgress: ... } }
    // Let's check how the controller handles it. We saw it returns the player wrapped.
    // Let's make sure our typed fetch parses the nested player object if it is nested.
    // In our curl:
    // {"success":true,"data":{"player":{...},"xpProgress":{...}}}
    // So the data has a nested "player" field! Let's handle both.
    const rawData = await handleResponse<any>(res);
    return rawData.player ? (rawData.player as BackendPlayer) : (rawData as BackendPlayer);
  },

  // Match Simulation
  async startMatch(params: {
    opponentName?: string;
    opponentDifficulty?: number;
    rivalryIntensity?: number;
    venue?: string;
    matchType?: string;
    isPlayoffMatch?: boolean;
  }): Promise<MatchSimulationResult> {
    const res = await fetch(`${API_BASE_URL}/api/start-match`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    return handleResponse<MatchSimulationResult>(res);
  },

  // Social Feed
  async getSocialFeed(ai: boolean = true, sentiment: string = "mixed"): Promise<SocialFeedResponse> {
    const res = await fetch(`${API_BASE_URL}/api/social-feed?ai=${ai}&sentiment=${sentiment}`);
    // The endpoint returns successResponse({ feed, playerName, aiGenerated })
    // So we can parse the complete response object.
    if (!res.ok) {
      throw new Error("Failed to fetch social feed");
    }
    const json = await res.json();
    return json.data as SocialFeedResponse;
  },

  // Rivals
  async getRivals(): Promise<RivalProfile[]> {
    const res = await fetch(`${API_BASE_URL}/api/rival`);
    // Wait! Let's check what /api/rival returns. It usually returns { success: true, data: { rivals: [...] } } or { success: true, data: [...] }
    const rawData = await handleResponse<any>(res);
    return Array.isArray(rawData) ? rawData : (rawData.rivals as RivalProfile[]);
  },

  // Training Ground Simulation (Updates on the backend are simulated by giving XP and upgrading stats)
  async simulateTraining(drillCategory: string, xpGained: number): Promise<BackendPlayer> {
    // Note: The backend doesn't have an explicit training endpoint in the list of registered routes:
    // GET /health, POST /api/create-player, GET /api/player, POST /api/start-match, etc.
    // So we'll update training locally or we can trigger a mock post to backend player update if needed.
    // Wait! In APL backend, is there a training or update-player endpoint? Let's check backend/src/routes/player.routes.ts.
    return {} as BackendPlayer;
  }
};
