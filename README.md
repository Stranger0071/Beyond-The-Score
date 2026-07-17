# 🏏 Beyond The Score — Cricket Analytics Dashboard

[![React](https://img.shields.io/badge/React-19-blue.svg?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-purple.svg?style=for-the-badge&logo=vite)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC.svg?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

An immersive, premium-grade **Cricket Analytics & Match Intelligence Dashboard**. *Beyond The Score* takes raw ball-by-ball datasets from legendary tournaments (IPL & ICC Men's Cricket World Cups) and breathes life into them with sub-millisecond data processing, elegant glassmorphic visuals, deep charts, and contextual narratives.

---

## ✨ Features That Stand Out

*Beyond The Score* is designed to give fans, analysts, and developers a state-of-the-art overview of cricket matches:

### 📈 Deep Match Analytics
Visualize the ebb and flow of every match through interactive statistics. Discover patterns in partnership contributions, over-by-over scoring progressions, phase-specific run rates, and individual bowler impact.

### 🏟️ Venue & Pitch Insights
Analyze venues like a professional tactician. Evaluate toss decisions (batting vs. chasing advantages), historical stadium averages, pitch biases, and overall win-loss trends under different conditions.

### 👥 Head-to-Head Comparisons
Side-by-side comparative analysis between rival franchises/nations. Discover historical dominance, scoring averages, and matchup trends across seasons.

### ⚡ Sub-Millisecond Sync & Ingestion Pipeline
A robust NodeJS pre-compilation script processes raw, complex cricket CSVs (deliveries, over-by-over histories, player rosters, match venues) into lean, optimized JSON files, enabling lightning-fast, zero-lag rendering.

### 🎭 AI-Driven Narration & Key Moments
Go beyond cold hard numbers. Relive the narrative of the match with curated **Insight Cards** and an interactive chronological **Key Moments Timeline** highlighting milestone runs, critical wickets, and turning points.

### 🎯 Player Spotlight & Scorecard
Examine detailed performance stats of the match-winners, check official squads and playing XIs, and explore comprehensive, fully-detailed match scorecards.

---

## 🛠️ Tech Stack & Core Libraries

- **Frontend Core:** [React 19](https://react.dev) & [Vite 8](https://vite.dev) (for hot module replacement and high-speed development)
- **Styling:** [Tailwind CSS 4.0](https://tailwindcss.com) (with custom fluid variables, modern glassmorphism, and dark-themed components)
- **Data Engine:** Customized NodeJS ES modules (`.mjs`) & [XLSX Parser](https://sheetjs.com/) for super-charged pre-processing
- **AI Integration:** [@google/genai](https://www.npmjs.com/package/@google/genai) for narrative insight synthesis

---

## 📁 Repository Structure

```filepath
Beyond The Score/
├── beyondthescore/             # Primary React + Vite Application
│   ├── public/                 # Static Assets
│   ├── scripts/                # Data pre-compilation pipeline scripts
│   │   ├── build-ipl-matches.mjs
│   │   └── build-players-json.mjs
│   ├── src/
│   │   ├── components/         # Premium UI Components (Scorecard, VenueStats, etc.)
│   │   ├── data/               # Ingested datasets (CSV, XLSX) and loaders
│   │   ├── utils/              # Data parsing, filters, and helper methods
│   │   ├── App.jsx             # Root Layout and View Swapping State
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Custom Tailwind and Core CSS Variables
│   ├── package.json
│   └── vite.config.js
├── .gitignore                  # Global git ignores
└── README.md                   # You are here!
```

---

## 🚀 Quick Start Guide

Ready to explore *Beyond The Score*? Set it up locally in minutes:

### 1. Clone the repository
```bash
git clone https://github.com/Stranger0071/Beyonf-The-Score.git
cd "Beyond The Score/beyondthescore"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Parse Datasets & Run the App
The project includes a custom pipeline that parses complex, multi-megabyte CSV and Excel files into optimized structures before launching the dev server:
```bash
# Run data transformation pipeline + start Vite dev server
npm run dev
```

Alternatively, to manually trigger the data preprocessing pipeline:
```bash
npm run data:sync
```

---

## 🎨 UI & Design Principles

*Beyond The Score* is styled with an ultra-modern, dark-themed sport-intelligence aesthetic:
- **Palette:** Rich deep obsidian (`#05070a`), neon cyan highlights, electric emeralds, and subtle gold accents for VIP-level sports feel.
- **Glassmorphism:** Elegant frosted borders (`backdrop-blur-md border-white/10`) to separate sections without cluttering the screen.
- **Responsiveness:** Fluid grid layouts optimized for mobile, tablet, and ultra-wide monitor views.

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

*Crafted with 🏏 by cricket enthusiasts, for cricket enthusiasts.*
