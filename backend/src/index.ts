// ============================================================
// ATHLETE//ZERO — Server Entry Point
// ============================================================

import app from './app';
import { config } from './config/index';
import { isGeminiConfigured } from './services/gemini.service';

const PORT = config.port;

app.listen(PORT, () => {
  console.log('\n');
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║          A T H L E T E // Z E R O               ║');
  console.log('║      AI-Powered Cricket Career Simulator         ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log(`\n🏏 Server running on http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`🤖 Gemini AI: ${isGeminiConfigured() ? '✅ CONNECTED' : '⚠️  NOT CONFIGURED — Using mock data'}`);
  console.log('\n📡 Available endpoints:');
  console.log('   GET  /health');
  console.log('   POST /api/create-player');
  console.log('   GET  /api/player');
  console.log('   POST /api/start-match');
  console.log('   GET  /api/match-events');
  console.log('   GET  /api/commentary');
  console.log('   GET  /api/social-feed');
  console.log('   GET  /api/fan-reactions');
  console.log('   GET  /api/rival');
  console.log('   POST /api/rival-response');
  console.log('   POST /api/generate-story');
  console.log('   POST /api/generate-commentary');
  console.log('   POST /api/generate-headlines');
  console.log('   POST /api/generate-pre-match');
  console.log('\n🎬 The drama begins...\n');
});

process.on('unhandledRejection', (reason) => {
  console.error('[UNHANDLED REJECTION]', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT EXCEPTION]', err.message);
  process.exit(1);
});
