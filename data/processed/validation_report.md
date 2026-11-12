# SupeRR Selector 2.0 — Match-State Reconstruction & Validation Report
**Rajasthan Royals | Round 1: Pressure Performance Intelligence Platform**  
*Execution Timestamp: 2026-11-12 19:30:52*

---

## 1. Executive Summary & Processing Scope

The **Match-State Reconstruction Engine** has processed all historical ball-by-ball delivery telemetry from 2022 onwards, calculating exact pre-ball match situations and dual pressure classifications without lookahead bias.

- **Total Matches in Corpus:** 883
- **Matches Processed (with delivery logs):** 867
- **Total Deliveries Processed:** 200,999
- **Total In-Match Innings Tracked:** 1,724
- **Batting Pressure Deliveries:** 85,532 (42.55% of total deliveries)
- **Bowling Pressure Deliveries:** 51,138 (25.44% of total deliveries)
- **Automated Validation Tests:** 10 of 10 Passed (100% Verification Rate)

---

## 2. Automated Test Suite Results

All 10 automated cricket accounting and zero-leakage tests passed successfully:

| Test ID | Test Description | Status | Verification Detail |
| :--- | :--- | :--- | :--- |
| `T01_Innings_State_Reset` | T01 Innings State Reset | ✅ PASSED | Checked 1724 innings starts. All pre_score, pre_wickets, pre_legal_balls == 0. |
| `T02_Legal_Ball_Monotonicity` | T02 Legal Ball Monotonicity | ✅ PASSED | pre_legal_balls is monotonic non-decreasing in 100% of rows (negative diffs: 0). |
| `T03_Wicket_Monotonicity` | T03 Wicket Monotonicity | ✅ PASSED | pre_wickets is monotonic non-decreasing in 100% of rows (negative diffs: 0). |
| `T04_Illegal_Deliveries_Accounting` | T04 Illegal Deliveries Accounting | ✅ PASSED | 100% of 7714 wides and 576 oversteps classified as is_legal_delivery == False. |
| `T05_RunOut_Bowler_Wicket_Exclusion` | T05 RunOut Bowler Wicket Exclusion | ✅ PASSED | 100% of 600 RunOut dismissals excluded from is_bowler_wicket. |
| `T06_Innings1_Target_Nullity` | T06 Innings1 Target Nullity | ✅ PASSED | 100% of 105,727 Innings 1 rows have target == NaN (no target leakage). |
| `T07_Innings2_Target_Validity` | T07 Innings2 Target Validity | ✅ PASSED | 100% of 95,234 Innings 2 rows have target > 0. |
| `T08_Revised_Target_Consistency` | T08 Revised Target Consistency | ✅ PASSED | DLS / revised target matches match official revised_target in 100% of checked rows (1641 rows across 23 matches). |
| `T09_Runs_Required_Arithmetic` | T09 Runs Required Arithmetic | ✅ PASSED | runs_required exactly equals max(0, target - pre_score) across all 95,234 Innings 2 rows. |
| `T10_Pressure_Scores_Bounded` | T10 Pressure Scores Bounded | ✅ PASSED | 100% of batting and bowling pressure scores strictly bounded within [0.0, 1.0]. |

---

## 3. Pressure Classification Distribution

### A. Batting Situational Pressure Breakdown
| Category | Deliveries | % of Total | Description |
| :--- | :--- | :--- | :--- |
| **Normal** | 115,467 | 57.45% | Batting under normal |
| **Chasing High RRR** | 38,839 | 19.32% | Batting under chasing high rrr |
| **Death Overs Acceleration** | 23,669 | 11.78% | Batting under death overs acceleration |
| **Chasing Escalating RRR** | 9,590 | 4.77% | Batting under chasing escalating rrr |
| **Middle Collapse Recovery** | 6,714 | 3.34% | Batting under middle collapse recovery |
| **Powerplay Collapse** | 2,093 | 1.04% | Batting under powerplay collapse |
| **Final Overs Climax** | 1,693 | 0.84% | Batting under final overs climax |
| **Death Chase Crunch** | 1,623 | 0.81% | Batting under death chase crunch |
| **Chasing Wicket Crisis** | 1,273 | 0.63% | Batting under chasing wicket crisis |
| **Super Over Climax** | 38 | 0.02% | Batting under super over climax |

### B. Bowling Situational Pressure Breakdown
| Category | Deliveries | % of Total | Description |
| :--- | :--- | :--- | :--- |
| **Normal** | 149,861 | 74.56% | Bowling under normal |
| **Death Overs Execution** | 21,613 | 10.75% | Bowling under death overs execution |
| **Middle Overs Containment** | 11,192 | 5.57% | Bowling under middle overs containment |
| **Death Overs Defense** | 9,739 | 4.85% | Bowling under death overs defense |
| **Powerplay Assault Control** | 7,183 | 3.57% | Bowling under powerplay assault control |
| **Final Overs Climax** | 1,373 | 0.68% | Bowling under final overs climax |
| **Super Over Climax** | 38 | 0.02% | Bowling under super over climax |

---

## 4. Sample Reconstructed Match States

Below is a verified sample sequence from Match 13511 (Innings 2, Chasing 104):

```
 innings  overid  over_ball_num striker_name      bowler_name  pre_score  pre_wickets  pre_legal_balls  balls_remaining  target  runs_required  current_run_rate  required_run_rate  is_pressure_batting  is_pressure_bowling  runs  extra_runs  is_wicket
       1       1              1    Jason Roy Sheldon Cottrell          0            0                0              120     NaN            NaN             0.000                NaN                False                False     0           0      False
       1       1              2    Jason Roy Sheldon Cottrell          0            0                1              119     NaN            NaN             0.000                NaN                False                False     0           0      False
       1       1              3    Jason Roy Sheldon Cottrell          0            0                2              118     NaN            NaN             0.000                NaN                False                False     0           0      False
       1       1              4    Jason Roy Sheldon Cottrell          0            0                3              117     NaN            NaN             0.000                NaN                False                False     0           0      False
       1       1              5    Jason Roy Sheldon Cottrell          0            0                4              116     NaN            NaN             0.000                NaN                False                False     6           0      False
       1       1              6    Jason Roy Sheldon Cottrell          6            0                5              115     NaN            NaN             7.200                NaN                False                False     0           0       True
       1       2              1   Tom Banton     Jason Holder          6            1                6              114     NaN            NaN             6.000                NaN                False                False     0           0      False
       1       2              2   Tom Banton     Jason Holder          6            1                7              113     NaN            NaN             5.143                NaN                False                False     0           0      False
```

---

## 5. Artifact Directory Inventory

The following processed artifacts have been generated in `data/processed/`:
1. `reconstructed_match_states.csv` (49.3 MB) — Full pre-ball telemetry for 200,999 deliveries.
2. `batting_pressure_deliveries.csv` (21.8 MB) — Isolated high-pressure batting subset.
3. `bowling_pressure_deliveries.csv` (13.3 MB) — Isolated high-pressure bowling subset.
4. `pressure_distribution.csv` — Situational category counts and shares.
5. `validation_report.md` — Complete verification audit.

---
*Generated by SupeRR Selector 2.0 Match-State Reconstruction Engine.*
