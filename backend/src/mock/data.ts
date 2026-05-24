// ============================================================
// ATHLETE//ZERO — Mock Data Library
// ============================================================

import type { Rival, SponsorOffer } from '../types/index';

// ---- Rival Pool ----
export const RIVAL_POOL: Rival[] = [
  {
    id: 'rival_001',
    name: 'Karan Mehta',
    nickname: 'The Destroyer',
    tier: 'NATIONAL',
    personality: 'AGGRESSIVE',
    level: 12,
    intensityScore: 88,
    trashTalk: [
      "You don't belong on the same pitch as me.",
      'Enjoy your 15 minutes. The crowd forgets losers fast.',
      "I've broken better players than you before breakfast.",
      'Your stats are a joke. My warm-up scores beat your best.',
    ],
    catchphrase: 'I don\'t play matches. I make legends irrelevant.',
    weaknesses: ['yorkers under pressure', 'slow left-arm spin'],
    strengths: ['power hitting', 'crowd intimidation', 'media presence'],
    avatarEmoji: '😤',
    rivalryHistory: 'Three encounters. Three controversies. One ongoing war.',
  },
  {
    id: 'rival_002',
    name: 'Arjun Kapoor',
    nickname: 'The Ice King',
    tier: 'NATIONAL',
    personality: 'CALM',
    level: 15,
    intensityScore: 72,
    trashTalk: [
      'I hope you perform well. It makes it more satisfying when I dismantle you.',
      'Statistics don\'t lie. Mine speak. Yours whisper.',
      'Pressure is just a concept for those not prepared.',
      'Rookies always look confident before their first real test.',
    ],
    catchphrase: 'Excellence is not a mood. It\'s a lifestyle.',
    weaknesses: ['bouncer barrage', 'pressure of big chases'],
    strengths: ['technical precision', 'mental fortitude', 'consistency'],
    avatarEmoji: '🥶',
    rivalryHistory: 'The Ice King has never lost to a debut-season player. Until now?',
  },
  {
    id: 'rival_003',
    name: 'Vikram Singh',
    nickname: 'The Showman',
    tier: 'REGIONAL',
    personality: 'SHOWMAN',
    level: 9,
    intensityScore: 95,
    trashTalk: [
      'The crowd came for ME. You\'re just the opening act.',
      'I\'ll be signing autographs when you\'re watching from the dugout.',
      'Trending on X? That\'s my arena. You\'re just visiting.',
      'The cameras follow STARS. Not shadows.',
    ],
    catchphrase: 'Cricket is theatre. And I\'m the only actor who matters.',
    weaknesses: ['consistent pressure', 'when crowd turns against him'],
    strengths: ['big moments', 'media presence', 'flair shots'],
    avatarEmoji: '🎭',
    rivalryHistory: 'Vikram made a viral Reel mocking your debut. The comments are brutal.',
  },
  {
    id: 'rival_004',
    name: 'Dev Rathore',
    nickname: 'The Street King',
    tier: 'REGIONAL',
    personality: 'UNDERDOG',
    level: 7,
    intensityScore: 65,
    trashTalk: [
      'I clawed my way up from nothing. You\'ve had every advantage.',
      'Don\'t underestimate me because of my background.',
      'They counted me out every single time. Still here.',
      'This isn\'t a story about you. It\'s about me proving everyone wrong.',
    ],
    catchphrase: 'The streets made me. The stadium can\'t break me.',
    weaknesses: ['high-pressure finals', 'experienced bowling attacks'],
    strengths: ['grit', 'hunger', 'underdog mentality'],
    avatarEmoji: '🔥',
    rivalryHistory: 'Dev was cut from the same academy you came from. He never forgot.',
  },
];

// ---- Sponsor Offer Pool ----
export const SPONSOR_POOL: SponsorOffer[] = [
  {
    id: 'sponsor_001',
    brand: 'ThunderStrike Energy',
    tagline: 'Fuel the Champion Inside You',
    offerValue: '₹45L deal + royalties',
    requirement: 'Score 50+ in 3 consecutive matches',
    expiresIn: '48 hours',
    category: 'ENERGY_DRINK',
    logoEmoji: '⚡',
    isExclusive: false,
  },
  {
    id: 'sponsor_002',
    brand: 'NovaBlade Cricket',
    tagline: 'Crafted for Legends',
    offerValue: '₹80L bat deal + signature edition',
    requirement: 'Win a match with 75+ runs',
    expiresIn: '72 hours',
    category: 'SPORTS_GEAR',
    logoEmoji: '🏏',
    isExclusive: true,
  },
  {
    id: 'sponsor_003',
    brand: 'Apex Wearables',
    tagline: 'Track Your Greatness',
    offerValue: '₹30L + smartwatch royalty',
    requirement: '1M+ followers on social',
    expiresIn: '24 hours',
    category: 'TECH',
    logoEmoji: '⌚',
    isExclusive: false,
  },
  {
    id: 'sponsor_004',
    brand: 'Zenith Luxury',
    tagline: 'For Those Who Arrived',
    offerValue: '₹2Cr lifestyle deal',
    requirement: 'Win Player of the Match award',
    expiresIn: '12 hours',
    category: 'LUXURY',
    logoEmoji: '💎',
    isExclusive: true,
  },
  {
    id: 'sponsor_005',
    brand: 'AeroFit India',
    tagline: 'Move Like a Champion',
    offerValue: '₹55L apparel + campaign shoot',
    requirement: 'Maintain 80+ fitness rating',
    expiresIn: '36 hours',
    category: 'LIFESTYLE',
    logoEmoji: '👟',
    isExclusive: false,
  },
];

// ---- Commentary Templates ----
export const COMMENTARY_TEMPLATES = {
  SIX: [
    '🚀 THAT IS ABSOLUTELY MASSIVE! INTO THE SECOND TIER!',
    '💥 SIX! SIX! THE CROWD IS ON THEIR FEET!',
    '🌟 WHAT A SHOT! THE BOWLER HAS NO ANSWER!',
    '🔥 CLEARED THE ROPES WITH EASE! CONTEMPTUOUS CRICKET!',
    '⚡ THAT BALL IS STILL TRAVELLING! INCREDIBLE POWER!',
  ],
  FOUR: [
    '🎯 PIERCED THE GAP! FOUR RUNS! TEXTBOOK STUFF!',
    '🏃 RACED TO THE BOUNDARY! PRECISION TIMING!',
    '💫 OFF THE BACK FOOT AND THROUGH COVERS! GORGEOUS!',
    '🎪 WHIPPED THROUGH MID-WICKET! NO STOPPING THAT!',
  ],
  WICKET: [
    '😱 OH NO! TIMBER! THE STUMPS ARE SHATTERED!',
    '💀 OUT! WHAT A DELIVERY! THE CELEBRATION IS WILD!',
    '🎳 CLEAN BOWLED! THAT BALL WAS UNPLAYABLE!',
    '🔔 CAUGHT! CAUGHT! THE FIELDER HELD ON!',
    '😤 DISMISSED! THE CROWD ERUPTS — MIXED REACTIONS!',
  ],
  MOMENTUM_SHIFT: [
    '🌊 THE MOMENTUM HAS SWUNG DRAMATICALLY!',
    '⚡ EVERYTHING CHANGES IN AN INSTANT! THIS IS CRICKET!',
    '🎭 WHAT A TURNAROUND! THE STADIUM CAN\'T BELIEVE IT!',
    '🌪️ THE TIDE IS TURNING! FEEL THE ENERGY SHIFT!',
  ],
  CROWD_SURGE: [
    '🏟️ THE CROWD ERUPTS! 60,000 PEOPLE ON THEIR FEET!',
    '📢 DEAFENING NOISE! YOU CANNOT HEAR YOURSELF THINK!',
    '🎉 THE STADIUM HAS LOST ITS MIND! ABSOLUTE MAYHEM!',
    '🔊 CROWD CHANTING! THE ATMOSPHERE IS ELECTRIC!',
  ],
  CLUTCH_MOMENT: [
    '😤 THIS IS THE MOMENT. RIGHT HERE. RIGHT NOW.',
    '🎯 THE PRESSURE IS IMMENSE — CAN THEY DELIVER?',
    '💎 CLUTCH TIME! THE GREATS SHOW UP WHEN IT MATTERS!',
    '🔥 NERVES OF STEEL REQUIRED! WHO BLINKS FIRST?',
  ],
  COMEBACK: [
    '🦅 FROM THE ASHES! THE COMEBACK IS REAL!',
    '💪 NEVER WRITE OFF A CHAMPION! THEY\'RE BACK!',
    '🌅 WHAT A RESURRECTION! CRICKET IS UNSCRIPTABLE!',
    '🔥 AGAINST ALL ODDS! THIS IS WHY WE WATCH!',
  ],
  MILESTONE: [
    '🏆 MILESTONE! THE SCOREBOARD LIGHTS UP!',
    '🎊 HALF CENTURY! THE CROWD GIVES A STANDING OVATION!',
    '⭐ CENTURY! A MOMENT THAT WILL LIVE FOREVER!',
    '👏 THE ACHIEVEMENTS KEEP COMING! HISTORIC STUFF!',
  ],
};

// ---- Fan Tweet Templates ----
export const FAN_TWEET_TEMPLATES = [
  { positive: true, templates: [
    '🔥 {player} is an absolute UNIT today! #CricketTwitter',
    'Bro {player} said "not today" and meant it 😭💪',
    'Watching {player} play is like watching art bro 🖼️',
    'THE SCENES! {player} IS UNREAL RN 😤🔥 #{hashtag}',
    'I told everyone. I TOLD EVERYONE. {player} is different 🚀',
    'My man {player} out here making miracles look routine 😎',
    'Generation defining talent right here. {player} > everyone #{hashtag}',
  ]},
  { positive: false, templates: [
    'Overrated. Absolutely overrated. The hype around {player} is embarrassing tbh',
    '{player} had one good match and Twitter went crazy. Relax.',
    'Let\'s see {player} do it against REAL opposition 😒',
    'Lol @ people acting like {player} is special. Any day now.',
    '{player} is soft. Watch when the pressure is actually on.',
  ]},
];

// ---- Analyst Takes Pool ----
export const ANALYST_TAKES = [
  'Technical assessment: explosive ceiling, inconsistency concerns. Worth watching.',
  'The numbers are building. Early signals of generational talent.',
  'High variance performer — either zeros or hundreds. A coach\'s nightmare, a fan\'s dream.',
  'Rarely do we see this combination of power and footwork in a debut season.',
  'Reminds me of early Dhoni — raw, unpolished, but something magnetic about the game.',
  'The mental game is the question mark. Physical attributes? Elite.',
  'Analytics suggest {player} performs 23% better under high pressure. Unusual. Very unusual.',
  'Career trajectory modeling puts this at top-10 potential within 2 seasons.',
];

// ---- Breaking News Templates ----
export const BREAKING_NEWS = [
  'BREAKING: {player} refused pre-match interview, fueling rivalry speculation 👀',
  'EXCLUSIVE: Sources say national selectors were watching {player} today 📡',
  '🔴 LIVE: Social media MELTING DOWN after {player}\'s performance',
  'REPORT: {player}\'s agent confirms "multiple sponsor conversations" in progress',
  'DEVELOPING: Rival camp reportedly "frustrated" by {player}\'s rise',
  'VIRAL: {player}\'s celebration footage hitting 10M views and climbing',
  'EXCLUSIVE: Unnamed teammate calls {player} "the most talented player I\'ve seen"',
];

// ---- Milestone Titles ----
export const MILESTONE_TITLES = [
  { minLevel: 1, title: 'Rookie Sensation' },
  { minLevel: 3, title: 'Rising Star' },
  { minLevel: 5, title: 'The Phenomenon' },
  { minLevel: 7, title: 'National Buzz' },
  { minLevel: 9, title: 'Icon in the Making' },
  { minLevel: 12, title: 'Legend Candidate' },
  { minLevel: 15, title: 'GOAT Contender' },
];
