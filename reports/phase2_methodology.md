# SupeRR Selector 2.0 — Phase 2 Methodology Report
## Player Baseline Modeling, Empirical Bayes Shrinkage & Pressure Reliability Scoring
**Rajasthan Royals | IPL 2027 Auction Analytics Strategy**  
*Document Version: 2.0.0 | Date: 2026-11-12*

---

## 1. Mathematical Framework & Statistical Philosophy

Standard cricket statistics (such as raw Strike Rate or raw Economy Rate) suffer from severe sample size distortion when applied to sub-segments like match pressure:
1. **The Small Sample Fluke**: A batter facing 6 balls and hitting 16 runs has a raw Strike Rate of 266.7, but has near-zero predictive reliability in an IPL playoff.
2. **The High-Volume Penalty**: A finisher facing 600 pressure balls against elite death bowlers naturally experiences regression to the mean compared to an unproven cameo batter.
3. **The Baseline Context**: A player with an overall strike rate of 130 who hits at 165 under pressure (+35.0 delta) exhibits immense psychological resilience, whereas a player whose strike rate drops from 180 to 140 under pressure (-40.0 delta) is a liability when games are on the line.

To resolve these challenges with mathematical rigor, SupeRR Selector 2.0 deploys **Empirical Bayes Shrinkage** combined with a **Multi-Factor Composite Reliability Index**.

---

## 2. Empirical Bayes Shrinkage Formulation

In Bayesian estimation, an observed noisy rate $\hat{\theta}_i$ is pulled toward an informative prior $\theta_{0, i}$:

$$\tilde{\theta}_i = w_i \hat{\theta}_i + (1 - w_i) \theta_{0, i}$$

where the shrinkage weight $w_i$ is governed by the player's sample size $n_i$ and the prior sample strength parameter $K$:

$$w_i = \frac{n_i}{n_i + K}$$

### Batting Strike Rate Shrinkage
- **Sample Size ($n_i$)**: Pressure balls faced by batter $i$ (strictly excluding wides).
- **Observed Rate ($\hat{\theta}_i$)**: Raw Pressure Strike Rate $= (\text{Runs}_{\text{press}} / n_i) \times 100$.
- **Prior ($\theta_{0, i}$)**: Player career/overall baseline strike rate.
- **Prior Strength ($K_{\text{bat}}$)**: $40$ balls faced (equivalent to ~6.4 high-pressure overs).
- **Behavior**:
  - At $n = 40$ balls: $w = 0.50$ (50% pressure observation, 50% baseline anchor).
  - At $n = 120$ balls: $w = 0.75$ (75% pressure observation).
  - At $n = 500+$ balls: $w > 0.92$ (almost purely observed pressure performance).

### Bowling Economy Shrinkage
- **Sample Size ($B_i$)**: Pressure legal deliveries bowled by bowler $i$ (strictly excluding wides and oversteps).
- **Observed Rate ($\hat{\theta}_i$)**: Raw Pressure Economy Rate $= (\text{Runs Conceded}_{\text{press}} / B_i) \times 6.0$.
- **Prior ($\theta_{0, i}$)**: Player career/overall baseline economy rate.
- **Prior Strength ($K_{\text{bowl}}$)**: $48$ legal deliveries (equivalent to 8.0 high-pressure overs).

---

## 3. Multi-Factor Composite Reliability Score (0 to 100)

### A. Batting Reliability Score Formulation
$$\text{Score}_{\text{bat}} = 0.40 \cdot S_{\text{adj\_sr}} + 0.25 \cdot S_{\Delta\text{sr}} + 0.20 \cdot S_{\text{boundary}} + 0.15 \cdot S_{\text{volume}}$$

1. **Adjusted Strike Rate ($S_{\text{adj\_sr}}$, 40% Weight)**:
   Measures absolute scoring efficiency after Bayesian shrinkage. Scaled from 110.0 (anchor) to 200.0.
   $$S_{\text{adj\_sr}} = \text{clip}\left(\frac{\text{Adj SR} - 110.0}{200.0 - 110.0} \times 100, 0, 100\right)$$

2. **Strike Rate Elevation Delta ($S_{\Delta\text{sr}}$, 25% Weight)**:
   Quantifies psychological fortitude: $\Delta\text{SR} = \text{Pressure SR} - \text{Overall SR}$.
   $$S_{\Delta\text{sr}} = \text{clip}\left(\frac{\Delta\text{SR} + 15.0}{30.0 - (-15.0)} \times 100, 0, 100\right)$$

3. **Pressure Boundary Capability ($S_{\text{boundary}}$, 20% Weight)**:
   Measures boundary generation under pressure ($(\text{Boundary Runs} / \text{Pressure Runs}) \times 100$). Scaled between 30% and 80%.

4. **Volume Confidence ($S_{\text{volume}}$, 15% Weight)**:
   $$S_{\text{volume}} = \text{clip}\left(\sqrt{\frac{n_i}{400}} \times 100, 0, 100\right)$$

---

### B. Bowling Reliability Score Formulation
$$\text{Score}_{\text{bowl}} = 0.40 \cdot S_{\text{adj\_econ}} + 0.25 \cdot S_{\Delta\text{econ}} + 0.20 \cdot S_{\text{wickets}} + 0.15 \cdot S_{\text{volume}}$$

1. **Adjusted Pressure Economy ($S_{\text{adj\_econ}}$, 40% Weight)**:
   Lower economy indicates superior containment. Scaled from 12.00 (heavy leakage) to 6.00 (world-class choke).
   $$S_{\text{adj\_econ}} = \text{clip}\left(\frac{12.00 - \text{Adj Econ}}{12.00 - 6.00} \times 100, 0, 100\right)$$

2. **Economy Resilience ($S_{\Delta\text{econ}}$, 25% Weight)**:
   Measures ability to prevent economy escalation: $\text{Improvement} = \text{Overall Econ} - \text{Pressure Econ}$.
   Scaled between -2.00 and +2.00.

3. **Pressure Wicket Threat ($S_{\text{wickets}}$, 20% Weight)**:
   Pressure wickets per legal delivery. Scaled from 0.00 to 0.08 (1 wicket per 12 balls / 2 overs).

4. **Volume Confidence ($S_{\text{volume}}$, 15% Weight)**:
   $$S_{\text{volume}} = \text{clip}\left(\sqrt{\frac{B_i}{400}} \times 100, 0, 100\right)$$

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
1. **Naman Dhir** (Mumbai Indians) — Adj SR: **189.2** | Δ SR: **+23.5** | Score: **86.8** | *Elite Finisher / Power Accelerator*
2. **Yashasvi Jaiswal** (Rajasthan Royals) — Adj SR: **177.8** | Δ SR: **+23.9** | Score: **85.8** | *Elite Finisher / Power Accelerator*
3. **Rishabh Pant** (Delhi Capitals) — Adj SR: **172.8** | Δ SR: **+32.3** | Score: **84.6** | *High-Elevation Pressure Rescuer*
4. **Prabhsimran Singh** (Punjab Kings) — Adj SR: **179.1** | Δ SR: **+21.6** | Score: **83.3** | *Elite Finisher / Power Accelerator*
5. **Tim David** (Mumbai Indians) — Adj SR: **189.3** | Δ SR: **+12.2** | Score: **82.6** | *Dynamic Powerhitter*
6. **Suryakumar Yadav** (Mumbai Indians) — Adj SR: **180.3** | Δ SR: **+14.5** | Score: **79.6** | *Dynamic Powerhitter*
7. **Paul Stirling** (Ireland) — Adj SR: **169.8** | Δ SR: **+39.9** | Score: **79.5** | *High-Elevation Pressure Rescuer*
8. **Priyansh Arya** (Punjab Kings) — Adj SR: **197.2** | Δ SR: **+9.1** | Score: **79.4** | *Dynamic Powerhitter*
9. **Ryan Rickelton** (Mumbai Indians) — Adj SR: **173.8** | Δ SR: **+18.4** | Score: **78.4** | *High-Elevation Pressure Rescuer*
10. **Virat Kohli** (Royal Challengers Bengaluru) — Adj SR: **168.5** | Δ SR: **+24.9** | Score: **77.8** | *High-Elevation Pressure Rescuer*


### Top 10 Bowlers Under Pressure
1. **Sunil Narine** (Kolkata Knight Riders) — Adj Econ: **6.52** | Δ Econ: **-0.38** | Score: **80.2** | Wkts: **20.0** | *World-Class Pressure Lock / Restrictor*
2. **Sufiyan Muqeem** (Pakistan) — Adj Econ: **6.04** | Δ Econ: **+0.07** | Score: **76.5** | Wkts: **6.0** | *World-Class Pressure Lock / Restrictor*
3. **Mohammad Nawaz** (Pakistan) — Adj Econ: **6.17** | Δ Econ: **-1.23** | Score: **76.3** | Wkts: **5.0** | *World-Class Pressure Lock / Restrictor*
4. **Moeen Ali** (Chennai Super Kings) — Adj Econ: **7.33** | Δ Econ: **-1.08** | Score: **76.1** | Wkts: **12.0** | *High-Stress Tightener*
5. **Haris Rauf** (Pakistan) — Adj Econ: **8.34** | Δ Econ: **-0.28** | Score: **73.7** | Wkts: **37.0** | *Elite High-Volume Wicket Striker*
6. **Mujeeb Ur Rahman** (Kolkata Knight Riders) — Adj Econ: **7.19** | Δ Econ: **+0.25** | Score: **72.7** | Wkts: **14.0** | *Squeeze Specialist / Middle Choker*
7. **Rashid Khan** (Gujarat Titans) — Adj Econ: **7.91** | Δ Econ: **+0.55** | Score: **71.3** | Wkts: **55.0** | *Elite High-Volume Wicket Striker*
8. **Rehan Ahmed** (Delhi Capitals) — Adj Econ: **8.60** | Δ Econ: **-1.42** | Score: **71.0** | Wkts: **8.0** | *High-Stress Tightener*
9. **Ehsan Khan** (Hong Kong) — Adj Econ: **7.31** | Δ Econ: **+0.38** | Score: **68.6** | Wkts: **11.0** | *Squeeze Specialist / Middle Choker*
10. **Sikandar Raza** (Punjab Kings) — Adj Econ: **7.14** | Δ Econ: **+0.08** | Score: **68.3** | Wkts: **13.0** | *Squeeze Specialist / Middle Choker*


---
*Report generated for Rajasthan Royals IPL 2027 Auction Strategy.*
