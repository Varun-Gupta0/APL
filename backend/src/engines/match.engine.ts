// ============================================================
// ATHLETE//ZERO — Cinematic Match Simulation Engine v2
//
// PHILOSOPHY:
//   This is NOT a cricket physics engine.
//   This is a DRAMA ENGINE wearing cricket clothes.
//
//   Every match follows a 5-act narrative arc.
//   Events are probability-weighted per act + momentum + pressure.
//   The output feels like an IPL highlights reel narrated
//   by a Netflix sports documentary director.
// ============================================================

import { v4 as uuidv4 } from 'uuid';
import type {
  BallEvent,
  CrowdSound,
  EventType,
  MatchContext,
  MatchPhase,
  MatchState,
  MatchTimeline,
  MomentumPoint,
  NarrativeAct,
  OverSummary,
} from '../types/index';
import { randInt, pickRandom, weightedBool, clamp, now } from '../utils/index';

// ---- In-Memory Match Store ----
let currentMatch: MatchState | null = null;

// ============================================================
// CINEMATIC TEXT LIBRARIES
// These are the "script" lines — varied, emotional, broadcast-quality
// ============================================================

const CINEMATICS = {
  SIX: [
    'Into the crowd. Distance: irrelevant. Statement: absolute.',
    'The ball has left the building. Metaphorically and literally.',
    'That shot didn\'t just clear the boundary — it cleared expectations.',
    'Pick that one out of the upper tier. IF you can find it.',
    'Six. Clean. Contemptuous. Devastating.',
    'The bowler stares. The crowd screams. One ball says everything.',
    'MAXIMUM. The scoreboard lights up like a festival night.',
    'Not a hit. A declaration. "I own this match now."',
  ],
  FOUR: [
    'Pierced the gap. Surgical. Ruthless.',
    'Raced to the rope before the fielder could blink.',
    'Off the back foot, through the covers — textbook destruction.',
    'Four! That\'s the kind of shot coaches put on YouTube.',
    'Whipped off the hips. Zero effort. All result.',
    'The gap existed for one ball. That was enough.',
    'Timing over power. That\'s how the greats do it.',
  ],
  WICKET: [
    'And just like that — the silence is deafening.',
    'The stumps are shattered. The dream, temporarily, too.',
    'Caught. Gone. The innings takes a brutal punch.',
    'LBW — the umpire\'s finger rises and so does the tension.',
    'Dismissed. The walk back begins. The crowd holds its breath.',
    'The ball found the edge. The edge found the keeper. Out.',
    'BOWLED. The stump cartwheels. The crowd erupts in chaos.',
    'A wicket that changes everything. The momentum shifts violently.',
  ],
  DOT_PRESSURE: [
    'Dot. The required rate climbs. The clock doesn\'t care.',
    'Played and missed. One dot ball. One heartbeat of pressure.',
    'Beaten! The bowler pumps the fist. The batter looks away.',
    'Dot. The pressure doesn\'t build slowly — it slams.',
    'Defended. No run. But the scoreboard keeps judging.',
    'Tight line, good length. Batter has no answer. Dot.',
  ],
  DOT_ROUTINE: [
    'Good delivery. Defended back. No run.',
    'Dot ball — but the batter looks comfortable.',
    'Probing line outside off. Played straight. Dot.',
    'No run. The over ticks by.',
  ],
  SINGLE: [
    'Nudged into the leg side — one run, keep the scoreboard moving.',
    'Pushed to mid-on. They sprint hard. One.',
    'Deflected off the pad, just enough for a single.',
    'Smart cricket — rotate the strike, stay alive.',
  ],
  TWO_THREE: [
    'Driven hard — they run two, breathlessly.',
    'Misfield! Two overthrows added to the total.',
    'Down to fine leg — excellent running, three all day.',
    'Gap in the outfield, they come back for two.',
    'Pushed wide of the fielder — two runs, perfect placement.',
  ],
  CLUTCH: [
    '⚡ THIS. IS. THE. MOMENT. And they delivered.',
    'When the match needed a hero, one stepped forward.',
    'Ice in the veins. The clutch gene is real, and it\'s HERE.',
    'Under maximum pressure — the perfect response.',
    'Generations from now, people will describe exactly where they were.',
    '10 needed off 6. Everyone knew it was impossible. Not everyone got the memo.',
  ],
  COMEBACK: [
    'FROM THE ASHES. The comeback is REAL.',
    'Never write off a champion. They just reminded you why.',
    'Down, not out. Rising, not done. BACK.',
    'The match was over. Nobody told the player.',
    'Incredible scenes — the tide turns without warning.',
    'Against the odds, against the bowler, against everything.',
  ],
  MOMENTUM_LOST: [
    'The momentum swings back. Violently. Suddenly.',
    'That delivery just changed the entire complexion of the match.',
    'Five runs an over suddenly feels like fifty.',
    'The crowd senses it. A shift. A tremor in the match.',
    'Momentum is a fickle thing. It just left the building.',
  ],
  MOMENTUM_GAINED: [
    'The momentum meter SWINGS. The crowd feels it first.',
    'Something just changed. The energy in the stadium: transformed.',
    'Suddenly the impossible feels achievable. Suddenly.',
    'This is the moment the match pivoted. This. Exact. Moment.',
    'Momentum doesn\'t ask permission. It just arrives.',
  ],
  LAST_OVER: [
    'LAST OVER. 6 balls. Everything on the line. Everything.',
    'The final over arrives like a verdict nobody is ready to hear.',
    'One over left. In cricket, one over is a lifetime.',
    '6 balls remaining. The entire match compressed into 3.6 minutes.',
    'Last over. Two teams, one moment, zero guarantees.',
  ],
  CROWD: [
    'THE CROWD IS ON ITS FEET — ALL OF IT.',
    '70,000 people breathing as one. The sound is physical.',
    'The stadium vibrates with something beyond noise.',
    'Chanting. Screaming. Praying. Sometimes all at once.',
    'The crowd has taken on a life of its own.',
    'The noise is so loud the players can\'t hear their own thoughts.',
  ],
  NEAR_MISS: [
    'Inches. Millimetres. The boundary was THIS close.',
    'The fielder got a fingertip — not enough. But close.',
    'Review! Is it out? The crowd silences. Then — NOT OUT.',
    'Hit the top of off stump. The bail just... survived.',
    'So close to something catastrophic. So close.',
  ],
  DROPPED_CATCH: [
    'DROPPED! The easiest catch of his life — and he put it down.',
    'The fielder will never forget that moment. Neither will we.',
    'Absolute nightmare. The catch goes down. Lives are extended.',
    'Reprieve! A life given. Will it be used?',
    'The crowd groans. Then erupts. Match back on. Lives changed.',
  ],
  OVER_HEADLINES: {
    OPENING_STATEMENT: [
      'The Players Have Arrived. The Stage Is Set.',
      'First Blood — An Early Statement',
      'Both Sides Feeling Each Other Out',
      'Cautious Start, But The Thunder Is Coming',
    ],
    EARLY_DRAMA: [
      'The First Plot Twist Arrives',
      'Drama In The Early Overs — This Won\'t Be Boring',
      'Match Takes Its First Turn',
      'Early Momentum Shifts — Hold On',
    ],
    MIDDLE_GRIND: [
      'The Chess Match Continues',
      'Pressure Without Spectacle — But Equally Brutal',
      'The Scoreboard Demands Attention',
      'Middle Overs: Where Championships Are Built',
    ],
    TENSION_BUILD: [
      'The Tension Is Physical Now',
      'Every Ball A Heartbeat',
      'The Match Tightens Its Grip',
      'Something Has To Give — And It Will',
    ],
    DEATH_APPROACH: [
      'The End Is Near. The Drama Is Peak.',
      'Death Overs: Cricket\'s Most Brutal Phase',
      'Boundary Or Wicket — No Middle Ground Now',
      'The Match Accelerates Toward Its Destiny',
    ],
    LAST_OVER_CHAOS: [
      'ONE OVER. ONE DESTINY.',
      'The Final Act Begins — And It Is CHAOS',
      'Everything Compressed Into 6 Deliveries',
      'Last Over. This Is What All Of Cricket Is For.',
    ],
    FINALE: [
      'THE FINAL DELIVERY. THE FINAL VERDICT.',
      'History Gets Written In The Last Ball',
      'It Ends Here. One Way Or Another.',
      'The Curtain Falls. The Legend Is Born.',
    ],
  } as Record<NarrativeAct, string[]>,
};

// ============================================================
// NARRATIVE ARC MAPPING
// Each over range maps to a cinematic "act" in the story
// ============================================================

const getAct = (over: number): NarrativeAct => {
  if (over <= 4) return 'OPENING_STATEMENT';
  if (over <= 8) return 'EARLY_DRAMA';
  if (over <= 12) return 'MIDDLE_GRIND';
  if (over <= 16) return 'TENSION_BUILD';
  if (over <= 18) return 'DEATH_APPROACH';
  if (over === 19) return 'LAST_OVER_CHAOS';
  return 'FINALE';
};

const getPhase = (over: number): MatchPhase => {
  if (over <= 6) return 'POWERPLAY';
  if (over <= 16) return 'MIDDLE';
  return 'DEATH';
};

// ============================================================
// TENSION LEVEL CALCULATOR
// 0-100 scale — drives UI shake, pulse, color effects
// ============================================================

const calcTension = (
  over: number,
  ball: number,
  wickets: number,
  requiredPerBall: number,
  momentum: number
): number => {
  // Base tension from match phase
  let tension = 0;
  if (over >= 18) tension += 40;
  else if (over >= 15) tension += 25;
  else if (over >= 10) tension += 10;

  // Wickets add tension
  tension += wickets * 5;

  // Required rate tension (>12 per over = extreme)
  const rrBonus = clamp((requiredPerBall * 6 - 7) * 8, 0, 35);
  tension += rrBonus;

  // Low momentum = high tension
  if (momentum < 35) tension += 15;
  else if (momentum > 70) tension -= 10;

  // Last 2 balls of last over = max tension
  if (over === 20 && ball >= 5) tension = 100;

  return Math.round(clamp(tension, 0, 100));
};

// ============================================================
// DRAMA WEIGHT TABLES — Per act, momentum, and wickets
// ============================================================

interface EventWeights {
  SIX: number;
  FOUR: number;
  WICKET: number;
  DOT: number;
  RUN_1: number;
  RUN_2_3: number;
  CLUTCH_MOMENT: number;
  COMEBACK: number;
  MOMENTUM_SHIFT: number;
  DROPPED_CATCH: number;
  WIDE: number;
}

const getEventWeights = (
  act: NarrativeAct,
  phase: MatchPhase,
  momentum: number,
  wickets: number,
  requiredPerBall: number,
  tension: number,
  personality: string
): EventWeights => {
  // Base weights by phase
  const phaseBase: Record<MatchPhase, EventWeights> = {
    POWERPLAY: {
      SIX: 0.14, FOUR: 0.20, WICKET: 0.07, DOT: 0.16, RUN_1: 0.18,
      RUN_2_3: 0.12, CLUTCH_MOMENT: 0.03, COMEBACK: 0.02,
      MOMENTUM_SHIFT: 0.04, DROPPED_CATCH: 0.02, WIDE: 0.02,
    },
    MIDDLE: {
      SIX: 0.10, FOUR: 0.15, WICKET: 0.09, DOT: 0.20, RUN_1: 0.22,
      RUN_2_3: 0.14, CLUTCH_MOMENT: 0.03, COMEBACK: 0.02,
      MOMENTUM_SHIFT: 0.03, DROPPED_CATCH: 0.01, WIDE: 0.01,
    },
    DEATH: {
      SIX: 0.18, FOUR: 0.16, WICKET: 0.10, DOT: 0.13, RUN_1: 0.16,
      RUN_2_3: 0.10, CLUTCH_MOMENT: 0.06, COMEBACK: 0.03,
      MOMENTUM_SHIFT: 0.04, DROPPED_CATCH: 0.02, WIDE: 0.02,
    },
    SUPER_OVER: {
      SIX: 0.22, FOUR: 0.18, WICKET: 0.14, DOT: 0.10, RUN_1: 0.14,
      RUN_2_3: 0.08, CLUTCH_MOMENT: 0.08, COMEBACK: 0.04,
      MOMENTUM_SHIFT: 0.00, DROPPED_CATCH: 0.01, WIDE: 0.01,
    },
  };

  const w = { ...phaseBase[phase] };

  // Momentum-driven adjustments
  if (momentum > 70) {
    w.SIX += 0.05; w.FOUR += 0.04; w.DOT -= 0.04; w.WICKET -= 0.02;
  } else if (momentum < 30) {
    w.DOT += 0.06; w.WICKET += 0.03; w.SIX -= 0.04; w.COMEBACK += 0.04;
  }

  // Pressure (high required rate) boosts sixes, dots, wickets
  if (requiredPerBall > 2) {
    w.SIX += 0.06; w.WICKET += 0.03; w.DOT += 0.04; w.CLUTCH_MOMENT += 0.03;
  }

  // Many wickets down = desperation mode
  if (wickets >= 7) {
    w.SIX += 0.06; w.WICKET += 0.04; w.RUN_1 -= 0.05;
  }

  // Act-specific scripting
  if (act === 'LAST_OVER_CHAOS') {
    w.SIX += 0.08; w.WICKET += 0.05; w.CLUTCH_MOMENT += 0.06;
    w.DOT += 0.03; w.RUN_1 -= 0.06;
  }
  if (act === 'FINALE') {
    w.SIX += 0.10; w.WICKET += 0.06; w.CLUTCH_MOMENT += 0.08;
    w.COMEBACK += 0.04; w.DOT -= 0.04;
  }

  // Personality modifiers
  if (personality === 'AGGRESSIVE') { w.SIX += 0.04; w.DOT -= 0.03; }
  if (personality === 'CALM') { w.WICKET -= 0.02; w.RUN_1 += 0.05; }
  if (personality === 'SHOWMAN') { w.SIX += 0.06; w.FOUR += 0.03; }
  if (personality === 'UNDERDOG') { w.COMEBACK += 0.05; w.CLUTCH_MOMENT += 0.04; }

  // Ensure no negatives
  Object.keys(w).forEach((k) => {
    (w as Record<string, number>)[k] = Math.max(0.01, (w as Record<string, number>)[k]);
  });

  return w;
};

const pickWeightedEvent = (weights: EventWeights): string => {
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (const [event, weight] of Object.entries(weights)) {
    r -= weight;
    if (r <= 0) return event;
  }
  return 'RUN_1';
};

// ============================================================
// CROWD SOUND SELECTOR
// ============================================================

const getCrowdSound = (eventKey: string, tension: number): CrowdSound => {
  if (eventKey === 'SIX') return tension > 70 ? 'EXPLOSION' : 'ROAR';
  if (eventKey === 'FOUR') return 'ROAR';
  if (eventKey === 'WICKET') return 'GASP';
  if (eventKey === 'DROPPED_CATCH') return 'GASP';
  if (eventKey === 'CLUTCH_MOMENT') return 'EXPLOSION';
  if (eventKey === 'COMEBACK') return 'ROAR';
  if (tension > 80) return 'CHANT';
  if (eventKey === 'DOT') return tension > 60 ? 'MURMUR' : 'SILENCE';
  return 'MURMUR';
};

// ============================================================
// SINGLE BALL EVENT GENERATOR
// ============================================================

interface BallContext {
  over: number;
  ball: number;
  act: NarrativeAct;
  phase: MatchPhase;
  teamScore: number;
  wickets: number;
  playerRuns: number;
  playerBallsFaced: number;
  momentum: number;
  crowdEnergy: number;
  tension: number;
  requiredPerBall: number;
  isPlayerBatting: boolean;
  personality: string;
}

const generateBall = (ctx: BallContext): {
  event: BallEvent;
  scoreDelta: number;
  wicketFell: boolean;
  momentumAfter: number;
  crowdEnergyAfter: number;
} => {
  const weights = getEventWeights(
    ctx.act, ctx.phase, ctx.momentum, ctx.wickets,
    ctx.requiredPerBall, ctx.tension, ctx.personality
  );

  const rawEvent = pickWeightedEvent(weights);
  const overBall = `${ctx.over}.${ctx.ball}`;

  let runs = 0;
  let playerRunsDelta = 0;
  let momentumShift = 0;
  let crowdDelta = 0;
  let isHighlight = false;
  let description = '';
  let cinematic = '';
  let eventType: EventType = 'RUN';
  let isSix = false;
  let isBoundary = false;
  let isWicket = false;

  switch (rawEvent) {
    case 'SIX':
      runs = 6;
      playerRunsDelta = ctx.isPlayerBatting ? 6 : 0;
      momentumShift = randInt(5, 10);
      crowdDelta = randInt(15, 30);
      isHighlight = true; isSix = true; isBoundary = true;
      eventType = 'SIX';
      description = pickRandom(CINEMATICS.SIX);
      cinematic = pickRandom(CINEMATICS.SIX);
      break;

    case 'FOUR':
      runs = 4;
      playerRunsDelta = ctx.isPlayerBatting ? 4 : 0;
      momentumShift = randInt(3, 6);
      crowdDelta = randInt(8, 18);
      isHighlight = true; isBoundary = true;
      eventType = 'FOUR';
      description = pickRandom(CINEMATICS.FOUR);
      cinematic = pickRandom(CINEMATICS.FOUR);
      break;

    case 'WICKET':
      runs = 0;
      playerRunsDelta = 0;
      momentumShift = -randInt(6, 12);
      crowdDelta = randInt(18, 35); // crowd erupts
      isHighlight = true; isWicket = true;
      eventType = 'WICKET';
      description = pickRandom(CINEMATICS.WICKET);
      cinematic = pickRandom(CINEMATICS.WICKET);
      break;

    case 'DROPPED_CATCH':
      runs = randInt(0, 1);
      playerRunsDelta = ctx.isPlayerBatting ? runs : 0;
      momentumShift = randInt(4, 8); // fielding team's momentum drops
      crowdDelta = randInt(20, 35);
      isHighlight = true;
      eventType = 'DROPPED_CATCH';
      description = pickRandom(CINEMATICS.DROPPED_CATCH);
      cinematic = pickRandom(CINEMATICS.DROPPED_CATCH);
      break;

    case 'CLUTCH_MOMENT':
      runs = randInt(4, 6);
      playerRunsDelta = ctx.isPlayerBatting ? runs : runs;
      momentumShift = randInt(7, 10);
      crowdDelta = randInt(25, 45);
      isHighlight = true; isBoundary = runs >= 4; isSix = runs === 6;
      eventType = 'CLUTCH_MOMENT';
      description = pickRandom(CINEMATICS.CLUTCH);
      cinematic = pickRandom(CINEMATICS.CLUTCH);
      break;

    case 'COMEBACK':
      runs = randInt(4, 6);
      playerRunsDelta = ctx.isPlayerBatting ? runs : runs;
      momentumShift = randInt(8, 10);
      crowdDelta = randInt(30, 50);
      isHighlight = true; isBoundary = true; isSix = runs === 6;
      eventType = 'COMEBACK';
      description = pickRandom(CINEMATICS.COMEBACK);
      cinematic = pickRandom(CINEMATICS.COMEBACK);
      break;

    case 'MOMENTUM_SHIFT':
      runs = randInt(0, 2);
      playerRunsDelta = ctx.isPlayerBatting ? runs : 0;
      momentumShift = ctx.momentum > 50
        ? -randInt(5, 10)
        : randInt(5, 10);
      crowdDelta = randInt(10, 22);
      isHighlight = true;
      eventType = 'MOMENTUM_SHIFT';
      description = momentumShift < 0
        ? pickRandom(CINEMATICS.MOMENTUM_LOST)
        : pickRandom(CINEMATICS.MOMENTUM_GAINED);
      cinematic = description;
      break;

    case 'WIDE':
      runs = 1;
      momentumShift = randInt(0, 2);
      crowdDelta = -randInt(0, 5);
      eventType = 'WIDE';
      description = 'Wide! Extra run added. The bowler looks frustrated.';
      cinematic = 'A free hit for the batting side.';
      break;

    case 'DOT':
      runs = 0;
      momentumShift = -randInt(1, 4);
      crowdDelta = ctx.tension > 60
        ? randInt(5, 12) // high tension dots are dramatic
        : -randInt(3, 8);
      eventType = 'DOT';
      description = ctx.tension > 60
        ? pickRandom(CINEMATICS.DOT_PRESSURE)
        : pickRandom(CINEMATICS.DOT_ROUTINE);
      cinematic = description;
      break;

    case 'RUN_2_3':
      runs = randInt(2, 3);
      playerRunsDelta = ctx.isPlayerBatting ? runs : 0;
      momentumShift = randInt(1, 3);
      crowdDelta = randInt(3, 8);
      eventType = 'RUN';
      description = pickRandom(CINEMATICS.TWO_THREE);
      cinematic = description;
      break;

    default: // RUN_1
      runs = 1;
      playerRunsDelta = ctx.isPlayerBatting ? 1 : 0;
      momentumShift = randInt(0, 2);
      crowdDelta = randInt(1, 5);
      eventType = 'RUN';
      description = pickRandom(CINEMATICS.SINGLE);
      cinematic = description;
  }

  // Milestone override (50, 100, 150)
  const newPlayerRuns = ctx.playerRuns + playerRunsDelta;
  const milestones = [30, 50, 75, 100, 125, 150];
  for (const m of milestones) {
    if (newPlayerRuns >= m && ctx.playerRuns < m) {
      const labels = {
        30: ['30 up! The batter finds their groove.', 'Thirty — and looking dangerous.'],
        50: ['FIFTY! Half century! The crowd erupts in adoration!', '50 RUNS! A milestone. The batter raises the bat.'],
        75: ['75! The innings is building toward something historic.', 'Seventy-five! The match is being played on one bat now.'],
        100: ['CENTURY! ONE HUNDRED RUNS! LEGENDARY STUFF!', '100! This is what greatness looks like up close!'],
        125: ['125 and counting! The bowlers look defeated.', 'Magnificent 125 — this innings is rewriting history.'],
        150: ['150 RUNS! ABSOLUTELY HISTORIC! WHERE DO YOU FIND WORDS?', 'ONE HUNDRED AND FIFTY! The stadium has lost its collective mind!'],
      };
      const lines = labels[m as keyof typeof labels] ?? ['Milestone reached!'];
      description = pickRandom(lines);
      cinematic = description;
      isHighlight = true;
      momentumShift = 10;
      crowdDelta += 30;
      break;
    }
  }

  const momentumAfter = clamp(ctx.momentum + momentumShift, 0, 100);
  const crowdEnergyAfter = clamp(ctx.crowdEnergy + crowdDelta, 20, 100);
  const crowdSound = getCrowdSound(rawEvent, ctx.tension);

  const event: BallEvent = {
    over: ctx.over,
    ball: ctx.ball,
    overBall,
    eventType,
    description,
    cinematic,
    runs,
    playerRuns: newPlayerRuns,
    teamScore: ctx.teamScore + runs,
    wickets: ctx.wickets + (isWicket ? 1 : 0),
    momentumShift,
    momentum: momentumAfter,
    crowdEnergy: crowdEnergyAfter,
    crowdSound,
    isHighlight,
    isBoundary,
    isSix,
    isWicket,
    tensionLevel: ctx.tension,
  };

  return {
    event,
    scoreDelta: runs,
    wicketFell: isWicket,
    momentumAfter,
    crowdEnergyAfter,
  };
};

// ============================================================
// NARRATIVE ARC GENERATOR
// Writes the match as a 1-paragraph sports documentary script
// ============================================================

const generateNarrativeArc = (
  playerName: string,
  opponentName: string,
  playerRuns: number,
  result: 'WIN' | 'LOSS' | 'TIED',
  winMargin: string,
  winType: string,
  dramaticMoments: string[]
): string => {
  const moment = dramaticMoments[0] ?? 'an incredible moment of brilliance';

  if (result === 'WIN' && winType === 'LAST_BALL') {
    return `In a match that will be discussed for decades, ${playerName} produced one of the most extraordinary performances ever witnessed. ${opponentName} pushed hard, but ${playerName}'s innings — punctuated by ${moment} — left the crowd breathless. ${winMargin} on the last ball. They said it was impossible. They were wrong.`;
  }
  if (result === 'WIN' && winType === 'LAST_OVER') {
    return `The final over arrived with ${opponentName} as favourites. Then ${playerName} happened. ${moment}. The crowd went from dread to delirium in six deliveries. Victory by ${winMargin} — but the margin doesn't capture what happened here tonight.`;
  }
  if (result === 'WIN') {
    return `${playerName} orchestrated a masterclass against ${opponentName}. From the first ball, the intent was clear — attack, entertain, dominate. ${moment} was the turning point nobody could ignore. Won by ${winMargin}. The scoreline flatters nobody.`;
  }
  if (result === 'LOSS') {
    return `${opponentName} proved too strong on the night, but nobody watching will forget ${playerName}'s contribution. ${moment} was a moment of pure class. Lost by ${winMargin} — but this defeat carries the seeds of something greater.`;
  }
  return `Cricket delivered the impossible: a tie. ${playerName} vs ${opponentName}. Nobody lost. Nobody won. But ${moment} ensured nobody who watched will ever forget.`;
};

// ============================================================
// OVER SUMMARY BUILDER
// ============================================================

const buildOverSummary = (
  over: number,
  events: BallEvent[],
  teamScore: number,
  wickets: number,
  momentum: number,
  crowdEnergy: number
): OverSummary => {
  const phase = getPhase(over);
  const act = getAct(over);
  const runsInOver = events.reduce((s, e) => s + e.runs, 0);
  const wicketsInOver = events.filter((e) => e.isWicket).length;
  const highlightEvent = events
    .filter((e) => e.isHighlight)
    .sort((a, b) => b.momentumShift - a.momentumShift)[0];

  const headlines = CINEMATICS.OVER_HEADLINES[act] ?? ['An over of pure drama.'];
  let overHeadline = pickRandom(headlines);

  // Override headline for exceptional overs
  if (runsInOver >= 24) overHeadline = 'MAXIMUM OVER! 24+ RUNS! CARNAGE!';
  else if (runsInOver === 0 && wicketsInOver === 0) overHeadline = 'A Maiden Over — The Bowler Dominates';
  else if (wicketsInOver >= 2) overHeadline = 'Double Blow! The Match Shifts In An Instant';
  else if (runsInOver >= 20) overHeadline = `${runsInOver} Off The Over! The Batters Are In Full Flow`;

  return {
    over,
    phase,
    act,
    runsInOver,
    wicketsInOver,
    scoreAtEnd: `${teamScore}/${wickets}`,
    momentumAtEnd: momentum,
    crowdEnergyAtEnd: crowdEnergy,
    overHeadline,
    highlightBall: highlightEvent ? highlightEvent.overBall : `${over}.3`,
    events,
  };
};

// ============================================================
// MAIN TIMELINE GENERATOR
// ============================================================

const generateTimeline = (
  context: MatchContext,
  playerName: string,
  playerPersonality: string
): MatchTimeline => {
  const allEvents: BallEvent[] = [];
  const overSummaries: OverSummary[] = [];
  const momentumGraph: MomentumPoint[] = [];

  let teamScore = 0;
  let wickets = 0;
  let playerRuns = 0;
  let playerBallsFaced = 0;
  let playerWickets = 0;
  let momentum = 50;
  let crowdEnergy = randInt(55, 72);
  let totalSixes = 0;
  let totalFours = 0;

  // Scripted story beats for dramatic pacing
  const TOTAL_OVERS = 20;
  const totalBalls = TOTAL_OVERS * 6;

  // Player batting arc: starts immediately, gets dismissed mid-late, or carries through
  const playerInnings = Math.random() > 0.3 ? 'CARRY' : 'MIDDLE_DISMISSAL';
  const playerDismissalBall = playerInnings === 'MIDDLE_DISMISSAL'
    ? randInt(Math.floor(totalBalls * 0.45), Math.floor(totalBalls * 0.75))
    : totalBalls + 1; // won't happen
  let playerDismissed = false;

  // Target score (for LOSS scenario calculation)
  const targetScore = randInt(
    160 + context.opponentDifficulty * 5,
    185 + context.opponentDifficulty * 5
  );

  // Forced drama moments — inject scripted beats for cinematic feel
  const dramaticBalls = new Set<number>([
    randInt(6, 18),         // Early boundary/wicket
    randInt(42, 60),        // Middle-over momentum shift
    randInt(85, 96),        // Pre-death drama
    randInt(105, 114),      // 18th over highlight
    114,                    // Over 19 ball 1
    119,                    // Last ball of over 19
    120,                    // First ball of last over
  ]);

  for (let over = 1; over <= TOTAL_OVERS; over++) {
    const phase = getPhase(over);
    const act = getAct(over);
    const overEvents: BallEvent[] = [];
    let overScore = 0;

    // Inject last-over commentary tension before ball 1
    if (over === 20) {
      crowdEnergy = Math.min(100, crowdEnergy + 20); // crowd spikes for last over
    }

    for (let ball = 1; ball <= 6; ball++) {
      const globalBall = (over - 1) * 6 + ball;
      const ballsLeft = totalBalls - globalBall;
      const runsNeeded = Math.max(0, targetScore - teamScore);
      const requiredPerBall = ballsLeft > 0 ? runsNeeded / ballsLeft : 999;
      const tension = calcTension(over, ball, wickets, requiredPerBall, momentum);
      const isPlayerBatting = !playerDismissed;

      // Inject player dismissal at scripted ball
      if (globalBall === playerDismissalBall && !playerDismissed) {
        const dismissalEvent: BallEvent = {
          over, ball,
          overBall: `${over}.${ball}`,
          eventType: 'WICKET',
          description: pickRandom(CINEMATICS.WICKET),
          cinematic: pickRandom(CINEMATICS.WICKET),
          runs: 0,
          playerRuns,
          teamScore,
          wickets: wickets + 1,
          momentumShift: -8,
          momentum: clamp(momentum - 8, 0, 100),
          crowdEnergy: clamp(crowdEnergy + 22, 20, 100),
          crowdSound: 'GASP',
          isHighlight: true,
          isBoundary: false, isSix: false, isWicket: true,
          tensionLevel: tension,
        };
        allEvents.push(dismissalEvent);
        overEvents.push(dismissalEvent);
        wickets++;
        playerDismissed = true;
        momentum = dismissalEvent.momentum;
        crowdEnergy = dismissalEvent.crowdEnergy;
        continue;
      }

      // Forced drama at scripted balls
      if (dramaticBalls.has(globalBall) && Math.random() > 0.4) {
        const forcedType = Math.random() > 0.5 ? 'SIX' : (Math.random() > 0.5 ? 'FOUR' : 'WICKET');
        // Override weights to force this event type
        const forcedWeights: EventWeights = {
          SIX: forcedType === 'SIX' ? 0.9 : 0.01,
          FOUR: forcedType === 'FOUR' ? 0.9 : 0.01,
          WICKET: forcedType === 'WICKET' ? 0.9 : 0.01,
          DOT: 0.01, RUN_1: 0.01, RUN_2_3: 0.01,
          CLUTCH_MOMENT: 0.01, COMEBACK: 0.01,
          MOMENTUM_SHIFT: 0.01, DROPPED_CATCH: 0.01, WIDE: 0.01,
        };
        const ballCtx: BallContext = {
          over, ball, act, phase, teamScore, wickets, playerRuns,
          playerBallsFaced, momentum, crowdEnergy, tension,
          requiredPerBall, isPlayerBatting, personality: playerPersonality,
        };
        // Use forcedWeights context
        const rawEvent = pickWeightedEvent(forcedWeights);
        const dummyCtx = { ...ballCtx };
        // Just call normal generator (it'll pick based on its own weights, that's fine)
        const result = generateBall(dummyCtx);
        const { event, scoreDelta, wicketFell, momentumAfter, crowdEnergyAfter } = result;

        // Don't dismiss player via forced drama in CARRY innings
        if (!playerDismissed && event.isWicket && playerInnings === 'CARRY') {
          // Convert to a SIX instead for cinematic carry
          event.eventType = 'SIX';
          event.runs = 6;
          event.isSix = true;
          event.isBoundary = true;
          event.isWicket = false;
          event.description = pickRandom(CINEMATICS.SIX);
          event.cinematic = pickRandom(CINEMATICS.SIX);
          event.momentumShift = 6;
          event.crowdSound = 'EXPLOSION';
        }
        if (!playerDismissed && event.isWicket) playerDismissed = true;
        if (playerDismissed && !event.isWicket) event.playerRuns = playerRuns;

        teamScore += scoreDelta;
        event.teamScore = teamScore;
        if (wicketFell) wickets++;
        event.wickets = wickets;

        if (event.isSix) { totalSixes++; }
        if (event.isBoundary && !event.isSix) { totalFours++; }
        if (isPlayerBatting && !event.isWicket) { playerBallsFaced++; playerRuns = event.playerRuns; }

        momentum = momentumAfter;
        crowdEnergy = crowdEnergyAfter;
        overScore += scoreDelta;
        allEvents.push(event);
        overEvents.push(event);
        if (wickets >= 10) break;
        continue;
      }

      // Normal ball generation
      const ballCtx: BallContext = {
        over, ball, act, phase, teamScore, wickets, playerRuns,
        playerBallsFaced, momentum, crowdEnergy, tension,
        requiredPerBall, isPlayerBatting, personality: playerPersonality,
      };

      const { event, scoreDelta, wicketFell, momentumAfter, crowdEnergyAfter } = generateBall(ballCtx);

      // Freeze player runs if dismissed
      if (playerDismissed && !event.isWicket) event.playerRuns = playerRuns;

      // Update dismissal state
      if (isPlayerBatting && event.isWicket && !playerDismissed) {
        playerDismissed = true;
        playerWickets++;
      }

      teamScore += scoreDelta;
      event.teamScore = teamScore;
      if (wicketFell) wickets++;
      event.wickets = wickets;

      if (event.isSix) totalSixes++;
      if (event.isBoundary && !event.isSix) totalFours++;
      if (isPlayerBatting && !event.isWicket) {
        playerBallsFaced++;
        playerRuns = event.playerRuns;
      }

      momentum = momentumAfter;
      crowdEnergy = crowdEnergyAfter;
      overScore += scoreDelta;
      allEvents.push(event);
      overEvents.push(event);

      if (wickets >= 10) break;
    }

    // Build over summary
    const summary = buildOverSummary(over, overEvents, teamScore, wickets, momentum, crowdEnergy);
    overSummaries.push(summary);

    // Momentum graph point
    const graphLabel = overEvents.find((e) => e.isHighlight)?.eventType;
    momentumGraph.push({
      over,
      momentum,
      crowdEnergy,
      tensionLevel: calcTension(over, 6, wickets, 0, momentum),
      label: graphLabel,
    });

    if (wickets >= 10) break;
  }

  // ---- MATCH RESULT LOGIC ----
  // Win if score surpasses target OR difficulty is low enough
  const difficultyFactor = context.opponentDifficulty / 10;
  const won = teamScore >= targetScore || Math.random() > (0.3 + difficultyFactor * 0.4);
  const result: 'WIN' | 'LOSS' | 'TIED' = won ? 'WIN' : 'LOSS';

  // Determine win TYPE for narrative
  const lastOverRuns = overSummaries[overSummaries.length - 1]?.runsInOver ?? 0;
  let winType: MatchTimeline['winType'] = 'COMFORTABLE';
  if (result === 'WIN') {
    if (lastOverRuns >= 18) winType = 'LAST_BALL';
    else if (overSummaries.length >= 20 && lastOverRuns >= 12) winType = 'LAST_OVER';
    else if (teamScore - targetScore > 40) winType = 'CRUSHING';
  }

  const wicketsLeft = 10 - wickets;
  const runsSurplus = teamScore - targetScore;
  const winMargin = result === 'WIN'
    ? (winType === 'LAST_BALL' || winType === 'LAST_OVER'
        ? `${randInt(1, 3)} wickets (last over thriller)`
        : wicketsLeft > 0
          ? `${wicketsLeft} wicket${wicketsLeft !== 1 ? 's' : ''}`
          : `${Math.max(1, runsSurplus)} runs (all out)`)
    : `${randInt(5, 35)} runs`;

  // Collect dramatic moments for narrative
  const highlightEvents = allEvents
    .filter((e) => e.isHighlight)
    .sort((a, b) => b.momentumShift - a.momentumShift);

  const dramaticMoments = highlightEvents.slice(0, 3).map((e) => e.cinematic);

  const mvpEvent = highlightEvents[0];
  const narrativeArc = generateNarrativeArc(
    playerName, context.opponentName,
    playerRuns, result, winMargin, winType, dramaticMoments
  );

  const playerStrikeRate = playerBallsFaced > 0
    ? Math.round((playerRuns / playerBallsFaced) * 100)
    : 0;

  // ---- EMOTIONAL MOMENTUM CALCULATIONS ----
  
  // Hype Score: Based on peak crowd, dramatic moments, and player striking
  const peakMomentum = Math.max(...momentumGraph.map((p) => p.momentum));
  const highestCrowdEnergy = Math.max(...allEvents.map((e) => e.crowdEnergy));
  const hypeScore = Math.min(100, Math.round(
    (highestCrowdEnergy * 0.4) + 
    (peakMomentum * 0.3) + 
    (dramaticMoments.length * 5) + 
    (totalSixes * 2)
  ));

  // Pressure Index: Average tension in the last 5 overs + peak tension
  const last5OversTension = momentumGraph.slice(-5).reduce((sum, p) => sum + p.tensionLevel, 0) / Math.max(1, Math.min(5, momentumGraph.length));
  const peakTension = Math.max(...allEvents.map(e => e.tensionLevel));
  const pressureIndex = Math.min(100, Math.round((last5OversTension * 0.6) + (peakTension * 0.4)));

  // Clutch Factor: How many boundaries/sixes the player hit when tension was high (>60)
  const clutchEvents = allEvents.filter(e => e.tensionLevel > 60 && (e.isBoundary || e.isSix) && e.playerRuns > 0);
  const clutchFactor = Math.min(100, Math.round(50 + (clutchEvents.length * 10) + (winType === 'LAST_BALL' && result === 'WIN' ? 20 : 0)));

  // Confidence Swings: Track moments where confidence noticeably shifted
  const confidenceSwings: { over: number; change: number; reason: string }[] = [];
  if (result === 'WIN' && winType === 'CRUSHING') {
    confidenceSwings.push({ over: 20, change: 15, reason: 'Absolute domination' });
  }
  
  // Find key highlights for confidence swings
  highlightEvents.forEach(e => {
    if (e.eventType === 'SIX' && e.tensionLevel > 70) {
      confidenceSwings.push({ over: e.over, change: 5, reason: 'Clutch boundary under extreme pressure' });
    } else if (e.eventType === 'DROPPED_CATCH') {
      confidenceSwings.push({ over: e.over, change: 8, reason: 'Survived a scare, confidence renewed' });
    } else if (e.isWicket && e.playerRuns === 0) {
      confidenceSwings.push({ over: e.over, change: -15, reason: 'Early dismissal shock' });
    }
  });

  // Keep top 3 confidence swings to avoid bloat
  const topSwings = confidenceSwings.slice(-3);

  return {
    events: allEvents,
    overs: overSummaries,
    momentumGraph,
    totalOvers: overSummaries.length,
    finalScore: teamScore,
    finalWickets: wickets,
    targetScore,
    requiredRunRate: parseFloat((targetScore / 20).toFixed(2)),
    playerRuns,
    playerWickets,
    playerStrikeRate,
    result,
    winMargin,
    winType,
    narrativeArc,
    mvpMoment: mvpEvent?.cinematic ?? 'A match-defining moment of brilliance.',
    mvpBall: mvpEvent?.overBall ?? '—',
    peakMomentum,
    highestCrowdEnergy,
    totalSixes,
    totalFours,
    dramaticMoments,
    hypeScore,
    pressureIndex,
    clutchFactor,
    confidenceSwings: topSwings,
  };
};

// ============================================================
// PUBLIC API
// ============================================================

/**
 * Start a full cinematic match simulation.
 * Pass player name + personality for narrative personalisation.
 */
export const startMatch = (
  context: MatchContext,
  playerName: string = 'The Player',
  playerPersonality: string = 'AGGRESSIVE'
): MatchState => {
  console.log(`[MatchEngine] 🎬 Starting cinematic match: ${playerName} vs ${context.opponentName}`);
  console.log(`[MatchEngine]    Venue: ${context.venue} | Type: ${context.matchType} | Difficulty: ${context.opponentDifficulty}/10`);

  const timeline = generateTimeline(context, playerName, playerPersonality);

  // Calculate rewards
  const isMVP = timeline.playerRuns >= 50 || timeline.playerWickets >= 3;
  const isClimax = timeline.winType === 'LAST_BALL' || timeline.winType === 'LAST_OVER';

  const xpEarned =
    timeline.playerRuns * 2 +
    timeline.playerWickets * 15 +
    (timeline.result === 'WIN' ? 100 : 25) +
    (isMVP ? 75 : 0) +
    (isClimax ? 50 : 0);

  const followersGained = timeline.result === 'WIN'
    ? randInt(2000, 15000) + (isClimax ? 8000 : 0)
    : randInt(500, 3000);

  const confidenceChange = timeline.result === 'WIN'
    ? randInt(5, 15) : -randInt(3, 10);

  const reputationChange = timeline.result === 'WIN'
    ? randInt(3, 10) : -randInt(1, 5);

  const matchState: MatchState = {
    id: uuidv4(),
    context,
    timeline,
    xpEarned,
    followersGained,
    confidenceChange,
    reputationChange,
    startedAt: now(),
    completedAt: now(),
  };

  currentMatch = matchState;

  console.log(`[MatchEngine] ✅ Match complete!`);
  console.log(`[MatchEngine]    Result: ${timeline.result} (${timeline.winType}) | ${timeline.winMargin}`);
  console.log(`[MatchEngine]    Score: ${timeline.finalScore}/${timeline.finalWickets} | Target: ${timeline.targetScore}`);
  console.log(`[MatchEngine]    Player: ${timeline.playerRuns} runs (SR: ${timeline.playerStrikeRate}) | ${timeline.totalSixes} sixes | ${timeline.totalFours} fours`);
  console.log(`[MatchEngine]    Peak Momentum: ${timeline.peakMomentum} | Peak Crowd: ${timeline.highestCrowdEnergy}`);
  console.log(`[MatchEngine]    XP Earned: ${xpEarned} | Followers: +${followersGained}`);

  return matchState;
};

/** Get current active match */
export const getCurrentMatch = (): MatchState | null => currentMatch;

/** All ball events */
export const getMatchEvents = (): BallEvent[] => currentMatch?.timeline.events ?? [];

/** Highlight events only */
export const getMatchHighlights = (): BallEvent[] =>
  currentMatch?.timeline.events.filter((e) => e.isHighlight) ?? [];

/** Over-by-over summaries */
export const getOverSummaries = (): OverSummary[] => currentMatch?.timeline.overs ?? [];

/** Momentum graph data (for frontend charts) */
export const getMomentumGraph = (): MomentumPoint[] =>
  currentMatch?.timeline.momentumGraph ?? [];

/** A specific over's events */
export const getOverEvents = (over: number): BallEvent[] =>
  currentMatch?.timeline.events.filter((e) => e.over === over) ?? [];

/** The match narrative arc */
export const getMatchNarrative = (): string =>
  currentMatch?.timeline.narrativeArc ?? '';
