# SupeRR Selector 2.0 — Deliverable C: Complete Analytical Framework & Mathematical Methodology
## Pressure Performance Modeling, Bayesian Shrinkage & Cross-Format Normalization

**Organization:** Rajasthan Royals — SupeRR Selector 2.0 Competition  
**Document Classification:** Official Technical Whitepaper & Methodology Reference  
**Corpus Scope:** 883 Matches (371 IPL, 482 T20I), 200,999 Deliveries, 1,217 Mapped Players (2022–2026)  

---

## 1. Problem Formulation & Theoretical Foundations

Traditional cricket statistics (batting average, strike rate, bowling economy, bowling average) aggregate events indiscriminately across disparate match contexts. A run scored when needing 25 off 6 balls in an IPL playoff chase is statistically equated to a run scored when needing 40 off 80 balls in a dead rubber.

To identify the **Most Reliable Players Under Pressure**, SupeRR Selector 2.0 formalizes a four-stage analytical pipeline:
1. **Temporal Match-State Reconstruction**: Computing the exact match situation immediately prior to each delivery without lookahead bias.
2. **Contextual Pressure Classification**: Partitioning deliveries into high-pressure and normal subsets based on situational leverage.
3. **Player-Level Baseline vs Pressure Profiling**: Measuring individual performance shifts ($\Delta$) under pressure relative to career norms.
4. **Empirical Bayes Shrinkage & Composite Reliability Scoring**: Regularizing small-sample volatility and synthesizing multi-dimensional performance into an interpretable 0–100 index.

---

## 2. Temporal Match-State Reconstruction Engine

Let delivery index $t \in \{1, 2, \dots, N_m\}$ represent the sequence of deliveries in innings $i$ of match $m$.

### 2.1 State Variables
At delivery $t$, the pre-delivery state vector $\mathbf{S}_t$ is defined strictly as a function of deliveries $1, 2, \dots, t-1$:

$$\mathbf{S}_t = \begin{bmatrix}
\text{pre\_score}_t \\
\text{pre\_wickets}_t \\
\text{pre\_legal\_balls}_t \\
\text{balls\_remaining}_t \\
\text{target}_m \\
\text{runs\_required}_t \\
\text{CRR}_t \\
\text{RRR}_t
\end{bmatrix}$$

### 2.2 Shifted Cumulative Accounting
To guarantee zero lookahead bias, accounting operators are applied to previous deliveries:

$$\text{pre\_score}_t = \begin{cases} 
0, & \text{if } t = 1 \\
\sum_{k=1}^{t-1} \text{total\_runs}_k, & \text{if } t > 1 
\end{cases}$$

$$\text{pre\_wickets}_t = \begin{cases} 
0, & \text{if } t = 1 \\
\sum_{k=1}^{t-1} \mathbb{I}(\text{is\_wicket}_k), & \text{if } t > 1 
\end{cases}$$

$$\text{pre\_legal\_balls}_t = \begin{cases} 
0, & \text{if } t = 1 \\
\sum_{k=1}^{t-1} \mathbb{I}(\text{is\_legal\_delivery}_k), & \text{if } t > 1 
\end{cases}$$

Where:
- $\text{total\_runs}_k = \text{runs}_k + \text{extras\_2\_runs}_k$
- $\mathbb{I}(\text{is\_legal\_delivery}_k) = \mathbb{I}(\text{extras\_type}_k \notin \{\text{'wide'}, \text{'no ball'}\})$

### 2.3 Chase Dynamics (Innings 2)
In the second innings:
- $\text{target}_m = \text{final\_score}_{\text{Innings 1}} + 1$ (or DLS revised target from official match metadata).
- $\text{runs\_required}_t = \max(0, \text{target}_m - \text{pre\_score}_t)$.
- $\text{balls\_remaining}_t = \max(0, 120 - \text{pre\_legal\_balls}_t)$.
- $\text{CRR}_t = \frac{\text{pre\_score}_t}{\max(1, \text{pre\_legal\_balls}_t)} \times 6.0$.
- $\text{RRR}_t = \begin{cases} 
\frac{\text{runs\_required}_t}{\text{balls\_remaining}_t} \times 6.0, & \text{if } \text{balls\_remaining}_t > 0 \\
\infty, & \text{if } \text{balls\_remaining}_t = 0 \text{ and } \text{runs\_required}_t > 0
\end{cases}$

---

## 3. Bifurcated Pressure Classification Logic

Pressure is not symmetric between batters and bowlers, nor is it symmetric between setting a total (Innings 1) and chasing a target (Innings 2).

### 3.1 Batting Pressure Function
A delivery $t$ qualifies as high pressure for the striker if:

$$\mathcal{P}_{\text{bat}}(t) = \begin{cases}
1, & \text{if } \text{Innings} = 2 \text{ and } \left( \text{RRR}_t \ge 9.0 \;\lor\; (\text{RRR}_t - \text{CRR}_t \ge 2.0) \;\lor\; (\text{over}_t \ge 16 \land \text{wickets\_left}_t \le 5) \right) \\
1, & \text{if } \text{Innings} = 1 \text{ and } \left( \text{over}_t \ge 16 \;\lor\; (\text{pre\_score}_t \le 40 \land \text{pre\_wickets}_t \ge 3) \right) \\
0, & \text{otherwise}
\end{cases}$$

### 3.2 Bowling Pressure Function
A delivery $t$ qualifies as high pressure for the bowler if:

$$\mathcal{P}_{\text{bowl}}(t) = \begin{cases}
1, & \text{if } \text{Innings} = 2 \text{ and } \left( \text{RRR}_t \le 9.5 \;\lor\; (\text{over}_t \ge 16 \land \text{margin}_t < 24) \right) \\
1, & \text{if } \text{Innings} = 1 \text{ and } \text{over}_t \ge 16 \\
0, & \text{otherwise}
\end{cases}$$

---

## 4. Cricket Accounting Conventions

To conform with official ICC and IPL playing conditions, strict ball and run allocation rules are enforced:

1. **Batter Balls Faced**:
   $$\text{Balls Faced} = \sum_{k} \mathbb{I}(\text{extras\_type}_k \ne \text{'wide'})$$
   *Rule: Wides do not count as balls faced. No-balls do count as balls faced.*

2. **Bowler Legal Balls & Runs Conceded**:
   $$\text{Legal Balls Bowled} = \sum_{k} \mathbb{I}(\text{is\_legal\_delivery}_k)$$
   $$\text{Runs Conceded} = \sum_{k} \left( \text{runs}_k + \mathbb{I}(\text{extras\_type}_k \in \{\text{'wide'}, \text{'no ball'}\}) \times \text{extras\_2\_runs}_k \right)$$
   *Rule: Byes and leg-byes are excluded from bowler runs conceded.*

3. **Bowler Dismissals**:
   $$\text{Bowler Wickets} = \sum_{k} \mathbb{I}(\text{dismissal\_kind}_k \in \{1, 2, 3, 5, 6\})$$
   *IDs: 1 = Bowled, 2 = Caught, 3 = LBW, 5 = Stumped, 6 = Hit Wicket.*
   *Exclusion: Run-outs (ID 4) and retired out (ID 8) are strictly credited to team fielding, never bowler wickets.*

---

## 5. Empirical Bayes Shrinkage Formulation

### 5.1 The Small-Sample Dilemma
In sports analytics, players with tiny sample sizes (e.g. 5 balls) can register extreme sample statistics (e.g. SR 300.0 or Econ 3.00). Ranking players by raw sample rates induces extreme survivor bias and severe false discovery rates.

### 5.2 Shrinkage Estimator
Let player $i$ have:
- $n_i$: sample size under pressure (balls faced for batters; legal balls for bowlers).
- $\hat{\theta}_i$: observed sample rate under pressure (raw SR or raw economy).
- $\mu_i$: player's career baseline prior across all deliveries in the dataset.

The Empirical Bayes regularized estimate $\tilde{\theta}_i$ is defined as:

$$\tilde{\theta}_i = w_i \hat{\theta}_i + (1 - w_i) \mu_i$$

where the shrinkage weight $w_i \in [0, 1]$ is:

$$w_i = \frac{n_i}{n_i + K}$$

### 5.3 Prior Strength Calibration
- **Batting ($K_{\text{bat}} = 40.0$ balls)**: Equivalent to approximately $6.4$ high-pressure overs. A batter with 40 pressure balls receives a 50% blend of observed pressure SR and career baseline SR. A batter with 200 balls receives 83.3% observed weight.
- **Bowling ($K_{\text{bowl}} = 48.0$ legal balls)**: Equivalent to exactly $8.0$ high-pressure overs.
- **Theoretical Guarantee**: In 100% of cases, $\tilde{\theta}_i$ is strictly bounded:
$$\min(\hat{\theta}_i, \mu_i) \le \tilde{\theta}_i \le \max(\hat{\theta}_i, \mu_i)$$

---

## 6. Multi-Factor Pressure Reliability Index (0–100)

To avoid one-dimensional distortion, players are evaluated on a balanced multi-criteria scoring function.

### 6.1 Batting Reliability Formulation

$$\text{Score}_{\text{bat}} = 0.40 \cdot S_{\text{AdjSR}} + 0.25 \cdot S_{\Delta\text{SR}} + 0.20 \cdot S_{\text{Boundary}} + 0.15 \cdot S_{\text{Volume}}$$

Where:
- **$S_{\text{AdjSR}}$ (40% Absolute Efficiency)**: Measures adjusted pressure strike rate:
  $$S_{\text{AdjSR}} = \text{clip}\left( \frac{\tilde{\text{SR}}_i - 110.0}{200.0 - 110.0} \times 100.0, 0, 100 \right)$$
- **$S_{\Delta\text{SR}}$ (25% Resilience Delta)**: Measures elevation over career baseline ($\Delta\text{SR} = \text{Press SR} - \text{Base SR}$):
  $$S_{\Delta\text{SR}} = \text{clip}\left( \frac{\Delta\text{SR}_i - (-15.0)}{30.0 - (-15.0)} \times 100.0, 0, 100 \right)$$
- **$S_{\text{Boundary}}$ (20% High-Leverage Execution)**: Percentage of pressure runs scored in boundaries (4s and 6s):
  $$S_{\text{Boundary}} = \text{clip}\left( \frac{\text{Boundary\%}_i - 30.0}{80.0 - 30.0} \times 100.0, 0, 100 \right)$$
- **$S_{\text{Volume}}$ (15% Sample Confidence)**: Square-root confidence penalty:
  $$S_{\text{Volume}} = \min\left(100.0, \sqrt{\frac{n_i}{400.0}} \times 100.0\right)$$

### 6.2 Bowling Reliability Formulation

$$\text{Score}_{\text{bowl}} = 0.40 \cdot S_{\text{AdjEcon}} + 0.25 \cdot S_{\Delta\text{Econ}} + 0.20 \cdot S_{\text{WicketSR}} + 0.15 \cdot S_{\text{Volume}}$$

Where:
- **$S_{\text{AdjEcon}}$ (40% Absolute Containment)**: Inverted scaling (lower economy is better):
  $$S_{\text{AdjEcon}} = \text{clip}\left( \frac{12.00 - \tilde{\text{Econ}}_i}{12.00 - 6.00} \times 100.0, 0, 100 \right)$$
- **$S_{\Delta\text{Econ}}$ (25% Resilience Delta)**: Economy tightening under pressure ($\Delta\text{Econ} = \text{Base Econ} - \text{Press Econ}$):
  $$S_{\Delta\text{Econ}} = \text{clip}\left( \frac{\Delta\text{Econ}_i - (-2.00)}{2.00 - (-2.00)} \times 100.0, 0, 100 \right)$$
- **$S_{\text{WicketSR}}$ (20% Wicket-Taking Threat)**: Wickets per legal delivery in pressure:
  $$S_{\text{WicketSR}} = \text{clip}\left( \frac{\text{Wkts/Ball}_i - 0.00}{0.08 - 0.00} \times 100.0, 0, 100 \right)$$
- **$S_{\text{Volume}}$ (15% Sample Confidence)**: Square-root confidence penalty:
  $$S_{\text{Volume}} = \min\left(100.0, \sqrt{\frac{n_i}{400.0}} \times 100.0\right)$$

---

## 7. Cross-Format Comparability & Self-Normalization

A critical methodological challenge in multi-tournament datasets is comparing franchise cricket (IPL) with international cricket (T20I).

### 7.1 Empirical Divergence Analysis
Analyzing all 200,999 deliveries reveals:
- **Baseline Scoring**: IPL matches feature higher scoring (145.28 baseline SR; 9.02 baseline Econ) than T20I matches (134.29 baseline SR; 8.34 baseline Econ) due to flatter Indian batting tracks and the Impact Player substitution rule.
- **The Universal Pressure Constant**: When pressure triggers, bowling economy degrades by **almost exactly +1.10 RPO across both tournaments**:
  $$\Delta\text{Econ}_{\text{IPL}} = +1.10 \text{ RPO} \quad \text{vs} \quad \Delta\text{Econ}_{\text{T20I}} = +1.09 \text{ RPO}$$

### 7.2 Self-Normalization Proof
Because SupeRR Selector 2.0 measures each player's resilience delta $\Delta = \theta_{\text{pressure}} - \theta_{\text{baseline}}$ relative to **their own career baseline in the matches they played**:
- An IPL player's pressure performance is evaluated relative to IPL baseline scoring.
- A T20I player's pressure performance is evaluated relative to international baseline scoring.
- No arbitrary artificial scaling coefficients or post-hoc adjustments are needed.

---

## 8. Summary of Analytical Verification

All data transformations, accounting rules, and regularized scores have been verified through 22 automated tests:
- 10 tests verifying temporal state progression, legal delivery counters, and DLS target assignment (`test_reconstruction.py`).
- 12 tests verifying ball conservation, run conservation, Empirical Bayes boundedness, and multi-factor weight normalization (`test_phase2_metrics.py`).
- Complete mathematical reproduction achieved with zero discrepancy across consecutive pipeline executions.
