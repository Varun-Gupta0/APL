# 🏏 ATHLETE//ZERO — DESIGN SYSTEM & UI DIRECTIONS

> **"A premium cricket documentary mixed with a sports career simulator."**

This document outlines the visual identity, design guidelines, layout principles, and dashboard systems that govern the UI design of **ATHLETE//ZERO**. Refer to these specifications whenever constructing or styling application components.

---

## 🎨 Design Philosophy & Directions

The UI of ATHLETE//ZERO is intentionally designed to feel **realistic**, **emotional**, and **broadcast-inspired**. It avoids abstract graphics and futuristic sci-fi/hacker aesthetics, focusing instead on real-world sports aesthetics, stadium atmospheres, and clean visual layouts.

* **Realistic:** Heavy use of sports imagery, stadium lighting, and genuine player representations rather than neon-drenched cyberpunk grids.
* **Emotional:** The screens should convey the pressure, ambition, hype, and drama of match-day environments.
* **Broadcast-Inspired:** The layout, score overlays, and stats counters should resemble premium TV sports graphics and analytical dashboards.

---

## 📐 Layout System & Strategy

The application layout uses a **Modular Grid Layout** to remain highly flexible, clean, and responsive:

* **Modular Cards:** Every section is treated as a reusable card with consistent padding and styling that can expand or shrink dynamically.
* **Dashboard Panel Strategy:** Each dashboard screen is organized into three zones:
  1. **Main Focus Panel:** The largest visual area dedicated to the primary content (e.g., active match simulation, main news story, player builder).
  2. **Secondary Context Panels:** Supporting panels displaying stats, trending topics, or active notifications.
  3. **Action Area:** Dedicated zones for button interactions, dialogs, and user choices.

---

## 🎨 Color System

### Primary Palette
Used for core branding, dark mode backgrounds, and primary text/containers:

| Color Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Background** | `#0B1220` | Core page background |
| **Primary Navy** | `#101A2E` | Layout wrappers / sections |
| **Card Navy** | `#16233B` | Cards, buttons, and elements |
| **Gold Accent** | `#D4A94D` | Key highlights, trophy indicators, ratings |
| **White** | `#FFFFFF` | Primary readable text |
| **Soft Gray** | `#A9B4C7` | Muted labels, secondary descriptions |

### Secondary Palette
Used to convey alerts, actions, status, and state changes:

| Color Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Orange Accent** | `#F59E0B` | Warning, progress indicators, alert states |
| **Success Green** | `#22C55E` | Win indicators, positive momentum, upgrades |
| **Danger Red** | `#EF4444` | Lose indicators, negative metrics, critical health/tension |
| **Blue Highlight** | `#3B82F6` | Info logs, hyperlink accents |

---

## 🔠 Typography System

* **Headings:** Bold, uppercase, condensed, and athletic. Use fonts such as *Bebas Neue*, *Oswald*, or *Inter Tight*.
* **Body Text:** Clean, modern, and highly legible. Use fonts such as *Inter* or *Poppins*.

---

## 🃏 Card Design System

All dashboards are composed of **Modular Sports Cards**.

### Card Design Rules
* **DO:**
  * Use soft shadows to distinguish layers.
  * Implement rounded corners (`rounded-lg` or `rounded-xl`).
  * Maintain generous, consistent internal padding (`p-6`).
  * Establish a clear hierarchy using sizes and weights for titles vs. metrics.
* **DO NOT:**
  * Overcrowd cards with excessive details.
  * Use high-contrast gradients as card backgrounds (keep backgrounds dark and flat).
  * Use sharp, unrounded edges.

---

## 📺 Dashboard Breakdown

### A. Landing Page
* **Purpose:** Create immediate emotional impact.
* **Layout:**
  * **Hero Left:** Headline, subheadline, and main Call-To-Action (CTA).
  * **Hero Right:** Cricket player silhouette set against an atmospheric stadium.
  * **Bottom Bar:** Dynamic stats (active players worldwide, live simulated matches, positive rating percentages).
* **Visual Style:** Cinematic sunset stadium lighting.

### B. Player Creation Dashboard
* **Purpose:** Establish player identity and card stats.
* **Layout:**
  * **Left Side:** Interactive forms (player name, role, batting/bowling style, personality traits).
  * **Right Side:** Live-updated FIFA/IPL-style player card preview.
* **Visual Style:** Dramatic IPL draft-style presentation.

### C. Career Hub Dashboard
* **Purpose:** Central management panel.
* **Layout:**
  * **Left Sidebar:** Navigation links.
  * **Center Panel:** Next upcoming match, latest league standings, and career milestones.
  * **Right Panel:** Interactive fan tracker, performance analytics, and player form indicators.
* **Visual Style:** Franchise manager/coach dashboard.

### D. Social Feed Dashboard
* **Purpose:** Simulate sports media chatter and public sentiment.
* **Layout:**
  * **Main Feed:** Chronological posts from fans, reporters, and rival players.
  * **Side Panel:** Sentiment charts and trending hashtags.
* **Visual Style:** Sports Twitter/X overlay.

### E. Rival Dashboard
* **Purpose:** Build drama and tension.
* **Layout:**
  * **Left Panel:** Large rival player portrait with active state indicator.
  * **Right Panel:** Trash talk quotes and interactive press response choices.
  * **Bottom Bar:** A visual tension/rivalry meter.
* **Visual Style:** Head-to-head pre-match card graphics.

### F. Match Simulation Dashboard *(Most Critical Screen)*
* **Purpose:** Experience live-action gameplay drama.
* **Layout:**
  * **Top Panel:** IPL-style broadcast scoreboard.
  * **Center Stage:** Full-screen cricket stadium visual showcasing time of day and crowd elements.
  * **Left Sidebar:** Timeline of historical ball events.
  * **Right Sidebar:** Live AI-generated commentary scrolling log.
  * **Bottom Panel:** Dynamic momentum chart and crowd intensity levels.
* **Visual Style:** Broadcast TV stream with modern stats graphics overlay.

### G. Post-Match Dashboard
* **Purpose:** Celebrate victories or analyze defeats.
* **Layout:**
  * **Left Side:** Large match result text overlaying a high-impact player image.
  * **Right Side:** Detailed match ratings, earned XP, fan growth, and endorsement progress.
* **Visual Style:** Cinematic, celebratory, and rewarding.

### H. Career Progression Dashboard
* **Purpose:** Level up abilities and unlock traits.
* **Layout:**
  * **Left Side:** Level progress bar and newly unlocked traits list.
  * **Right Side:** Interactive nodes to upgrade batting, bowling, stamina, and confidence stats.
* **Visual Style:** RPG-style skill trees tailored for athletics.

### I. Sponsor Dashboard
* **Purpose:** Handle commercial fame.
* **Layout:**
  * **Left Side:** List of active offers, brand parameters, contract values, and requirements.
  * **Right Side:** High-impact mockup promotional photo of the player sporting the sponsor's logo.
* **Visual Style:** High-end sports apparel campaigns (e.g., Nike, Adidas style ads).

---

## 💫 Animation Guidelines
1. **Transitions:** Smooth page fades and card slide-ins using `Framer Motion`.
2. **Elevations:** Subtle hover states (`scale-102` or glow shifts) when interacting with cards.
3. **Match Events:** Scale pop-ups for boundary hits, wickets, and milestones.
4. **Dopamine Counters:** Count-up animations for XP gains, fan counts, and cash.
5. **Interactive Graphs:** Animated charts that draw paths on mount.

---

## 📱 Responsiveness
* **First Priority:** Desktop/Tablet landscape interfaces (focus on dashboard layout).
* **Second Priority:** Mobile responsiveness (modular cards stack vertically).
