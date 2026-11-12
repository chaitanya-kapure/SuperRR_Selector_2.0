# 🏏 SupeRR Selector 2.0 — Pressure Performance Intelligence Platform

### Rajasthan Royals | IPL 2027 Auction Strategy Platform

> **"Discover Who Delivers When It Matters."**

An advanced, data-driven cricket analytics platform built to identify the **most reliable batters and bowlers under pressure** for Rajasthan Royals' IPL 2027 auction strategy — developed for the **SupeRR Selector 2.0** official competition organized by **Rajasthan Royals**.

---

## 🎯 Official Challenge & Deliverables

**Official Challenge:** *"Build a data-driven system that measures how batters and bowlers perform in high-pressure match situations compared with their usual performance levels. Use your system to identify and rank the players who deliver most consistently when it matters."*

- **Deliverable A — Top 10 Batters Under Pressure:** An ordered ranking of the 10 best-performing batters in high-pressure match situations.
- **Deliverable B — Top 10 Bowlers Under Pressure:** An ordered ranking of the 10 best-performing bowlers defending totals, bowling death overs, and creating breakthroughs.
- **Deliverable C — Comprehensive Methodology Report:** Mathematical pressure definition, baseline comparison, Empirical Bayes shrinkage, and evidence dossiers for all rankings.

---

## ⚡ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18 |
| **Build Tool** | Vite 6 |
| **Styling & Design System** | Tailwind CSS 3 |
| **Routing** | React Router 7 |
| **Data Visualization** | Recharts |
| **Iconography** | Lucide React |
| **Data Science & Analytics** | Python 3.13, Pandas, NumPy |

---

## 🎨 Rajasthan Royals Visual Identity

| Token | Hex | Role |
|---|---|---|
| **Primary Pink** | `#E91E63` | Key highlights, brand badges, active states |
| **Bright Pink** | `#FF1768` | Focus accents, high-leverage indicators |
| **Deep Navy** | `#080D1B` | App base canvas |
| **Royal Navy** | `#0B1020` | Secondary background |
| **Card Canvas** | `#111A30` | Analytical card surfaces |
| **Elevated Navy**| `#1A2540` | Table headers & metric pods |
| **Royal Purple** | `#241338` | Cinematic gradients |
| **Royal Gold**   | `#D4AF37` | Top 10 badges, champion spotlight |
| **Muted Text**  | `#A7B2C7` | Data labels & subtitles |

---

## 📂 Application Architecture

```
src/
├── App.jsx                          # Router — 8 dedicated competition pages
├── main.jsx                         # React entry point
├── index.css                        # RR design tokens & CSS art
│
├── services/
│   └── analyticsService.js          # Clean data contracts & audit provider
│
├── components/
│   ├── layout/
│   │   ├── Layout.jsx               # App shell (sidebar + topbar + outlet)
│   │   ├── Sidebar.jsx              # RR-branded navigation & palace silhouette
│   │   └── TopBar.jsx               # Breadcrumbs, live status pill & user avatar
│   └── ui/
│       ├── EmptyState.jsx           # Standardized empty / pending state
│       ├── SectionHeader.jsx        # Standardized page & section headings
│       └── StatusBadge.jsx          # Live processing & validation badges
│
└── pages/
    ├── Overview.jsx                 # Hero, KPIs, performance previews, pipeline status
    ├── BattingAnalytics.jsx         # Batting under pressure (SR, Boundary %, Dot %)
    ├── BowlingAnalytics.jsx         # Bowling under pressure (Economy, Dots, Wickets)
    ├── PlayerComparison.jsx         # Head-to-head radar & metric comparison
    ├── Top10Batters.jsx             # Top 10 Batters leaderboard with Rank 1 spotlight
    ├── Top10Bowlers.jsx             # Top 10 Bowlers leaderboard with Rank 1 spotlight
    ├── Methodology.jsx              # 12-section mathematical & pressure framework
    └── DataQuality.jsx              # Official dataset inventory & audit verification
```

---

## 📊 Dataset & Audit Findings

The platform is powered by the official Round 1 dataset:
- **883 Matches** (371 IPL matches from 2022 to 2026, 482 T20Is across 136 series).
- **200,999 Deliveries** analyzed down to ball speed, stroke type, and dismissal IDs.
- **1,217 Players** cataloged with 100% referential integrity.
- **Data Engineering Discoveries:**
  - Decoupled `extras1_runs` categorical enum (1=No-ball, 2=Wide, 3=Legbyes, 4=Byes).
  - Filtered 10,058 true bowler wickets vs 823 non-bowler dismissals.
  - Reconciled 16 abandoned matches without ball-by-ball records.
  - 100% scorecard verification on sample international matches.

---

## 🚀 Running the Project

```bash
# Clone the repository
git clone https://github.com/chaitanya-kapure/SuperRR_Selector_2.0.git
cd SuperRR_Selector_2.0

# Install dependencies
npm install

# Start development server
npm run dev
# → http://localhost:5173

# Production build
npm run build
```

---

<p align="center">
  <strong>Data-Driven Decisions. Royal Results.</strong><br/>
  <sub>Built with ❤️ for Rajasthan Royals</sub>
</p>
