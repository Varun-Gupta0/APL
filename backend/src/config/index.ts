import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  isDev: process.env.NODE_ENV !== 'production',
};

// Gemini model to use
export const GEMINI_MODEL = 'gemini-1.5-flash';

// XP thresholds per level
export const XP_PER_LEVEL = [0, 100, 250, 500, 900, 1500, 2300, 3300, 4600, 6200, 10000];

// Venues for match simulation
export const VENUES = [
  'Wankhede Stadium, Mumbai',
  'Eden Gardens, Kolkata',
  'M. Chinnaswamy Stadium, Bangalore',
  'Narendra Modi Stadium, Ahmedabad',
  'MA Chidambaram Stadium, Chennai',
  'Rajiv Gandhi Int. Cricket Stadium, Hyderabad',
  'Sawai Mansingh Stadium, Jaipur',
  'PCA Stadium, Mohali',
];

// Opponent team names
export const OPPONENT_TEAMS = [
  'Delhi Destroyers',
  'Mumbai Mavericks',
  'Bangalore Blazers',
  'Chennai Champions',
  'Kolkata Knights',
  'Punjab Panthers',
  'Rajasthan Royals XI',
  'Hyderabad Hurricanes',
];
