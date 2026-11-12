"""
SupeRR Selector 2.0 — Empirical Bayes Shrinkage & Reliability Scoring Engine
===========================================================================
Formulates Bayesian shrinkage models and multi-factor composite pressure
reliability scores for batters and bowlers.

Empirical Bayes Formulation:
-----------------------------
In sports analytics, observed high-pressure small-sample rates theta_hat are noisy.
Shrinkage pulls extreme small-sample estimates toward an informative prior
(player baseline or league distribution) inversely proportional to sample size:

  Adjusted Rate = w * Observed_Pressure_Rate + (1 - w) * Prior_Baseline_Rate
  where w = n / (n + K)
  - n is sample size (balls faced or legal balls bowled).
  - K is the prior strength parameter (half-life in balls).

This eliminates small-sample flukes without arbitrarily disqualifying emerging talent.
"""

import numpy as np
import pandas as pd
from typing import Dict, Tuple, Optional

# Default empirical bayes shrinkage parameters
DEFAULT_K_BATTING = 40.0     # 40 balls faced (~6.4 overs)
DEFAULT_K_BOWLING = 48.0     # 48 legal balls bowled (8.0 overs)

def apply_batting_shrinkage(
    df: pd.DataFrame,
    k_balls: float = DEFAULT_K_BATTING,
    use_population_prior: bool = False
) -> pd.DataFrame:
    """
    Applies Empirical Bayes shrinkage to batting pressure strike rates.
    
    Formula:
      adj_sr = (n * pressure_sr + K * baseline_sr) / (n + K)
    """
    res = df.copy()
    n = res['pressure_balls_faced']
    
    if use_population_prior:
        # League-wide weighted average pressure strike rate
        valid_mask = res['pressure_balls_faced'] >= 30
        pop_mean_sr = (res.loc[valid_mask, 'pressure_runs'].sum() / 
                       res.loc[valid_mask, 'pressure_balls_faced'].sum()) * 100.0
        prior_sr = 0.5 * res['overall_strike_rate'] + 0.5 * pop_mean_sr
    else:
        prior_sr = res['overall_strike_rate']
        
    shrinkage_weight = n / (n + k_balls)
    res['batting_shrinkage_weight'] = shrinkage_weight.round(4)
    res['adjusted_pressure_strike_rate'] = (
        (shrinkage_weight * res['pressure_strike_rate']) + 
        ((1.0 - shrinkage_weight) * prior_sr)
    ).round(2)
    
    # Also adjust average if dismissals > 0
    safe_dismissals = res['pressure_dismissals'].replace(0, np.nan)
    prior_avg = res['overall_average'].fillna(20.0)
    res['adjusted_pressure_average'] = (
        (res['pressure_runs'] + 2.0 * prior_avg) / 
        (res['pressure_dismissals'] + 2.0)
    ).round(2)
    
    return res


def apply_bowling_shrinkage(
    df: pd.DataFrame,
    k_balls: float = DEFAULT_K_BOWLING,
    use_population_prior: bool = False
) -> pd.DataFrame:
    """
    Applies Empirical Bayes shrinkage to bowling pressure economy rates.
    
    Formula:
      adj_econ = (n * pressure_econ + K * baseline_econ) / (n + K)
    """
    res = df.copy()
    n = res['pressure_legal_balls']
    
    if use_population_prior:
        valid_mask = res['pressure_legal_balls'] >= 30
        pop_mean_econ = (res.loc[valid_mask, 'pressure_runs_conceded'].sum() / 
                         res.loc[valid_mask, 'pressure_legal_balls'].sum()) * 6.0
        prior_econ = 0.5 * res['overall_economy'] + 0.5 * pop_mean_econ
    else:
        prior_econ = res['overall_economy']
        
    shrinkage_weight = n / (n + k_balls)
    res['bowling_shrinkage_weight'] = shrinkage_weight.round(4)
    res['adjusted_pressure_economy'] = (
        (shrinkage_weight * res['pressure_economy']) + 
        ((1.0 - shrinkage_weight) * prior_econ)
    ).round(2)
    
    return res


def compute_batting_reliability_score(
    df: pd.DataFrame,
    w_adj_sr: float = 0.40,
    w_delta_sr: float = 0.25,
    w_boundary: float = 0.20,
    w_volume: float = 0.15,
    volume_benchmark_balls: float = 400.0
) -> pd.DataFrame:
    """
    Calculates the 0-100 Pressure Reliability Score for batters.
    
    Components:
    -----------
    1. Adjusted Strike Rate (40%): Scaled between 110.0 (league baseline anchor) and 200.0.
    2. Strike Rate Delta (25%): Scaled between -15.0 and +30.0 (rewards positive elevation).
    3. Boundary Capability (20%): Scaled between 25% and 80% boundary runs.
    4. Volume Confidence (15%): sqrt(balls / benchmark) scaled to 100.
    """
    res = df.copy()
    
    # 1. Adjusted SR Component (0 - 100)
    # Clip between 110 and 200
    sr_norm = np.clip((res['adjusted_pressure_strike_rate'] - 110.0) / (200.0 - 110.0) * 100.0, 0.0, 100.0)
    
    # 2. Delta SR Component (0 - 100)
    # Clip between -15.0 and +30.0
    delta_norm = np.clip((res['strike_rate_delta'] + 15.0) / (30.0 - (-15.0)) * 100.0, 0.0, 100.0)
    
    # 3. Boundary Component (0 - 100)
    # Clip between 30% and 80%
    boundary_norm = np.clip((res['pressure_boundary_pct'] - 30.0) / (80.0 - 30.0) * 100.0, 0.0, 100.0)
    
    # 4. Volume Confidence (0 - 100)
    vol_factor = np.clip(np.sqrt(res['pressure_balls_faced'] / volume_benchmark_balls), 0.0, 1.0) * 100.0
    
    res['score_comp_efficiency'] = sr_norm.round(2)
    res['score_comp_delta'] = delta_norm.round(2)
    res['score_comp_boundary'] = boundary_norm.round(2)
    res['score_comp_volume'] = vol_factor.round(2)
    
    res['pressure_reliability_score'] = (
        w_adj_sr * sr_norm +
        w_delta_sr * delta_norm +
        w_boundary * boundary_norm +
        w_volume * vol_factor
    ).round(2)
    
    return res


def compute_bowling_reliability_score(
    df: pd.DataFrame,
    w_adj_econ: float = 0.40,
    w_delta_econ: float = 0.25,
    w_wickets: float = 0.20,
    w_volume: float = 0.15,
    volume_benchmark_balls: float = 400.0
) -> pd.DataFrame:
    """
    Calculates the 0-100 Pressure Reliability Score for bowlers.
    
    Components:
    -----------
    1. Adjusted Economy (40%): Scaled between 12.0 (high leakage) and 6.0 (world-class containment).
    2. Economy Resilience (25%): Rewards holding or lowering economy under pressure.
       Delta economy is pressure_econ - overall_econ.
       Improvement is overall_econ - pressure_econ.
       Scaled between -2.0 and +2.0.
    3. Wicket Threat (20%): Pressure wicket rate per legal ball.
       Scaled between 0.00 and 0.08 (1 wicket per 12 balls / 2.0 overs).
    4. Volume Confidence (15%): sqrt(legal_balls / benchmark) scaled to 100.
    """
    res = df.copy()
    
    # 1. Adjusted Economy Component (0 - 100): Lower is better
    econ_norm = np.clip((12.0 - res['adjusted_pressure_economy']) / (12.0 - 6.0) * 100.0, 0.0, 100.0)
    
    # 2. Economy Resilience / Improvement Component (0 - 100)
    # improvement = overall - pressure. Scaled between -2.0 (worse) and +2.0 (improved)
    improvement = res['overall_economy'] - res['pressure_economy']
    resil_norm = np.clip((improvement + 2.0) / 4.0 * 100.0, 0.0, 100.0)
    
    # 3. Wicket Threat Component (0 - 100)
    # Wickets per legal delivery in pressure situations
    safe_legal = res['pressure_legal_balls'].replace(0, np.nan)
    wkt_rate = (res['pressure_wickets'] / safe_legal).fillna(0.0)
    wkt_norm = np.clip(wkt_rate / 0.08 * 100.0, 0.0, 100.0)
    
    # 4. Volume Confidence (0 - 100)
    vol_factor = np.clip(np.sqrt(res['pressure_legal_balls'] / volume_benchmark_balls), 0.0, 1.0) * 100.0
    
    res['score_comp_containment'] = econ_norm.round(2)
    res['score_comp_resilience'] = resil_norm.round(2)
    res['score_comp_wickets'] = wkt_norm.round(2)
    res['score_comp_volume'] = vol_factor.round(2)
    
    res['pressure_reliability_score'] = (
        w_adj_econ * econ_norm +
        w_delta_econ * resil_norm +
        w_wickets * wkt_norm +
        w_volume * vol_factor
    ).round(2)
    
    return res
