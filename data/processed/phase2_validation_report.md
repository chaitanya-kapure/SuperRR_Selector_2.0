# SupeRR Selector 2.0 — Phase 2 Validation & Verification Report
**Rajasthan Royals | Round 1: Pressure Performance Intelligence Platform**  
*Execution Timestamp: 2026-11-12 19:59:19*

---

## 1. Executive Summary & Test Verdict

| Metric | Status / Value |
| :--- | :--- |
| **Automated Verification Tests** | **12 / 12 PASSED (100%)** |
| **Total Deliveries Audited** | **200,999** |
| **Unique Batters Evaluated** | **888** |
| **Unique Bowlers Evaluated** | **647** |
| **Eligible Pressure Batters (≥80 balls, ≥5 matches)** | **255** |
| **Eligible Pressure Bowlers (≥80 legal balls, ≥5 matches)** | **172** |
| **Shrinkage Methodology** | **Empirical Bayes (Prior Weight K_bat=40, K_bowl=48)** |
| **Processing Time** | **18.26 seconds** |

---

## 2. Exhaustive Verification Test Results

### Test 1: Batting Ball Accounting (Wides Excluded from Balls Faced)
- **Verdict**: ✅ **PASSED**
- **Diagnostic Details**: Total deliveries: 200,999, Wides: 7,714. Expected balls faced: 193,285, Actual: 193,285 (Diff: 0)

### Test 2: Batting Run Conservation
- **Verdict**: ✅ **PASSED**
- **Diagnostic Details**: Dataset off-bat runs: 269,549, Aggregated player runs: 269,549 (Diff: 0)

### Test 3: Batting Strike Rate Mathematical Validity
- **Verdict**: ✅ **PASSED**
- **Diagnostic Details**: Checked 888 batters. Maximum SR formula discrepancy: 0.0000

### Test 4: Bowling Legal Ball Accounting
- **Verdict**: ✅ **PASSED**
- **Diagnostic Details**: Dataset legal deliveries: 192,708, Aggregated bowler legal balls: 192,708 (Diff: 0)

### Test 5: Bowling Runs Conceded Accounting (Byes/Legbyes excluded)
- **Verdict**: ✅ **PASSED**
- **Diagnostic Details**: Dataset bowler runs conceded: 278,187, Aggregated bowler runs: 278,187 (Diff: 0)

### Test 6: Bowling Economy Rate Mathematical Validity
- **Verdict**: ✅ **PASSED**
- **Diagnostic Details**: Checked 647 bowlers. Maximum economy formula discrepancy: 0.0000

### Test 7: Bowler Wickets Accounting (Run-outs excluded)
- **Verdict**: ✅ **PASSED**
- **Diagnostic Details**: Dataset bowler dismissals: 10,272, Aggregated bowler wickets: 10,272 (Diff: 0)

### Test 8: Zero-Division & Edge-Case Protection
- **Verdict**: ✅ **PASSED**
- **Diagnostic Details**: All derived metrics safely handle zero balls faced, zero legal balls, and zero wickets with np.nan / fillna.

### Test 9: Performance Delta Mathematical Identity
- **Verdict**: ✅ **PASSED**
- **Diagnostic Details**: Max bat delta discrepancy: 0.0000, Max bowl delta discrepancy: 0.0000

### Test 10: Empirical Bayes Shrinkage Boundedness
- **Verdict**: ✅ **PASSED**
- **Diagnostic Details**: Batting adjusted values bounded: True, Bowling adjusted values bounded: True.

### Test 11: Eligibility Threshold Enforcement
- **Verdict**: ✅ **PASSED**
- **Diagnostic Details**: Batters min balls/matches >= (80, 5): True/True; Bowlers min balls/matches >= (80, 5): True/True.

### Test 12: Ranking Uniqueness, Completeness & Monotonic Order
- **Verdict**: ✅ **PASSED**
- **Diagnostic Details**: Batters: 10 unique (True), sorted (True); Bowlers: 10 unique (True), sorted (True).

---

## 3. Official Top 10 Batters Under Pressure Summary

| Rank | Player Name | Primary Team | Adj SR | Base SR | Press SR | Δ SR | Press Balls | Score | Tactical Role |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **1** | **Naman Dhir** | Mumbai Indians | **189.2** | 168.4 | 191.9 | **+23.5** | 298.0 | **86.8** | Elite Finisher / Power Accelerator |
| **2** | **Yashasvi Jaiswal** | Rajasthan Royals | **177.8** | 156.4 | 180.2 | **+23.9** | 354.0 | **85.8** | Elite Finisher / Power Accelerator |
| **3** | **Rishabh Pant** | Delhi Capitals | **172.8** | 143.1 | 175.3 | **+32.3** | 466.0 | **84.6** | High-Elevation Pressure Rescuer |
| **4** | **Prabhsimran Singh** | Punjab Kings | **179.1** | 160.2 | 181.8 | **+21.6** | 275.0 | **83.3** | Elite Finisher / Power Accelerator |
| **5** | **Tim David** | Mumbai Indians | **189.3** | 177.7 | 189.9 | **+12.2** | 762.0 | **82.6** | Dynamic Powerhitter |
| **6** | **Suryakumar Yadav** | Mumbai Indians | **180.3** | 166.4 | 180.9 | **+14.5** | 994.0 | **79.6** | Dynamic Powerhitter |
| **7** | **Paul Stirling** | Ireland | **169.8** | 140.4 | 180.4 | **+39.9** | 112.0 | **79.5** | High-Elevation Pressure Rescuer |
| **8** | **Priyansh Arya** | Punjab Kings | **197.2** | 190.9 | 200.0 | **+9.1** | 93.0 | **79.4** | Dynamic Powerhitter |
| **9** | **Ryan Rickelton** | Mumbai Indians | **173.8** | 157.6 | 176.0 | **+18.4** | 296.0 | **78.4** | High-Elevation Pressure Rescuer |
| **10** | **Virat Kohli** | Royal Challengers Bengaluru | **168.5** | 145.2 | 170.1 | **+24.9** | 566.0 | **77.8** | High-Elevation Pressure Rescuer |


---

## 4. Official Top 10 Bowlers Under Pressure Summary

| Rank | Player Name | Primary Team | Adj Econ | Base Econ | Press Econ | Δ Econ | Wkts | Overs | Score | Tactical Role |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **1** | **Sunil Narine** | Kolkata Knight Riders | **6.52** | 6.85 | 6.47 | **-0.38** | **20.0** | 55.0 | **80.2** | World-Class Pressure Lock / Restrictor |
| **2** | **Sufiyan Muqeem** | Pakistan | **6.04** | 6.00 | 6.07 | **+0.07** | **6.0** | 14.0 | **76.5** | World-Class Pressure Lock / Restrictor |
| **3** | **Mohammad Nawaz** | Pakistan | **6.17** | 7.12 | 5.89 | **-1.23** | **5.0** | 27.0 | **76.3** | World-Class Pressure Lock / Restrictor |
| **4** | **Moeen Ali** | Chennai Super Kings | **7.33** | 8.20 | 7.12 | **-1.08** | **12.0** | 33.0 | **76.1** | High-Stress Tightener |
| **5** | **Haris Rauf** | Pakistan | **8.34** | 8.59 | 8.31 | **-0.28** | **37.0** | 67.8 | **73.7** | Elite High-Volume Wicket Striker |
| **6** | **Mujeeb Ur Rahman** | Kolkata Knight Riders | **7.19** | 7.00 | 7.25 | **+0.25** | **14.0** | 28.0 | **72.7** | Squeeze Specialist / Middle Choker |
| **7** | **Rashid Khan** | Gujarat Titans | **7.91** | 7.40 | 7.95 | **+0.55** | **55.0** | 111.3 | **71.3** | Elite High-Volume Wicket Striker |
| **8** | **Rehan Ahmed** | Delhi Capitals | **8.60** | 9.51 | 8.09 | **-1.42** | **8.0** | 14.3 | **71.0** | High-Stress Tightener |
| **9** | **Ehsan Khan** | Hong Kong | **7.31** | 7.02 | 7.40 | **+0.38** | **11.0** | 25.7 | **68.6** | Squeeze Specialist / Middle Choker |
| **10** | **Sikandar Raza** | Punjab Kings | **7.14** | 7.07 | 7.15 | **+0.08** | **13.0** | 48.7 | **68.3** | Squeeze Specialist / Middle Choker |


---
*Report generated automatically by SupeRR Selector 2.0 Phase 2 Verification Suite.*
