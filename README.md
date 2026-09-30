# Beyond The Score — Cricket Analytics Dashboard

[![React](https://img.shields.io/badge/React-19-blue.svg?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-purple.svg?style=for-the-badge&logo=vite)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC.svg?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

A modern, high-performance **Cricket Analytics & Match Intelligence Dashboard**. *Beyond The Score* processes ball-by-ball datasets from major tournaments (IPL & ICC Men's Cricket World Cups) to deliver real-time data visualisations, phase analytics, and contextual AI-assisted match summaries.

---

## Key Features

*Beyond The Score* provides a comprehensive analytical platform for cricket matches and tournaments:

### Deep Match Analytics
Visualize match progressions through interactive charts, partnership dynamics, over-by-over scoring trends, phase-specific run rates, and bowler impact metrics.

### Venue & Pitch Insights
Evaluate stadium characteristics including toss decisions (batting vs. chasing win ratios), venue scoring averages, pitch conditions, and historical match outcomes.

### Head-to-Head Comparisons
Side-by-side comparative analysis between competing teams, detailing historical head-to-head records, scoring distributions, and seasonal matchup trends.

### Data Ingestion Pipeline
Node.js pre-compilation tools ingest raw cricket CSV datasets (deliveries, rosters, venues, over logs) and generate optimized JSON models for zero-latency client rendering.

### AI-Driven Match Summaries & Key Moments
Automated match intelligence featuring contextual narrative cards, critical turning points, milestone tracking, and bowler/batter performance highlights.

### Player Spotlight & Detailed Scorecards
Detailed individual player statistics, playing XI rosters, and official match scorecards.

---

## Architecture & Tech Stack

- **Frontend Core:** [React 19](https://react.dev) & [Vite 8](https://vite.dev)
- **Backend Proxy:** [Node.js](https://nodejs.org) + [Express](https://expressjs.com) with [Helmet](https://helmetjs.github.io) (CSP & security headers) and [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit)
- **Styling:** [Tailwind CSS 4.0](https://tailwindcss.com) with custom dark mode variables and responsive layouts
- **Data Engine:** ES Module pipeline (`.mjs`) leveraging [read-excel-file](https://github.com/catamphetamine/read-excel-file)
- **AI Integration:** Google Gemini API integrated behind a secure backend proxy with prompt injection sanitization and DOMPurify text escaping

---

## Security Architecture

The backend Express proxy (`server/index.js`) secures external AI services and client interactions:
- **Input Sanitization**: Filters known prompt injection patterns, role markers (`SYSTEM:`, `[INST]`), code fence escapes, and template slot injections.
- **Data Delimitation**: Encloses raw match payload data in strict sentinel blocks (`--- MATCH DATA BEGIN ---`) accompanied by explicit raw-data treatment system rules.
- **HTTP Hardening**: Configured with Helmet security middleware and IP-based rate limiting.

---

## Repository Structure

```
Beyond The Score/
└── beyondthescore/             # Primary Application Root
    ├── public/                 # Static Assets
    ├── scripts/                # Data ingestion & build scripts
    │   ├── build-ipl-matches.mjs
    │   ├── build-players-json.mjs
    │   └── build-wc-matches.mjs
    ├── server/                 # Express backend proxy & security tests
    │   ├── index.js
    │   └── narrate.test.mjs
    ├── src/
    │   ├── components/         # React UI Components
    │   ├── data/               # Ingested datasets and data loaders
    │   ├── utils/              # Data parsers and utility functions
    │   ├── App.jsx             # Main Application Entry
    │   ├── main.jsx            # React root mount
    │   └── index.css           # Core styles and design system
    ├── .env.example            # Environment setup template
    ├── package.json
    └── vite.config.js
```

---

## Quick Start Guide

### 1. Clone the Repository
```bash
git clone https://github.com/Stranger0071/Beyond-The-Score.git
cd "Beyond The Score/beyondthescore"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Copy `.env.example` to `.env.local` and specify your Gemini API credentials:
```bash
cp .env.example .env.local
```

Set the variables in `.env.local`:
```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run Development Server
Start both the Express backend proxy (port 3001) and Vite dev server concurrently:
```bash
npm run dev
```

### 5. Individual Run Commands
```bash
# Execute automated security proxy unit tests (45 tests)
npm test

# Run data pre-compilation sync scripts
npm run data:sync

# Run Express server only
npm run server

# Run Vite client only
npm run dev:client
```

---

## Testing

The project includes an automated test suite verifying prompt sanitization, boundary checks, and system instruction rules:

```bash
npm test
```

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.
