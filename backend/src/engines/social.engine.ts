// ============================================================
// ATHLETE//ZERO — Social Feed Engine
// Generates a fake sports social media universe
// ============================================================

import { v4 as uuidv4 } from 'uuid';
import type { SocialPost, SocialFeed, TrendingHashtag, PostType } from '../types/index';
import { randInt, pickRandom, pickRandomN, now } from '../utils/index';
import { FAN_TWEET_TEMPLATES, ANALYST_TAKES, BREAKING_NEWS } from '../mock/data';
import { geminiGenerateJSON } from '../services/gemini.service';
import { buildSocialFeedPrompt } from '../prompts/index';

// ---- Account shape ----
interface AccountEntry { author: string; handle: string; avatar: string; verified: boolean; }

// ---- Fake Account Pool ----
const ACCOUNTS: Record<PostType, AccountEntry[]> = {
  FAN: [
    { author: 'Cricket Crazy 🏏', handle: '@cricket_crazy_ind', avatar: '🙌', verified: false },
    { author: 'IPL Fanatic', handle: '@iplmaniac_99', avatar: '🔥', verified: false },
    { author: 'Rohit Fan Army', handle: '@rohitfanarmy', avatar: '💙', verified: false },
    { author: 'Stadium Bhai', handle: '@stadiumwalabhai', avatar: '🏟️', verified: false },
    { author: 'Cricket Addict 🇮🇳', handle: '@cricket_addict_in', avatar: '🏏', verified: false },
    { author: 'Vibes Only Fan', handle: '@vibesonly_cricket', avatar: '✨', verified: false },
    { author: 'Boundary Alert', handle: '@boundary_alert_', avatar: '💥', verified: false },
    { author: 'Chennai Superfan', handle: '@csk_die_hard', avatar: '🌟', verified: false },
    { author: 'Koach Era', handle: '@koach_supremacy', avatar: '👑', verified: false },
    { author: 'Toxic IPL Fan', handle: '@toxic_ipl_twt', avatar: '☢️', verified: false },
    { author: 'W or L?', handle: '@W_or_L_cricket', avatar: '⚖️', verified: false }
  ],
  ANALYST: [
    { author: 'CricMetrics', handle: '@cricmetrics', avatar: '📊', verified: true },
    { author: 'Dr. Stats Cricket', handle: '@drstats_cricket', avatar: '🎓', verified: true },
    { author: 'Pitch Report Live', handle: '@pitchreportlive', avatar: '📡', verified: true },
    { author: 'NumbersCricket', handle: '@numberscricket', avatar: '🔢', verified: true },
    { author: 'The Honest Pundit', handle: '@honestpundit_tv', avatar: '🎙️', verified: true },
    { author: 'Harsha Bhogle (Parody)', handle: '@bhogle_bot', avatar: '🗣️', verified: false }
  ],
  MEDIA: [
    { author: 'CricBuzz Breaking', handle: '@cricbuzz_breaking', avatar: '📰', verified: true },
    { author: 'Sports18 Cricket', handle: '@sports18cricket', avatar: '📺', verified: true },
    { author: 'ESPNcricinfo', handle: '@espncricinfo', avatar: '🌐', verified: true },
    { author: 'Times Cricket', handle: '@timescricket', avatar: '🗞️', verified: true },
    { author: 'Cricket Shouts', handle: '@cric_shouts_live', avatar: '📣', verified: true }
  ],
  RIVAL: [
    { author: 'Karan Mehta 😤', handle: '@karan_mehta_cricket', avatar: '😤', verified: true },
    { author: 'Ice King Official', handle: '@arjun_kapoor_ice', avatar: '🥶', verified: true },
    { author: 'The Sultan', handle: '@sultan_pace', avatar: '🦅', verified: true },
    { author: 'DK The Finisher', handle: '@dk_finisher_7', avatar: '⚡', verified: true }
  ],
  COACH: [
    { author: 'Coach Network India', handle: '@coachnetwork_in', avatar: '🏅', verified: true },
    { author: 'The Tactical Board', handle: '@tacticalboard_in', avatar: '📋', verified: false },
    { author: 'Laxman (Parody)', handle: '@vvs_tactics', avatar: '🧠', verified: false }
  ],
  MEME: [
    { author: 'Meme Lord Cricket', handle: '@criclordmemes', avatar: '😂', verified: false },
    { author: 'IPL Memes Factory', handle: '@iplmemes_factory', avatar: '💀', verified: false },
    { author: 'Shitposting Cricket', handle: '@cric_shitpost', avatar: '🤡', verified: false },
    { author: 'Out of Context IPL', handle: '@ooc_ipl', avatar: '🖼️', verified: false }
  ],
};

// ---- Tweet Content Templates ----
const generateTweetContent = (
  playerName: string,
  postType: PostType,
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'HYPE'
): { content: string; hashtags: string[] } => {
  const tags = [
    `#${playerName.replace(/\s/g, '')}`,
    '#IPL2025',
    '#CricketTwitter',
    '#IndianCricket',
    '#MatchDay',
    '#GOAT',
    '#Washed',
    '#T20Madness'
  ];

  const picks: Record<PostType, string[]> = {
    FAN: sentiment === 'POSITIVE' || sentiment === 'HYPE' ? [
      `${playerName} IS HIM. I repeat, HE IS HIM! 🔥🔥🔥`,
      `If you don't rate ${playerName}, you don't know ball. Simple as that. 🏏`,
      `W. Absolute cinema from ${playerName} today. We are witnessing greatness!`,
      `Rent free in the haters' heads! ${playerName} owns this league! 👑`,
      `My GOAT ${playerName} doing GOAT things. 🐐✨`
    ] : [
      `${playerName} is so washed it's actually sad to watch 😭`,
      `L. Huge L. ${playerName} ghosting when the team needs him most. Typical.`,
      `Bro thinks he's the main character. Someone tell ${playerName} to wake up! 💀`,
      `Overrated merchant ${playerName} exposed again. The PR can't save you now.`,
      `Drop ${playerName} next match. I've seen enough.`
    ],
    ANALYST: sentiment === 'POSITIVE' || sentiment === 'HYPE' ? [
      `Just looking at the data... ${playerName}'s impact metric is off the charts in the death overs. Incredible value. 📊`,
      `Stephen A style take: I don't care what the haters say, ${playerName} is a TOP 5 player in this format right now! 🗣️`,
      `The bat speed, the torque, the intent. ${playerName} is fundamentally changing how this phase of the game is played.`,
      `You simply cannot set a field for ${playerName} when they are in this mood. Tactical nightmare for the opposition.`
    ] : [
      `The numbers don't lie. ${playerName}'s strike rate against spin in the middle overs is a massive liability. 📉`,
      `I've been saying this for weeks: ${playerName}'s technique is getting exposed by high-pace back-of-a-length deliveries.`,
      `Tactically, bringing ${playerName} here was a blunder. The match up was entirely wrong.`,
      `Is it time to have the difficult conversation about ${playerName}'s place in the XI?`
    ],
    MEDIA: [
      `🚨 BREAKING: ${playerName}'s performance sends shockwaves through the league! The stadium is electric! ⚡`,
      `EXCLUSIVE: Inside the dressing room after ${playerName}'s unbelievable display tonight. 🗞️`,
      `JUST IN: ${playerName} trends globally after THAT moment in tonight's clash. 🌐`,
      `SPORTS18 HIGHLIGHTS: Watch every moment of ${playerName}'s chaotic spell here! 📺`,
      `REPORT: Debate erupts over ${playerName}'s tactics. Genius or madness? 🏏`
    ],
    RIVAL: sentiment === 'POSITIVE' || sentiment === 'HYPE' ? [
      `Aight, I see you ${playerName}. Keep that same energy when we meet next week. 👀`,
      `Enjoy the spotlight, ${playerName}. Just remember who holds the real crown around here. 👑`,
      `Good game today. But I'm still better. 🤫`
    ] : [
      `${playerName} impressed a few people today. I'm not one of them. Come talk to me after 5 seasons. 😤`,
      `Watched the highlights. Decent. Let's see how you handle REAL pressure. #NotImpressed`,
      `The media loves a new darling. Every season. Enjoy it while it lasts, ${playerName}.`,
      `Lol, call me when ${playerName} actually wins something that matters. 🥶`
    ],
    COACH: [
      `Technical brilliance from ${playerName} today. The work is paying off. Keep going. 💪`,
      `That composure under pressure — that's what separates good from great. ${playerName} showed it today.`,
      `Numbers don't lie. ${playerName} is developing exactly as we expected. The best is yet to come.`,
      `Still lots of work to do, but ${playerName} showed great character out there. Back to the nets tomorrow.`
    ],
    MEME: sentiment === 'POSITIVE' || sentiment === 'HYPE' ? [
      `[Image of a gigachad] ${playerName} ignoring the haters and carrying the team today 💀`,
      `Me explaining to my dad why ${playerName} is the future of Indian Cricket: 📖🤓✍️`,
      `Bowlers when they see ${playerName} walking out to bat: *chuckles* I'm in danger 😭`,
      `[Drake pointing meme] Normal cricket ❌ / ${playerName} absolute cinema ✅`
    ] : [
      `[Clown makeup meme] Me believing ${playerName} would actually clutch up today 🤡`,
      `${playerName} walking to the crease vs ${playerName} walking back 5 mins later 💀🚶‍♂️`,
      `Bro thought he was prime Kohli but played like prime me in gully cricket 😭`,
      `[Homer Simpson disappearing into bushes] ${playerName} when the required run rate goes above 10 📉`
    ],
  };

  const contentPool = picks[postType] || picks.FAN;
  const content = pickRandom(contentPool);
  
  let numTags = 1;
  if (postType === 'FAN' || postType === 'MEME') numTags = randInt(1, 3);
  if (postType === 'MEDIA' || postType === 'ANALYST') numTags = randInt(2, 4);
  const hashtags = pickRandomN(tags, numTags);

  return { content, hashtags };
};

// ---- Trending Hashtag Generator ----
const generateTrendingHashtags = (playerName: string): TrendingHashtag[] => {
  const baseName = playerName.replace(/\s/g, '');
  const tags = [
    { tag: `#${baseName}`, count: randInt(45000, 250000), trend: 'VIRAL' as const },
    { tag: '#IPL2025', count: randInt(200000, 800000), trend: 'STABLE' as const },
    { tag: `#${baseName}GOAT`, count: randInt(15000, 80000), trend: 'RISING' as const },
    { tag: '#CricketTwitter', count: randInt(100000, 500000), trend: 'STABLE' as const },
    { tag: `#${baseName}IsFinished`, count: randInt(5000, 60000), trend: 'RISING' as const },
    { tag: '#MatchDay', count: randInt(50000, 200000), trend: 'STABLE' as const },
    { tag: '#Washed', count: randInt(15000, 90000), trend: 'RISING' as const },
  ];

  return pickRandomN(tags, 5).sort((a, b) => b.count - a.count);
};

// ---- Mock Feed Generator ----
const generateMockFeed = (
  playerName: string,
  sentiment: 'mixed' | 'positive' | 'negative' = 'mixed',
  hypeScore: number = 50,
  clutchFactor: number = 50
): SocialFeed => {
  const postConfigs: Array<{ type: PostType; sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'HYPE' }> = [
    { type: 'FAN', sentiment: 'HYPE' },
    { type: 'MEME', sentiment: sentiment === 'negative' ? 'NEGATIVE' : 'HYPE' },
    { type: 'ANALYST', sentiment: sentiment === 'negative' ? 'NEGATIVE' : 'POSITIVE' },
    { type: 'MEDIA', sentiment: 'NEUTRAL' },
    { type: 'FAN', sentiment: sentiment === 'positive' ? 'HYPE' : 'NEGATIVE' },
    { type: 'RIVAL', sentiment: 'NEGATIVE' },
    { type: 'MEME', sentiment: sentiment === 'positive' ? 'POSITIVE' : 'NEGATIVE' },
    { type: 'COACH', sentiment: 'POSITIVE' },
    { type: 'FAN', sentiment: 'HYPE' },
    { type: 'ANALYST', sentiment: 'NEUTRAL' },
    { type: 'MEDIA', sentiment: 'HYPE' },
    { type: 'FAN', sentiment: sentiment === 'positive' ? 'POSITIVE' : 'NEGATIVE' },
  ];

  // Boost engagement significantly based on hype and clutch factors
  const engagementMultiplier = 1 + (hypeScore / 100) + (clutchFactor > 80 ? 1.5 : 0);

  const posts: SocialPost[] = postConfigs.map((config) => {
    const accountPool = ACCOUNTS[config.type] ?? ACCOUNTS.FAN;
    const account = pickRandom(accountPool);
    const { content, hashtags } = generateTweetContent(playerName, config.type, config.sentiment);

    return {
      id: uuidv4(),
      author: account.author,
      handle: account.handle,
      avatar: account.avatar,
      content,
      postType: config.type,
      likes: Math.floor(randInt(50, 150000) * engagementMultiplier),
      retweets: Math.floor(randInt(10, 40000) * engagementMultiplier),
      replies: Math.floor(randInt(5, 5000) * engagementMultiplier),
      timestamp: now(),
      isVerified: account.verified,
      hashtags,
      sentiment: config.sentiment,
    };
  });

  const sentimentScore =
    sentiment === 'positive' ? randInt(70 + (clutchFactor/5), 90 + (clutchFactor/10))
    : sentiment === 'negative' ? randInt(20, 45)
    : randInt(48, 72);

  return {
    posts: posts.sort((a, b) => b.likes - a.likes), // Sort by engagement
    trendingHashtags: generateTrendingHashtags(playerName),
    totalBuzz: Math.floor(posts.reduce((sum, p) => sum + p.likes + p.retweets, 0)),
    sentimentScore: Math.min(100, Math.floor(sentimentScore)),
  };
};

// ---- Public API ----

/**
 * Generate social feed with Gemini AI or fallback to mock
 */
export const generateSocialFeed = async (
  playerName: string,
  matchSummary: string,
  sentiment: 'mixed' | 'positive' | 'negative' = 'mixed',
  hypeScore: number = 50,
  clutchFactor: number = 50
): Promise<SocialFeed> => {
  const prompt = buildSocialFeedPrompt(playerName, matchSummary, sentiment);

  type GeminiFeedResponse = {
    posts: Array<{
      author: string;
      handle: string;
      content: string;
      postType: PostType;
      isVerified: boolean;
      sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'HYPE';
      hashtags: string[];
    }>;
    trendingHashtags: string[];
  };

  const result = await geminiGenerateJSON<GeminiFeedResponse>(prompt, { posts: [], trendingHashtags: [] });
  const engagementMultiplier = 1 + (hypeScore / 100) + (clutchFactor > 80 ? 1.5 : 0);

  if (result.posts && result.posts.length > 0) {
    const posts: SocialPost[] = result.posts.map((p) => {
      const accountPool = ACCOUNTS[p.postType] ?? ACCOUNTS.FAN;
      const account = pickRandom(accountPool);
      return {
        id: uuidv4(),
        author: p.author || account.author,
        handle: p.handle || account.handle,
        avatar: account.avatar,
        content: p.content,
        postType: p.postType,
        likes: Math.floor(randInt(100, 100000) * engagementMultiplier),
        retweets: Math.floor(randInt(20, 25000) * engagementMultiplier),
        replies: Math.floor(randInt(5, 3000) * engagementMultiplier),
        timestamp: now(),
        isVerified: p.isVerified,
        hashtags: p.hashtags,
        sentiment: p.sentiment,
      };
    });

    return {
      posts: posts.sort((a, b) => b.likes - a.likes),
      trendingHashtags: result.trendingHashtags.map((tag) => ({
        tag,
        count: Math.floor(randInt(5000, 200000) * engagementMultiplier),
        trend: 'RISING' as const,
      })),
      totalBuzz: Math.floor(posts.reduce((sum, p) => sum + p.likes + p.retweets, 0)),
      sentimentScore: Math.min(100, Math.floor(randInt(55, 90) + (clutchFactor/10))),
    };
  }

  return generateMockFeed(playerName, sentiment, hypeScore, clutchFactor);
};

/**
 * Generate instant mock feed (no AI, instant response)
 */
export const getMockSocialFeed = (
  playerName: string, 
  sentiment: 'mixed' | 'positive' | 'negative' = 'mixed',
  hypeScore: number = 50,
  clutchFactor: number = 50
): SocialFeed =>
  generateMockFeed(playerName, sentiment, hypeScore, clutchFactor);

/**
 * Generate fan reactions only
 */
export const getFanReactions = (playerName: string, count: number = 6): SocialPost[] => {
  return Array.from({ length: count }, () => {
    const account = pickRandom(ACCOUNTS.FAN);
    const isPositive = Math.random() > 0.3;
    const templates = FAN_TWEET_TEMPLATES[isPositive ? 0 : 1].templates;
    const content = pickRandom(templates).replace('{player}', playerName);

    return {
      id: uuidv4(),
      author: account.author,
      handle: account.handle,
      avatar: account.avatar,
      content,
      postType: 'FAN' as PostType,
      likes: randInt(50, 50000),
      retweets: randInt(10, 10000),
      replies: randInt(2, 1000),
      timestamp: now(),
      isVerified: false,
      hashtags: ['#CricketTwitter', `#IPL2025`],
      sentiment: isPositive ? 'POSITIVE' : 'NEGATIVE',
    };
  });
};
