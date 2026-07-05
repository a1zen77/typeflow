# TypeFlow

> A fast, minimal typing speed test — with themes, a global leaderboard, and real-time feedback.

**Live demo → [typeflow-test.vercel.app](https://typeflow-test.vercel.app)**

![React](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

---

## Overview

TypeFlow is a production-grade typing speed application built with React 18 and Vite. It offers real-time per-character feedback, four timed test modes, live WPM and accuracy tracking, and a global leaderboard backed by Supabase. The app features a fully themeable UI with five hand-crafted colour themes, JWT-based authentication, and a post-test results screen with animated statistics and a WPM-over-time chart.

---

## Features

### Core Typing Experience
- **Four test modes** — 15 seconds, 30 seconds, 1 minute, 2 minutes
- **Real-time character feedback** — characters turn green (correct) or red (incorrect) on every keystroke
- **Live stats bar** — WPM and accuracy update every second during the test
- **Smooth word display** — auto-scrolling word area with CSS mask transitions
- **Punctuation mode** — adds commas, periods, and apostrophes at natural positions
- **Numbers mode** — injects numeric words into the word pool
- **500-word pool** — curated common English words for a natural typing experience

### Results & Analytics
- **Animated results** — WPM, accuracy, and consistency scores count up on load
- **Consistency score** — measures how stable your speed was throughout the test
- **WPM over time chart** — filled area chart showing speed across the test duration
- **Peak WPM** — highest speed snapshot shown on the results screen
- **Personal bests** — tracked per mode in localStorage, persists across sessions
- **New PB banner** — gold celebration banner when a record is broken

### Accounts & Leaderboard
- **Email and password authentication** — JWT-based auth via Supabase, no OAuth required
- **Global leaderboard** — top 20 scores per mode, visible to all users
- **Auto score saving** — scores saved to Supabase automatically for logged-in users
- **Personal score history** — full test history with WPM, accuracy, errors, and date
- **Row Level Security** — Supabase RLS ensures users can only write their own data

### UI & Theming
- **Five themes** — Midnight, Terminal, Sepia, Ocean, Rose
- **Theme persistence** — active theme saved to localStorage across sessions
- **Toast notifications** — non-intrusive feedback for sign in, sign out, and score saved
- **Keyboard-first design** — full keyboard navigation with no mouse required
- **Responsive layout** — works across desktop and mobile screens

### Keyboard Shortcuts

| Key | Action |
|---|---|
| Any letter | Start test immediately from the menu |
| `Space` | Advance to next word |
| `Backspace` | Correct last character |
| `Esc` | Reset current test |
| `Tab` + `Enter` | Retry instantly from results screen |

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | React 18 + Vite | Component UI and fast dev/build tooling |
| Styling | Tailwind CSS | Utility-first dark theme with CSS variable theming |
| Backend | Supabase | PostgreSQL database, Auth (JWT), Row Level Security |
| Charts | Recharts | WPM over time area chart on results screen |
| Fonts | JetBrains Mono, DM Sans | Monospace typing area, clean sans UI text |
| Persistence | localStorage | Theme preference and local personal bests |
| Deployment | Vercel | CI/CD via GitHub, global CDN, automatic deploys |
| Monitoring | Uptime Robot | Keeps Supabase active via scheduled pings |

---

# File Structure

```text
src/
├── components/
│   ├── AuthModal.jsx         # Email/password sign in and sign up modal
│   ├── Header.jsx            # Logo, nav, theme picker, auth controls
│   ├── ModeSelector.jsx      # Duration picker, punctuation/numbers toggles
│   ├── Results.jsx           # Post-test stats, chart, leaderboard save
│   ├── SaveScorePrompt.jsx   # Prompt for logged-out users to save score
│   ├── StatsBar.jsx          # Live WPM, accuracy, countdown timer
│   ├── ThemePicker.jsx       # Theme dropdown with colour swatches
│   ├── ToastContainer.jsx    # Toast notification renderer
│   ├── TypingArea.jsx        # Word display with per-character colour feedback
│   └── WpmChart.jsx          # Recharts area chart for WPM over time
│
├── hooks/
│   ├── useAuth.js            # Supabase auth — sign up, sign in, sign out, session
│   ├── usePersonalBest.js    # localStorage personal best read/write
│   ├── useScores.js          # Supabase score saving and leaderboard queries
│   ├── useTheme.js           # CSS variable theme switching and persistence
│   ├── useTimer.js           # Countdown timer with WPM snapshot collection
│   ├── useToast.js           # Toast state management
│   └── useTypingEngine.js    # Core typing state machine
│
├── pages/
│   └── Leaderboard.jsx       # Global leaderboard and personal score history
│
├── utils/
│   ├── storage.js            # localStorage helpers for personal bests
│   ├── themes.js             # Theme definitions with CSS variable maps
│   ├── wpmCalc.js            # WPM, accuracy, and consistency formulas
│   └── wordGen.js            # Random word generator with punctuation/numbers
│
├── data/
│   └── words.js              # 500 curated common English words
│
├── lib/
│   └── supabase.js           # Supabase client initialisation
│
└── styles/
    └── global.css            # Tailwind base, CSS variable defaults, utilities
```

# Project Structure Overview

| Directory | Purpose |
|-----------|---------|
| **components/** | UI components used throughout the application |
| **hooks/** | Custom React hooks for application logic |
| **pages/** | Route-level page components |
| **utils/** | Helper functions and calculation utilities |
| **data/** | Static application data (word list) |
| **lib/** | Third-party service configuration (Supabase) |
| **styles/** | Global styling and CSS variables |

---

# Typing Metrics

## Words Per Minute (WPM)

Gross WPM follows the standard typing definition, where **every 5 characters (including spaces)** counts as one word.

```text
WPM = (Correct Characters / 5) ÷ Elapsed Time (minutes)
```

---

## Accuracy

Accuracy is calculated as the percentage of correctly typed characters out of all typed characters.

```text
Accuracy = (Correct Characters ÷ Total Characters Typed) × 100
```

---

## Consistency

Consistency measures how stable the typing speed remains throughout the test. It is calculated using the standard deviation of WPM snapshots collected during the test.

```text
Consistency = 100 - ((Standard Deviation ÷ Mean WPM) × 100)
```

Higher consistency indicates a more stable typing speed with fewer fluctuations.

---

## Database Schema

```sql
-- Profiles — public user display info
create table profiles (
  id         uuid primary key references auth.users(id),
  username   text unique not null,
  created_at timestamptz default now()
);

-- Scores — every test result for every user
create table scores (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references profiles(id) not null,
  wpm        integer not null,
  accuracy   integer not null,
  errors     integer not null,
  duration   integer not null,
  mode       text not null default 'words',
  created_at timestamptz default now()
);
```

Row Level Security is enabled on both tables. Users can only insert and update their own rows. All scores are publicly readable for the leaderboard.

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm
- A Supabase project (free tier)

### Install and run locally

```bash
git clone https://github.com/a1zen77/typeflow.git
cd typeflow
npm install
```

Create a `.env.local` file in the project root:

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Deployment

The app is deployed on Vercel with automatic deployments triggered on every push to `main`. Environment variables are configured in the Vercel dashboard. Supabase is kept active on the free tier via a scheduled Uptime Robot HTTP monitor pinging every 5 minutes.

---