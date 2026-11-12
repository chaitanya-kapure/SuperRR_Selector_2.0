"""
SupeRR Selector 2.0 — Phase 2 Analytics Pipeline Runner
=======================================================
Executes batting and bowling baseline modeling, pressure performance comparison,
Empirical Bayes shrinkage, 12 automated validation tests, and exports all CSV
and Markdown deliverables.
"""

import os
import sys
import time
import pandas as pd
import numpy as np

# Add project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src_analytics.data.loader import load_raw_data
from src_analytics.batting.baseline_metrics import (
    compute_batting_baselines,
    compute_pressure_batting_metrics,
    merge_batting_performance
)
from src_analytics.bowling.baseline_metrics import (
    compute_bowling_baselines,
    compute_pressure_bowling_metrics,
    merge_bowling_performance
)
from src_analytics.scoring.empirical_bayes import (
    apply_batting_shrinkage,
    apply_bowling_shrinkage,
    compute_batting_reliability_score,
    compute_bowling_reliability_score
)
from src_analytics.scoring.rankings import (
    build_player_team_mapping,
    generate_top_10_batters,
    generate_top_10_bowlers
)
from src_analytics.validation.test_phase2_metrics import run_phase2_tests

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

PROCESSED_DIR = r"d:\RR\data\processed"
REPORTS_DIR = r"d:\RR\reports"

def main():
    start_time = time.time()
    print("=" * 80)
    print("SUPERR SELECTOR 2.0 — PHASE 2 PERFORMANCE MODELING & RANKINGS PIPELINE")
    print("=" * 80)

    os.makedirs(PROCESSED_DIR, exist_ok=True)
    os.makedirs(REPORTS_DIR, exist_ok=True)

    # 1. Load Data
    print("\n[Step 1] Loading reconstructed match states and raw player mappings...")
    reconstructed_path = os.path.join(PROCESSED_DIR, "reconstructed_match_states.csv")
    if not os.path.exists(reconstructed_path):
        raise FileNotFoundError(f"Missing {reconstructed_path}. Please run Phase 1 first.")
    
    reconstructed_df = pd.read_csv(reconstructed_path)
    print(f"  -> Loaded reconstructed match states: {len(reconstructed_df):,} deliveries.")

    raw = load_raw_data()
    player_team_map = build_player_team_mapping(raw['player_mapping'])
    print(f"  -> Built team mappings for {len(player_team_map):,} players.")

    # 2. Batting Modeling
    print("\n[Step 2] Executing Batting Modeling Pipeline...")
    bat_baselines = compute_batting_baselines(reconstructed_df)
    bat_pressure = compute_pressure_batting_metrics(reconstructed_df)
    bat_merged = merge_batting_performance(bat_baselines, bat_pressure)
    bat_shrunk = apply_batting_shrinkage(bat_merged, k_balls=40.0)
    bat_final = compute_batting_reliability_score(bat_shrunk)

    # 3. Bowling Modeling
    print("\n[Step 3] Executing Bowling Modeling Pipeline...")
    bowl_baselines = compute_bowling_baselines(reconstructed_df)
    bowl_pressure = compute_pressure_bowling_metrics(reconstructed_df)
    bowl_merged = merge_bowling_performance(bowl_baselines, bowl_pressure)
    bowl_shrunk = apply_bowling_shrinkage(bowl_merged, k_balls=48.0)
    bowl_final = compute_bowling_reliability_score(bowl_shrunk)

    # 4. Official Top 10 Rankings
    print("\n[Step 4] Generating Official Top 10 Rankings...")
    top10_batters = generate_top_10_batters(
        bat_final, player_team_map, min_balls=80, min_matches=5
    )
    top10_bowlers = generate_top_10_bowlers(
        bowl_final, player_team_map, min_legal_balls=80, min_matches=5
    )

    print("\n>>> OFFICIAL TOP 10 BATTERS UNDER PRESSURE <<<")
    print(top10_batters[['rank', 'striker_name', 'primary_team', 'adjusted_pressure_strike_rate', 'overall_strike_rate', 'strike_rate_delta', 'pressure_balls_faced', 'pressure_reliability_score']].to_string(index=False))

    print("\n>>> OFFICIAL TOP 10 BOWLERS UNDER PRESSURE <<<")
    print(top10_bowlers[['rank', 'bowler_name', 'primary_team', 'adjusted_pressure_economy', 'overall_economy', 'delta_economy', 'pressure_wickets', 'pressure_legal_balls', 'pressure_reliability_score']].to_string(index=False))

    # 5. Automated Verification Tests (12 tests)
    print("\n[Step 5] Running 12 Automated Verification Tests...")
    test_results = run_phase2_tests(
        reconstructed_df, bat_final, bowl_final, top10_batters, top10_bowlers
    )
    all_tests_passed = all(t['passed'] for t in test_results.values())

    # 6. Save Processed Artifacts
    print("\n[Step 6] Saving CSV artifacts...")
    
    # 6a. Player Batting Baselines
    bat_base_path = os.path.join(PROCESSED_DIR, "player_batting_baselines.csv")
    bat_baselines.to_csv(bat_base_path, index=False)
    print(f"  -> Saved {bat_base_path} ({len(bat_baselines):,} rows)")

    # 6b. Player Bowling Baselines
    bowl_base_path = os.path.join(PROCESSED_DIR, "player_bowling_baselines.csv")
    bowl_baselines.to_csv(bowl_base_path, index=False)
    print(f"  -> Saved {bowl_base_path} ({len(bowl_baselines):,} rows)")

    # 6c. Player Pressure Batting Metrics (all merged + bayes)
    bat_press_path = os.path.join(PROCESSED_DIR, "player_pressure_batting_metrics.csv")
    bat_final.to_csv(bat_press_path, index=False)
    print(f"  -> Saved {bat_press_path} ({len(bat_final):,} rows)")

    # 6d. Player Pressure Bowling Metrics (all merged + bayes)
    bowl_press_path = os.path.join(PROCESSED_DIR, "player_pressure_bowling_metrics.csv")
    bowl_final.to_csv(bowl_press_path, index=False)
    print(f"  -> Saved {bowl_press_path} ({len(bowl_final):,} rows)")

    # 6e. Top 10 Pressure Batters
    top10_bat_path = os.path.join(PROCESSED_DIR, "top_10_pressure_batters.csv")
    top10_batters.to_csv(top10_bat_path, index=False)
    print(f"  -> Saved {top10_bat_path} (10 rows)")

    # 6f. Top 10 Pressure Bowlers
    top10_bowl_path = os.path.join(PROCESSED_DIR, "top_10_pressure_bowlers.csv")
    top10_bowlers.to_csv(top10_bowl_path, index=False)
    print(f"  -> Saved {top10_bowl_path} (10 rows)")

    # 7. Generate Methodology and Validation Reports
    print("\n[Step 7] Generating Documentation and Validation Reports...")
    
    # Validation Report Markdown
    val_md = f"""# SupeRR Selector 2.0 — Phase 2 Validation & Verification Report
**Rajasthan Royals | Round 1: Pressure Performance Intelligence Platform**  
*Execution Timestamp: {time.strftime('%Y-%m-%d %H:%M:%S')}*

---

## 1. Executive Summary & Test Verdict

| Metric | Status / Value |
| :--- | :--- |
| **Automated Verification Tests** | **{'12 / 12 PASSED (100%)' if all_tests_passed else 'SOME TESTS FAILED'}** |
| **Total Deliveries Audited** | **{len(reconstructed_df):,}** |
| **Unique Batters Evaluated** | **{len(bat_final):,}** |
| **Unique Bowlers Evaluated** | **{len(bowl_final):,}** |
| **Eligible Pressure Batters (≥80 balls, ≥5 matches)** | **{len(bat_final[(bat_final['pressure_balls_faced'] >= 80) & (bat_final['pressure_matches'] >= 5)]):,}** |
| **Eligible Pressure Bowlers (≥80 legal balls, ≥5 matches)** | **{len(bowl_final[(bowl_final['pressure_legal_balls'] >= 80) & (bowl_final['pressure_matches'] >= 5)]):,}** |
| **Shrinkage Methodology** | **Empirical Bayes (Prior Weight K_bat=40, K_bowl=48)** |
| **Processing Time** | **{time.time() - start_time:.2f} seconds** |

---

## 2. Exhaustive Verification Test Results

"""
    for test_name, t in test_results.items():
        status_badge = "✅ **PASSED**" if t['passed'] else "❌ **FAILED**"
        val_md += f"### {t['title']}\n- **Verdict**: {status_badge}\n- **Diagnostic Details**: {t['details']}\n\n"

    val_md += f"""---

## 3. Official Top 10 Batters Under Pressure Summary

| Rank | Player Name | Primary Team | Adj SR | Base SR | Press SR | Δ SR | Press Balls | Score | Tactical Role |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
"""
    for _, r in top10_batters.iterrows():
        val_md += f"| **{r['rank']}** | **{r['striker_name']}** | {r['primary_team']} | **{r['adjusted_pressure_strike_rate']:.1f}** | {r['overall_strike_rate']:.1f} | {r['pressure_strike_rate']:.1f} | **{r['strike_rate_delta']:+.1f}** | {r['pressure_balls_faced']} | **{r['pressure_reliability_score']:.1f}** | {r['tactical_role']} |\n"

    val_md += f"""

---

## 4. Official Top 10 Bowlers Under Pressure Summary

| Rank | Player Name | Primary Team | Adj Econ | Base Econ | Press Econ | Δ Econ | Wkts | Overs | Score | Tactical Role |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
"""
    for _, r in top10_bowlers.iterrows():
        val_md += f"| **{r['rank']}** | **{r['bowler_name']}** | {r['primary_team']} | **{r['adjusted_pressure_economy']:.2f}** | {r['overall_economy']:.2f} | {r['pressure_economy']:.2f} | **{r['delta_economy']:+.2f}** | **{r['pressure_wickets']}** | {r['pressure_overs']} | **{r['pressure_reliability_score']:.1f}** | {r['tactical_role']} |\n"

    val_md += f"""

---
*Report generated automatically by SupeRR Selector 2.0 Phase 2 Verification Suite.*
"""

    with open(os.path.join(PROCESSED_DIR, "phase2_validation_report.md"), "w", encoding="utf-8") as f:
        f.write(val_md)
    with open(os.path.join(REPORTS_DIR, "phase2_validation_report.md"), "w", encoding="utf-8") as f:
        f.write(val_md)
    print("  -> Saved phase2_validation_report.md in data/processed and reports/")

    # Methodology Report Markdown
    method_md = f"""# SupeRR Selector 2.0 — Phase 2 Methodology Report
## Player Baseline Modeling, Empirical Bayes Shrinkage & Pressure Reliability Scoring
**Rajasthan Royals | IPL 2027 Auction Analytics Strategy**  
*Document Version: 2.0.0 | Date: {time.strftime('%Y-%m-%d')}*

---

## 1. Mathematical Framework & Statistical Philosophy

Standard cricket statistics (such as raw Strike Rate or raw Economy Rate) suffer from severe sample size distortion when applied to sub-segments like match pressure:
1. **The Small Sample Fluke**: A batter facing 6 balls and hitting 16 runs has a raw Strike Rate of 266.7, but has near-zero predictive reliability in an IPL playoff.
2. **The High-Volume Penalty**: A finisher facing 600 pressure balls against elite death bowlers naturally experiences regression to the mean compared to an unproven cameo batter.
3. **The Baseline Context**: A player with an overall strike rate of 130 who hits at 165 under pressure (+35.0 delta) exhibits immense psychological resilience, whereas a player whose strike rate drops from 180 to 140 under pressure (-40.0 delta) is a liability when games are on the line.

To resolve these challenges with mathematical rigor, SupeRR Selector 2.0 deploys **Empirical Bayes Shrinkage** combined with a **Multi-Factor Composite Reliability Index**.

---

## 2. Empirical Bayes Shrinkage Formulation

In Bayesian estimation, an observed noisy rate $\\hat{{\\theta}}_i$ is pulled toward an informative prior $\\theta_{{0, i}}$:

$$\\tilde{{\\theta}}_i = w_i \\hat{{\\theta}}_i + (1 - w_i) \\theta_{{0, i}}$$

where the shrinkage weight $w_i$ is governed by the player's sample size $n_i$ and the prior sample strength parameter $K$:

$$w_i = \\frac{{n_i}}{{n_i + K}}$$

### Batting Strike Rate Shrinkage
- **Sample Size ($n_i$)**: Pressure balls faced by batter $i$ (strictly excluding wides).
- **Observed Rate ($\\hat{{\\theta}}_i$)**: Raw Pressure Strike Rate $= (\\text{{Runs}}_{{\\text{{press}}}} / n_i) \\times 100$.
- **Prior ($\\theta_{{0, i}}$)**: Player career/overall baseline strike rate.
- **Prior Strength ($K_{{\\text{{bat}}}}$)**: $40$ balls faced (equivalent to ~6.4 high-pressure overs).
- **Behavior**:
  - At $n = 40$ balls: $w = 0.50$ (50% pressure observation, 50% baseline anchor).
  - At $n = 120$ balls: $w = 0.75$ (75% pressure observation).
  - At $n = 500+$ balls: $w > 0.92$ (almost purely observed pressure performance).

### Bowling Economy Shrinkage
- **Sample Size ($B_i$)**: Pressure legal deliveries bowled by bowler $i$ (strictly excluding wides and oversteps).
- **Observed Rate ($\\hat{{\\theta}}_i$)**: Raw Pressure Economy Rate $= (\\text{{Runs Conceded}}_{{\\text{{press}}}} / B_i) \\times 6.0$.
- **Prior ($\\theta_{{0, i}}$)**: Player career/overall baseline economy rate.
- **Prior Strength ($K_{{\\text{{bowl}}}}$)**: $48$ legal deliveries (equivalent to 8.0 high-pressure overs).

---

## 3. Multi-Factor Composite Reliability Score (0 to 100)

### A. Batting Reliability Score Formulation
$$\\text{{Score}}_{{\\text{{bat}}}} = 0.40 \\cdot S_{{\\text{{adj\\_sr}}}} + 0.25 \\cdot S_{{\\Delta\\text{{sr}}}} + 0.20 \\cdot S_{{\\text{{boundary}}}} + 0.15 \\cdot S_{{\\text{{volume}}}}$$

1. **Adjusted Strike Rate ($S_{{\\text{{adj\\_sr}}}}$, 40% Weight)**:
   Measures absolute scoring efficiency after Bayesian shrinkage. Scaled from 110.0 (anchor) to 200.0.
   $$S_{{\\text{{adj\\_sr}}}} = \\text{{clip}}\\left(\\frac{{\\text{{Adj SR}} - 110.0}}{{200.0 - 110.0}} \\times 100, 0, 100\\right)$$

2. **Strike Rate Elevation Delta ($S_{{\\Delta\\text{{sr}}}}$, 25% Weight)**:
   Quantifies psychological fortitude: $\\Delta\\text{{SR}} = \\text{{Pressure SR}} - \\text{{Overall SR}}$.
   $$S_{{\\Delta\\text{{sr}}}} = \\text{{clip}}\\left(\\frac{{\\Delta\\text{{SR}} + 15.0}}{{30.0 - (-15.0)}} \\times 100, 0, 100\\right)$$

3. **Pressure Boundary Capability ($S_{{\\text{{boundary}}}}$, 20% Weight)**:
   Measures boundary generation under pressure ($(\\text{{Boundary Runs}} / \\text{{Pressure Runs}}) \\times 100$). Scaled between 30% and 80%.

4. **Volume Confidence ($S_{{\\text{{volume}}}}$, 15% Weight)**:
   $$S_{{\\text{{volume}}}} = \\text{{clip}}\\left(\\sqrt{{\\frac{{n_i}}{{400}}}} \\times 100, 0, 100\\right)$$

---

### B. Bowling Reliability Score Formulation
$$\\text{{Score}}_{{\\text{{bowl}}}} = 0.40 \\cdot S_{{\\text{{adj\\_econ}}}} + 0.25 \\cdot S_{{\\Delta\\text{{econ}}}} + 0.20 \\cdot S_{{\\text{{wickets}}}} + 0.15 \\cdot S_{{\\text{{volume}}}}$$

1. **Adjusted Pressure Economy ($S_{{\\text{{adj\\_econ}}}}$, 40% Weight)**:
   Lower economy indicates superior containment. Scaled from 12.00 (heavy leakage) to 6.00 (world-class choke).
   $$S_{{\\text{{adj\\_econ}}}} = \\text{{clip}}\\left(\\frac{{12.00 - \\text{{Adj Econ}}}}{{12.00 - 6.00}} \\times 100, 0, 100\\right)$$

2. **Economy Resilience ($S_{{\\Delta\\text{{econ}}}}$, 25% Weight)**:
   Measures ability to prevent economy escalation: $\\text{{Improvement}} = \\text{{Overall Econ}} - \\text{{Pressure Econ}}$.
   Scaled between -2.00 and +2.00.

3. **Pressure Wicket Threat ($S_{{\\text{{wickets}}}}$, 20% Weight)**:
   Pressure wickets per legal delivery. Scaled from 0.00 to 0.08 (1 wicket per 12 balls / 2 overs).

4. **Volume Confidence ($S_{{\\text{{volume}}}}$, 15% Weight)**:
   $$S_{{\\text{{volume}}}} = \\text{{clip}}\\left(\\sqrt{{\\frac{{B_i}}{{400}}}} \\times 100, 0, 100\\right)$$

---

## 4. Strict Cricket Accounting Rules Enforced

1. **Balls Faced**:
   - Only deliveries where `extras_type != 'wide'` count as balls faced by the batter.
   - Oversteps / No-balls count as balls faced by the batter.
2. **Bowler Deliveries & Runs Conceded**:
   - Bowler legal deliveries count when `is_legal_delivery == True` (excluding wides and oversteps).
   - Runs conceded include off-the-bat runs, wides, and no-balls (`bowler_runs_conceded`).
   - Byes and Leg-Byes are strictly excluded from bowler charges.
3. **Bowler Dismissals**:
   - Only Bowled (1), Caught (2), LBW (3), Stumped (5), and Hit-Wicket (6) count toward bowler wickets.
   - Run-Outs (4) and non-bowler dismissals are excluded.
4. **Zero-Division Protection**:
   - All rates implement safe denominator guards preventing runtime crashes on 0 balls or 0 wickets.

---

## 5. Official Deliverables & Rankings

### Top 10 Batters Under Pressure
"""
    for _, r in top10_batters.iterrows():
        method_md += f"{r['rank']}. **{r['striker_name']}** ({r['primary_team']}) — Adj SR: **{r['adjusted_pressure_strike_rate']:.1f}** | Δ SR: **{r['strike_rate_delta']:+.1f}** | Score: **{r['pressure_reliability_score']:.1f}** | *{r['tactical_role']}*\n"

    method_md += f"""

### Top 10 Bowlers Under Pressure
"""
    for _, r in top10_bowlers.iterrows():
        method_md += f"{r['rank']}. **{r['bowler_name']}** ({r['primary_team']}) — Adj Econ: **{r['adjusted_pressure_economy']:.2f}** | Δ Econ: **{r['delta_economy']:+.2f}** | Score: **{r['pressure_reliability_score']:.1f}** | Wkts: **{r['pressure_wickets']}** | *{r['tactical_role']}*\n"

    method_md += f"""

---
*Report generated for Rajasthan Royals IPL 2027 Auction Strategy.*
"""

    with open(os.path.join(PROCESSED_DIR, "phase2_methodology.md"), "w", encoding="utf-8") as f:
        f.write(method_md)
    with open(os.path.join(REPORTS_DIR, "phase2_methodology.md"), "w", encoding="utf-8") as f:
        f.write(method_md)
    print("  -> Saved phase2_methodology.md in data/processed and reports/")

    elapsed = time.time() - start_time
    print(f"\n[Done] Phase 2 completed successfully in {elapsed:.2f} seconds!")

if __name__ == "__main__":
    main()
