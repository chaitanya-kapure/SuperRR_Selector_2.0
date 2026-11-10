# 🏏 SupeRR Selector 2.0

### Rajasthan Royals — IPL 2027 Auction Intelligence Platform

> **"Discover Tomorrow's Royals."**

An intelligent, data-driven talent discovery platform built to identify the **top 10 youngest uncapped domestic players** worth backing at the IPL 2027 auction — developed for the **SupeRR Selector 2.0** competition organized by **Rajasthan Royals**.

---

## 🎯 Objective

Analyse uncapped domestic cricket talent and produce a statistically justified, evidence-backed recommendation of the **10 youngest players** who could deliver real value for Rajasthan Royals at the IPL 2027 mega auction.

This is not a generic dashboard — it's a **franchise-level auction intelligence platform** combining cricket analytics, statistical reasoning, and a premium user interface.

---

## 🖥️ Screenshots

| Dashboard | Sidebar & Navigation |
|---|---|
| Hero section with cinematic palace artwork, KPI row, analytics pipeline, Top 10 shortlist preview, and key analysis views | RR-branded sidebar with crown emblem, active pink navigation, palace silhouette, and tagline |

---

## ⚡ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 |
| **Build Tool** | Vite 6 |
| **Styling** | Tailwind CSS 3 |
| **Routing** | React Router 7 |
| **Icons** | Lucide React |
| **Language** | JavaScript (JSX) |

**Future additions** (after dataset arrives):
- Recharts (data visualisation)
- Python / Pandas / NumPy / Scikit-learn (analytics & ML)
- FastAPI or Node.js (backend, if needed)

---

## 🎨 Design System

A premium Rajasthan Royals-inspired visual identity:

| Token | Hex | Usage |
|---|---|---|
| **Primary Pink** | `#E91E63` | CTAs, highlights, active states |
| **Bright Pink** | `#FF1768` | Hover states, emphasis |
| **Deep Navy** | `#080D1B` | Page background |
| **Card Background** | `#111A30` | Card surfaces |
| **Royal Purple** | `#241338` | Special panels, gradients |
| **Royal Gold** | `#D4AF37` | Premium accents, Top 10 ranks |
| **Muted Text** | `#A7B2C7` | Secondary text |

---

## 📂 Project Structure

```
src/
├── App.jsx                          # Router — 6 routes
├── main.jsx                         # React entry point
├── index.css                        # Design system & global styles
│
├── components/
│   ├── layout/
│   │   ├── Layout.jsx               # App shell (sidebar + topbar + outlet)
│   │   ├── Sidebar.jsx              # RR-branded sidebar with palace artwork
│   │   └── TopBar.jsx               # Page title + dataset status badge
│   └── ui/
│       ├── EmptyState.jsx           # Reusable empty state placeholder
│       ├── SectionHeader.jsx        # Label + heading + description
│       └── StatusBadge.jsx          # Coloured status pill
│
└── pages/
    ├── Dashboard.jsx                # Hero + KPIs + pipeline + shortlist + analysis views
    ├── PlayerDiscovery.jsx          # Search & filter interface (awaiting data)
    ├── PlayerAnalytics.jsx          # 6 chart placeholders (awaiting data)
    ├── AuctionIntelligence.jsx      # Evaluation framework + ranking table shell
    ├── Shortlist.jsx                # 10-slot shortlist with selection criteria
    └── Methodology.jsx             # 6 principles + 6-phase analytical workflow
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Install & Run

```bash
# Clone the repository
git clone https://github.com/chaitanya-kapure/SuperRR_Selector_2.0.git
cd SuperRR_Selector_2.0

# Install dependencies
npm install

# Start development server
npm run dev
# → Opens at http://localhost:5173

# Production build
npm run build

# Preview production build
npm run preview
```

---

## 📋 Current Status

| Item | Status |
|---|---|
| Frontend Foundation | ✅ Complete |
| Premium Dashboard Redesign | ✅ Complete |
| Navigation & Routing (6 pages) | ✅ Complete |
| Responsive Layout | ✅ Complete |
| Official Round 1 Dataset | ⏳ Awaiting |
| Competition Guidelines | ⏳ Awaiting |
| Data Cleaning & EDA | 🔒 Blocked on dataset |
| Player Ranking Model | 🔒 Blocked on dataset |
| Top 10 Shortlist | 🔒 Blocked on analysis |
| Final Submission | 🔒 Last step |

> **Important:** No fake player data, fabricated statistics, or invented rankings are used anywhere in this project. All analytics modules will activate only after the official dataset is received.

---

## 🔬 Analytical Workflow (Post-Dataset)

1. **Dataset Inspection** — Understand every column, type, and limitation
2. **Data Cleaning** — Validate, normalise, handle missing values
3. **Exploratory Analysis** — Distributions, outliers, age vs performance
4. **Methodology Design** — Evidence-based composite scoring framework
5. **Player Ranking** — Score and rank all eligible uncapped players
6. **Top 10 Selection** — Identify highest-value youngest targets
7. **Validation** — Cross-check rankings for consistency
8. **Submission** — Package analytics, visuals, and recommendations

---

## 🏆 Competition

- **Competition:** SupeRR Selector 2.0
- **Organizer:** Rajasthan Royals
- **Goal:** Identify the top 10 youngest uncapped domestic players for IPL 2027 auction

---

## 📄 License

This project is built for the SupeRR Selector 2.0 competition. All rights reserved.

---

<p align="center">
  <strong>Data-Driven Decisions. Royal Results.</strong><br/>
  <sub>Built with ❤️ for Rajasthan Royals</sub>
</p>
