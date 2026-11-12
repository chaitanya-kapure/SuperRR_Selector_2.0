"""
SupeRR Selector 2.0 — Batting Baseline & Pressure Metrics Engine
===============================================================
Computes player-level batting baselines across all eligible T20/T20I deliveries
and compares them directly against performance under pressure.

Accounting Rules:
- Batter Runs: 'runs' column (off the bat).
- Balls Faced: Deliveries where extras_type != 'wide'. (Wides do NOT count as balls faced).
- No-Balls: Count as balls faced by the batter.
- Dismissals: Only count when dismissed_player_id == striker_id and is_wicket is True.
- Strike Rate: (Runs / Balls Faced) * 100.
"""

import os
import sys
import numpy as np
import pandas as pd
from typing import Dict, Tuple, Optional

def compute_batting_baselines(df: pd.DataFrame) -> pd.DataFrame:
    """
    Computes overall career/period batting baseline metrics for all strikers.
    
    Parameters:
    -----------
    df : pd.DataFrame
        Reconstructed ball-by-ball DataFrame containing all deliveries.
        
    Returns:
    --------
    pd.DataFrame:
        DataFrame indexed by striker_id with overall batting baseline statistics.
    """
    print("  [BattingBaseline] Aggregating overall career batting baselines...")
    
    # Pre-calculate boolean masks for high performance vectorized aggregation
    balls_faced_mask = df['extras_type'] != 'wide'
    batter_dismissal_mask = df['is_wicket'] & (df['dismissed_player_id'] == df['striker_id'])
    dot_ball_mask = balls_faced_mask & (df['runs'] == 0)
    
    # Attach helper flags to df slice for fast grouping
    work_df = pd.DataFrame({
        'striker_id': df['striker_id'],
        'striker_name': df['striker_name'],
        'batting_type': df['batting_type'].fillna('Unknown'),
        'match_id': df['match_id'],
        'innings': df['innings'],
        'runs': df['runs'],
        'balls_faced': balls_faced_mask.astype(int),
        'is_four': df['is_four'].astype(int),
        'is_six': df['is_six'].astype(int),
        'is_dismissal': batter_dismissal_mask.astype(int),
        'is_dot': dot_ball_mask.astype(int),
        'delivery_count': 1
    })
    
    grouped = work_df.groupby('striker_id').agg(
        striker_name=('striker_name', 'first'),
        batting_type=('batting_type', lambda x: x.mode()[0] if not x.mode().empty else 'Unknown'),
        overall_matches=('match_id', 'nunique'),
        overall_innings=('match_id', lambda m: len(work_df.loc[m.index, ['match_id', 'innings']].drop_duplicates())),
        overall_runs=('runs', 'sum'),
        overall_balls_faced=('balls_faced', 'sum'),
        overall_deliveries=('delivery_count', 'sum'),
        overall_fours=('is_four', 'sum'),
        overall_sixes=('is_six', 'sum'),
        overall_dismissals=('is_dismissal', 'sum'),
        overall_dots=('is_dot', 'sum')
    ).reset_index()
    
    # Calculate derived rates with safe zero handling
    safe_balls = grouped['overall_balls_faced'].replace(0, np.nan)
    grouped['overall_strike_rate'] = ((grouped['overall_runs'] / safe_balls) * 100.0).round(2)
    
    safe_dismissals = grouped['overall_dismissals'].replace(0, np.nan)
    grouped['overall_average'] = (grouped['overall_runs'] / safe_dismissals).round(2)
    
    grouped['overall_boundary_runs'] = grouped['overall_fours'] * 4 + grouped['overall_sixes'] * 6
    safe_runs = grouped['overall_runs'].replace(0, np.nan)
    grouped['overall_boundary_pct'] = ((grouped['overall_boundary_runs'] / safe_runs) * 100.0).round(2).fillna(0.0)
    grouped['overall_dot_pct'] = ((grouped['overall_dots'] / safe_balls) * 100.0).round(2).fillna(0.0)
    
    print(f"  [BattingBaseline] Processed baselines for {len(grouped):,} unique batters.")
    return grouped


def compute_pressure_batting_metrics(df: pd.DataFrame) -> pd.DataFrame:
    """
    Computes batting metrics strictly within identified pressure situations.
    
    Parameters:
    -----------
    df : pd.DataFrame
        Reconstructed ball-by-ball DataFrame (or subset where is_pressure_batting is True).
        
    Returns:
    --------
    pd.DataFrame:
        DataFrame indexed by striker_id with pressure batting statistics.
    """
    print("  [PressureBatting] Filtering pressure deliveries and computing metrics...")
    
    p_df = df[df['is_pressure_batting']].copy()
    if len(p_df) == 0:
        raise ValueError("No pressure batting deliveries found in provided DataFrame.")
        
    balls_faced_mask = p_df['extras_type'] != 'wide'
    batter_dismissal_mask = p_df['is_wicket'] & (p_df['dismissed_player_id'] == p_df['striker_id'])
    dot_ball_mask = balls_faced_mask & (p_df['runs'] == 0)
    
    work_df = pd.DataFrame({
        'striker_id': p_df['striker_id'],
        'striker_name': p_df['striker_name'],
        'match_id': p_df['match_id'],
        'innings': p_df['innings'],
        'runs': p_df['runs'],
        'balls_faced': balls_faced_mask.astype(int),
        'is_four': p_df['is_four'].astype(int),
        'is_six': p_df['is_six'].astype(int),
        'is_dismissal': batter_dismissal_mask.astype(int),
        'is_dot': dot_ball_mask.astype(int),
        'delivery_count': 1
    })
    
    grouped = work_df.groupby('striker_id').agg(
        pressure_name=('striker_name', 'first'),
        pressure_matches=('match_id', 'nunique'),
        pressure_innings=('match_id', lambda m: len(work_df.loc[m.index, ['match_id', 'innings']].drop_duplicates())),
        pressure_runs=('runs', 'sum'),
        pressure_balls_faced=('balls_faced', 'sum'),
        pressure_deliveries=('delivery_count', 'sum'),
        pressure_fours=('is_four', 'sum'),
        pressure_sixes=('is_six', 'sum'),
        pressure_dismissals=('is_dismissal', 'sum'),
        pressure_dots=('is_dot', 'sum')
    ).reset_index()
    
    safe_balls = grouped['pressure_balls_faced'].replace(0, np.nan)
    grouped['pressure_strike_rate'] = ((grouped['pressure_runs'] / safe_balls) * 100.0).round(2)
    
    safe_dismissals = grouped['pressure_dismissals'].replace(0, np.nan)
    grouped['pressure_average'] = (grouped['pressure_runs'] / safe_dismissals).round(2)
    
    grouped['pressure_boundary_runs'] = grouped['pressure_fours'] * 4 + grouped['pressure_sixes'] * 6
    safe_runs = grouped['pressure_runs'].replace(0, np.nan)
    grouped['pressure_boundary_pct'] = ((grouped['pressure_boundary_runs'] / safe_runs) * 100.0).round(2).fillna(0.0)
    grouped['pressure_dot_pct'] = ((grouped['pressure_dots'] / safe_balls) * 100.0).round(2).fillna(0.0)
    
    print(f"  [PressureBatting] Processed pressure metrics for {len(grouped):,} unique batters ({len(p_df):,} balls).")
    return grouped


def merge_batting_performance(baseline_df: pd.DataFrame, pressure_df: pd.DataFrame) -> pd.DataFrame:
    """
    Merges overall baseline statistics with pressure statistics and calculates deltas.
    
    Delta Formulas:
    - strike_rate_delta = pressure_strike_rate - overall_strike_rate
    - average_delta = pressure_average - overall_average
    - dot_pct_delta = pressure_dot_pct - overall_dot_pct (negative is better: fewer dots under pressure)
    - boundary_pct_delta = pressure_boundary_pct - overall_boundary_pct (positive is better: more boundaries)
    """
    print("  [BattingPerformance] Merging baselines and calculating pressure deltas...")
    
    merged = pd.merge(
        baseline_df,
        pressure_df.drop(columns=['pressure_name']),
        on='striker_id',
        how='left'
    )
    
    # Fill zero stats for players who faced 0 pressure deliveries
    pressure_numeric_cols = [
        'pressure_matches', 'pressure_innings', 'pressure_runs', 'pressure_balls_faced',
        'pressure_deliveries', 'pressure_fours', 'pressure_sixes', 'pressure_dismissals',
        'pressure_dots', 'pressure_boundary_runs', 'pressure_boundary_pct', 'pressure_dot_pct'
    ]
    merged[pressure_numeric_cols] = merged[pressure_numeric_cols].fillna(0)
    merged['pressure_strike_rate'] = merged['pressure_strike_rate'].fillna(0.0)
    
    # Compute performance deltas
    merged['strike_rate_delta'] = (merged['pressure_strike_rate'] - merged['overall_strike_rate']).round(2)
    merged['average_delta'] = (merged['pressure_average'] - merged['overall_average']).round(2)
    merged['dot_pct_delta'] = (merged['pressure_dot_pct'] - merged['overall_dot_pct']).round(2)
    merged['boundary_pct_delta'] = (merged['pressure_boundary_pct'] - merged['overall_boundary_pct']).round(2)
    
    # Pressure exposure ratio: fraction of balls faced that came in pressure situations
    safe_total_balls = merged['overall_balls_faced'].replace(0, np.nan)
    merged['pressure_ball_share'] = ((merged['pressure_balls_faced'] / safe_total_balls) * 100.0).round(2).fillna(0.0)
    
    return merged
