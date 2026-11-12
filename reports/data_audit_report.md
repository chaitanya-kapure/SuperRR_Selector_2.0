# SupeRR Selector 2.0 — Comprehensive Dataset Audit Report
**Rajasthan Royals | Round 1: Pressure Performance Intelligence Platform**  
*Audit Date: November 2026*

---

## 1. Executive Summary & File Inventory

The official Round 1 data pack contains 6 CSV files covering all official T20 and T20I matches from 2022 to 2026.

| File | Rows | Columns | File Size | Description |
| :--- | :--- | :--- | :--- | :--- |
| `competitions.csv` | 141 | 4 | 7.6 KB | Competitions, formats (`T20`, `T20I`), and seasons (`2022`–`2026`). |
| `teams.csv` | 353 | 3 | 6.9 KB | Unique team entities across competitions (38 unique franchises/nations). |
| `matches.csv` | 883 | 22 | 123.8 KB | Match-level metadata, dates, venues, toss, revised overs/targets, results. |
| `ball_by_ball.csv` | 200,999 | 33 | 41.1 MB | Ball-by-ball delivery log with ball speed, dismissals, strokes, runs. |
| `playing_eleven.csv`| 28,381 | 9 | 966.3 KB | Match lineups, batting order, captaincy, wicketkeepers, impact players. |
| `competition_team_player_mapping.csv` | 6,413 | 6 | 463.0 KB | Canonical player-team-competition master mapping (1,217 unique players). |

---

## 2. Match Coverage & Format Breakdown

### Competition Formats
- **Total matches in `matches.csv`:** 883 matches across 141 competitions.
- **Matches with Ball-by-Ball data:** 867 matches (16 matches were abandoned without a ball bowled due to rain/unfit conditions, e.g., GT vs KKR 2024, RR vs KKR 2024).
- **Match Format Distribution:**
  - **T20 (Franchise / Tournaments):** 401 matches
    - **IPL 2022:** 74 matches (`comp_id: 1358`)
    - **IPL 2023:** 74 matches (`comp_id: 1715`)
    - **IPL 2024:** 74 matches (`comp_id: 2193`)
    - **IPL 2025:** 75 matches (`comp_id: 2725`)
    - **IPL 2026:** 74 matches (`comp_id: 3298`)
    - **Other T20:** 30 matches (Emerging Teams Asia Cup, Asia Cup Rising Stars)
    - *Total IPL Matches:* 371 matches (367 with ball-by-ball delivery data)
  - **T20I (International):** 482 matches across bilateral series, Asia Cups, and qualifiers.

---

## 3. Critical Data Engineering & Schema Discoveries

### A. Delivery Runs vs Extras Decoding
1. **Batter Runs (`runs` column):**
   - Strictly reflects runs scored off the bat by the striker (values: 0, 1, 2, 3, 4, 5, 6).
   - On wide deliveries, `runs == 0` for 100% of rows (7,714 deliveries).
   - On no-ball / overstep deliveries, `runs` equals runs off the bat (0, 1, 2, 3, 4, 6).
2. **`extras1_runs` is a Categorical Enum, NOT a Run Value:**
   - *Critical finding:* `extras1_runs` values are `1` (Overstep/No-ball), `2` (Wide), `3` (Leg byes), `4` (Byes), `5` (Other), `6` (None/Regular delivery), `7` (Penalty).
   - Summing `extras1_runs` directly would produce completely invalid run totals.
3. **Extras Run Rules:**
   - Wide: 1 penalty run conceded by bowler (plus `extras_2_runs` if overthrows/boundaries occur).
   - Overstep (No-ball): 1 penalty run conceded by bowler (plus batter runs off bat).
   - Byes / Leg-byes: Team runs, NOT charged to the bowler.
   - `extras_2_runs`: Contains additional runs (e.g. 4 on wide boundaries, 1 on overthrows) on 36 deliveries.
4. **Legal Deliveries:**
   - A delivery is legal if `extras_type` is NOT in `['wide', 'Overstep']`.
   - Wides and Oversteps do not increment the legal ball count for the bowler or the over.

### B. Wicket & Dismissal Attribution
Total dismissals in dataset: **10,881** across 9 dismissal types:
- **Bowler Wickets (10,058):**
  - `Caught` (7,557)
  - `Bowled` (1,775)
  - `LBW` (709)
  - `Stump` (214)
  - `Hit Wicket` (17)
- **Non-Bowler Wickets (823 — not credited to the bowler):**
  - `RunOut` (600)
  - `Retire Out` (6)
  - `Obstructing / Obstracting the field` (3)

### C. Player Entities
- **Unique Strikers:** 888 players
- **Unique Bowlers:** 647 players
- **Total Unique Active Players in Ball-by-Ball:** 958 players
- **Consistency:** 100% of ball-by-ball player IDs map directly into `competition_team_player_mapping.csv`. Zero orphaned players.

---

## 4. Ground Truth Validation

The exact parsing logic was validated against official international scorecards (e.g., Match `13511`: West Indies vs England, Jan 22, 2022):
- Jason Holder: 3.4 overs, 7 runs, 4 wickets (scorecard: 4/7) — **Exact 100% Match**
- Sheldon Cottrell: 4.0 overs, 30 runs, 2 wickets (scorecard: 2/30) — **Exact 100% Match**
- Akeal Hosein: 4.0 overs, 16 runs, 1 wicket (scorecard: 1/16) — **Exact 100% Match**
- England team total: 103 all out in 19.4 overs (100 batter runs + 3 wides) — **Exact 100% Match**

---

## 5. Next Steps for Pressure Modeling
1. **Match-State Reconstruction:** Compute before every delivery:
   - Current score, current wickets lost, legal balls bowled in innings.
   - Target, runs required, balls remaining, Required Run Rate (RRR) for Innings 2.
2. **Pressure Index Formulation:** Dual-model for Batting and Bowling across Innings 1 and Innings 2.
3. **Player Reliability Scoring:** Baseline vs Pressure performance + Bayesian shrinkage.
