# TypeFlow

Live demo: [typeflow-test.vercel.app](https://typeflow-test.vercel.app)

A clean, minimal typing speed test built with React + Vite. Test your WPM across four timed modes with real-time character feedback, live stats, and personal best tracking.

![TypeFlow](https://img.shields.io/badge/built%20with-React%20%2B%20Vite-7C6AF7?style=flat-square)
![Deployed on Vercel](https://img.shields.io/badge/deployed%20on-Vercel-000000?style=flat-square)

---

## Features

- **Four test modes** — 15s, 30s, 1 minute, 2 minutes
- **Real-time feedback** — characters turn green or red as you type
- **Live stats** — WPM and accuracy update every second
- **WPM graph** — see your speed over time on the results screen
- **Personal bests** — tracked locally per mode, persists across sessions
- **Keyboard first** — start typing to begin, ESC to reset, Tab+Enter to retry
- **Dark minimal UI** — JetBrains Mono, smooth scrolling word display

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Fonts | JetBrains Mono, DM Sans |
| Persistence | localStorage |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm

### Install and run locally
```bash
git clone https://github.com/a1zen77/typeflow.git
cd typeflow
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build for production
```bash
npm run build
npm run preview
```

---

## Keyboard Shortcuts

| Key | Action |
|---|---|
| Any letter | Start test immediately from menu |
| `Esc` | Reset current test |
| `Tab` + `Enter` | Retry from results screen |
| `Esc` | Back to menu from results screen |
| `Space` | Advance to next word |
| `Backspace` | Correct last character |

---

## How WPM is Calculated

Gross WPM using the standard definition — every 5 characters (including spaces) counts as one word:
```
WPM = (correct characters / 5) / (elapsed time in minutes)
```

Accuracy is calculated as:
```
Accuracy = (correct characters / total characters typed) × 100
```

---
