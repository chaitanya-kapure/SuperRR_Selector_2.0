"""
SupeRR Selector 2.0 — Bowling Baseline & Pressure Metrics Engine
===============================================================
Computes player-level bowling baselines across all eligible T20/T20I deliveries
and compares them directly against performance under pressure.

Accounting Rules:
- Runs Conceded: 'bowler_runs_conceded' (off-bat runs + wides + overstep/no-ball runs).
  Byes and leg-byes are NOT charged against the bowler.
- Legal Deliveries: Deliveries where is_legal_delivery is True (excludes wides and oversteps).
- Overs: legal_deliveries / 6.0.
- Economy Rate: (Runs Conceded / Legal Deliveries) * 6.0.
- Bowler Wickets: Only valid dismissals credited to the bowler:
  Bowled (1), Caught (2), LBW (3), Stumped (5), Hit Wicket (6).
  Run-Outs (4) and non-bowler dismissals are excluded.
- Bowling Average: Runs Conceded / Bowler Wickets.
- Bowling Strike Rate: Legal Deliveries / Bowler Wickets.
"""

import os
import sys
import numpy as np
import pandas as pd
from typing import Dict, Tuple, Optional

def compute_bowling_baselines(df: pd.DataFrame) -> pd.DataFrame:
    """
    Computes overall career/period bowling baseline metrics for all bowlers.
    
    Parameters:
    -----------
    df : pd.DataFrame
        Reconstructed ball-by-ball DataFrame containing all deliveries.
        
    Returns:
    --------
    pd.DataFrame:
        DataFrame indexed by bowler_id with overall bowling baseline statistics.
    """
    print("  [BowlingBaseline] Aggregating overall career bowling baselines...")
    
    legal_mask = df['is_legal_delivery']
    wkt_mask = df['is_bowler_wicket']
    dot_mask = legal_mask & (df['bowler_runs_conceded'] == 0)
    boundary_mask = (df['is_four'] | df['is_six'])
    
    work_df = pd.DataFrame({
        'bowler_id': df['bowler_id'],
        'bowler_name': df['bowler_name'],
        'bowling_type': df['bowling_type'].fillna('Unknown'),
        'match_id': df['match_id'],
        'innings': df['innings'],
        'runs_conceded': df['bowler_runs_conceded'],
        'legal_ball': legal_mask.astype(int),
        'is_wkt': wkt_mask.astype(int),
        'is_dot': dot_mask.astype(int),
        'is_boundary': boundary_mask.astype(int),
        'delivery_count': 1
    })
    
    grouped = work_df.groupby('bowler_id').agg(
        bowler_name=('bowler_name', 'first'),
        bowling_type=('bowling_type', lambda x: x.mode()[0] if not x.mode().empty else 'Unknown'),
        overall_matches=('match_id', 'nunique'),
        overall_innings=('match_id', lambda m: len(work_df.loc[m.index, ['match_id', 'innings']].drop_duplicates())),
        overall_runs_conceded=('runs_conceded', 'sum'),
        overall_legal_balls=('legal_ball', 'sum'),
        overall_deliveries=('delivery_count', 'sum'),
        overall_wickets=('is_wkt', 'sum'),
        overall_dots=('is_dot', 'sum'),
        overall_boundaries_conceded=('is_boundary', 'sum')
    ).reset_index()
    
    # Calculate derived rates with safe zero handling
    safe_legal = grouped['overall_legal_balls'].replace(0, np.nan)
    grouped['overall_overs'] = (grouped['overall_legal_balls'] / 6.0).round(1)
    grouped['overall_economy'] = ((grouped['overall_runs_conceded'] / safe_legal) * 6.0).round(2)
    
    safe_wkts = grouped['overall_wickets'].replace(0, np.nan)
    grouped['overall_average'] = (grouped['overall_runs_conceded'] / safe_wkts).round(2)
    grouped['overall_strike_rate'] = (grouped['overall_legal_balls'] / safe_wkts).round(2)
    
    grouped['overall_dot_pct'] = ((grouped['overall_dots'] / safe_legal) * 100.0).round(2).fillna(0.0)
    grouped['overall_boundary_pct'] = ((grouped['overall_boundaries_conceded'] / safe_legal) * 100.0).round(2).fillna(0.0)
    
    print(f"  [BowlingBaseline] Processed baselines for {len(grouped):,} unique bowlers.")
    return grouped


def compute_pressure_bowling_metrics(df: pd.DataFrame) -> pd.DataFrame:
    """
    Computes bowling metrics strictly within identified pressure situations.
    
    Parameters:
    -----------
    df : pd.DataFrame
        Reconstructed ball-by-ball DataFrame (or subset where is_pressure_bowling is True).
        
    Returns:
    --------
    pd.DataFrame:
        DataFrame indexed by bowler_id with pressure bowling statistics.
    """
    print("  [PressureBowling] Filtering pressure deliveries and computing metrics...")
    
    p_df = df[df['is_pressure_bowling']].copy()
    if len(p_df) == 0:
        raise ValueError("No pressure bowling deliveries found in provided DataFrame.")
        
    legal_mask = p_df['is_legal_delivery']
    wkt_mask = p_df['is_bowler_wicket']
    dot_mask = legal_mask & (p_df['bowler_runs_conceded'] == 0)
    boundary_mask = (p_df['is_four'] | p_df['is_six'])
    
    work_df = pd.DataFrame({
        'bowler_id': p_df['bowler_id'],
        'bowler_name': p_df['bowler_name'],
        'match_id': p_df['match_id'],
        'innings': p_df['innings'],
        'runs_conceded': p_df['bowler_runs_conceded'],
        'legal_ball': legal_mask.astype(int),
        'is_wkt': wkt_mask.astype(int),
        'is_dot': dot_mask.astype(int),
        'is_boundary': boundary_mask.astype(int),
        'delivery_count': 1
    })
    
    grouped = work_df.groupby('bowler_id').agg(
        pressure_name=('bowler_name', 'first'),
        pressure_matches=('match_id', 'nunique'),
        pressure_innings=('match_id', lambda m: len(work_df.loc[m.index, ['match_id', 'innings']].drop_duplicates())),
        pressure_runs_conceded=('runs_conceded', 'sum'),
        pressure_legal_balls=('legal_ball', 'sum'),
        pressure_deliveries=('delivery_count', 'sum'),
        pressure_wickets=('is_wkt', 'sum'),
        pressure_dots=('is_dot', 'sum'),
        pressure_boundaries_conceded=('is_boundary', 'sum')
    ).reset_index()
    
    safe_legal = grouped['pressure_legal_balls'].replace(0, np.nan)
    grouped['pressure_overs'] = (grouped['pressure_legal_balls'] / 6.0).round(1)
    grouped['pressure_economy'] = ((grouped['pressure_runs_conceded'] / safe_legal) * 6.0).round(2)
    
    safe_wkts = grouped['pressure_wickets'].replace(0, np.nan)
    grouped['pressure_average'] = (grouped['pressure_runs_conceded'] / safe_wkts).round(2)
    grouped['pressure_strike_rate'] = (grouped['pressure_legal_balls'] / safe_wkts).round(2)
    
    grouped['pressure_dot_pct'] = ((grouped['pressure_dots'] / safe_legal) * 100.0).round(2).fillna(0.0)
    grouped['pressure_boundary_pct'] = ((grouped['pressure_boundaries_conceded'] / safe_legal) * 100.0).round(2).fillna(0.0)
    
    print(f"  [PressureBowling] Processed pressure metrics for {len(grouped):,} unique bowlers ({len(p_df):,} balls).")
    return grouped


def merge_bowling_performance(baseline_df: pd.DataFrame, pressure_df: pd.DataFrame) -> pd.DataFrame:
    """
    Merges overall baseline statistics with pressure statistics and calculates deltas.
    
    Delta Formulas:
    - delta_economy = pressure_economy - overall_economy
      (Negative value indicates bowler improves run containment under pressure)
    - economy_improvement = overall_economy - pressure_economy
      (Positive value indicates run suppression resilience under pressure)
    - delta_dot_pct = pressure_dot_pct - overall_dot_pct
    - delta_wicket_rate = (pressure_wickets / pressure_legal_balls) - (overall_wickets / overall_legal_balls)
    """
    print("  [BowlingPerformance] Merging baselines and calculating pressure deltas...")
    
    merged = pd.merge(
        baseline_df,
        pressure_df.drop(columns=['pressure_name']),
        on='bowler_id',
        how='left'
    )
    
    # Fill zero stats for bowlers who bowled 0 pressure deliveries
    pressure_numeric_cols = [
        'pressure_matches', 'pressure_innings', 'pressure_runs_conceded', 'pressure_legal_balls',
        'pressure_overs', 'pressure_deliveries', 'pressure_wickets', 'pressure_dots',
        'pressure_boundaries_conceded', 'pressure_dot_pct', 'pressure_boundary_pct'
    ]
    merged[pressure_numeric_cols] = merged[pressure_numeric_cols].fillna(0)
    merged['pressure_economy'] = merged['pressure_economy'].fillna(0.0)
    
    # Compute performance deltas
    merged['delta_economy'] = (merged['pressure_economy'] - merged['overall_economy']).round(2)
    merged['economy_improvement'] = (merged['overall_economy'] - merged['pressure_economy']).round(2)
    merged['delta_dot_pct'] = (merged['pressure_dot_pct'] - merged['overall_dot_pct']).round(2)
    merged['delta_boundary_pct'] = (merged['pressure_boundary_pct'] - merged['overall_boundary_pct']).round(2)
    
    # Wicket rates
    safe_base_legal = merged['overall_legal_balls'].replace(0, np.nan)
    safe_press_legal = merged['pressure_legal_balls'].replace(0, np.nan)
    merged['overall_wicket_rate'] = (merged['overall_wickets'] / safe_base_legal).round(4).fillna(0.0)
    merged['pressure_wicket_rate'] = (merged['pressure_wickets'] / safe_press_legal).round(4).fillna(0.0)
    merged['delta_wicket_rate'] = (merged['pressure_wicket_rate'] - merged['overall_wicket_rate']).round(4)
    
    # Pressure exposure ratio: fraction of legal balls bowled that came in pressure situations
    merged['pressure_ball_share'] = ((merged['pressure_legal_balls'] / safe_base_legal) * 100.0).round(2).fillna(0.0)
    
    return merged
