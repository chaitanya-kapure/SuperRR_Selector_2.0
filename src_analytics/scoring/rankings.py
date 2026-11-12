"""
SupeRR Selector 2.0 — Official Rankings & Decision Intelligence Engine
======================================================================
Applies eligibility filters, produces Top 10 Batters and Top 10 Bowlers rankings,
enriches each player with multi-team history, tactical roles, and auction justifications.
"""

import os
import sys
import numpy as np
import pandas as pd
from typing import Dict, Tuple, List, Optional

# Default eligibility thresholds based on dataset sample calibration
DEFAULT_BAT_MIN_BALLS = 80
DEFAULT_BAT_MIN_MATCHES = 5

DEFAULT_BOWL_MIN_LEGAL_BALLS = 80
DEFAULT_BOWL_MIN_MATCHES = 5

def build_player_team_mapping(player_mapping_df: pd.DataFrame) -> Dict[int, Dict[str, str]]:
    """
    Builds a dictionary mapping player_id to their teams and competition levels.
    """
    team_dict = {}
    grouped = player_mapping_df.groupby('player_id')
    for pid, group in grouped:
        teams = sorted(group['team_name'].dropna().unique().tolist())
        comps = sorted(group['comp_name'].dropna().unique().tolist())
        
        # Prioritize IPL franchises if present
        ipl_teams = [t for t in teams if any(franchise in t for franchise in [
            'Royals', 'Super Kings', 'Indians', 'Knight Riders', 'Capitals', 
            'Challengers', 'Sunrisers', 'Kings', 'Titans', 'Super Giants'
        ])]
        
        primary_team = ipl_teams[0] if ipl_teams else (teams[0] if teams else 'Unattached')
        has_ipl = any('IPL' in c for c in comps)
        
        team_dict[int(pid)] = {
            'primary_team': primary_team,
            'all_teams': ', '.join(teams[:3]) + ('...' if len(teams) > 3 else ''),
            'has_ipl': has_ipl,
            'competitions_count': len(comps)
        }
    return team_dict


def generate_top_10_batters(
    batting_df: pd.DataFrame,
    player_team_map: Optional[Dict[int, Dict[str, str]]] = None,
    min_balls: int = DEFAULT_BAT_MIN_BALLS,
    min_matches: int = DEFAULT_BAT_MIN_MATCHES
) -> pd.DataFrame:
    """
    Filters eligible batters and generates the Top 10 Batters Under Pressure ranking.
    """
    eligible = batting_df[
        (batting_df['pressure_balls_faced'] >= min_balls) &
        (batting_df['pressure_matches'] >= min_matches)
    ].copy()
    
    # Sort descending by composite pressure reliability score
    ranked = eligible.sort_values('pressure_reliability_score', ascending=False).reset_index(drop=True)
    top10 = ranked.head(10).copy()
    top10['rank'] = range(1, 11)
    
    # Enrich with team info
    if player_team_map:
        top10['primary_team'] = top10['striker_id'].apply(
            lambda pid: player_team_map.get(int(pid), {}).get('primary_team', 'Independent')
        )
        top10['all_teams'] = top10['striker_id'].apply(
            lambda pid: player_team_map.get(int(pid), {}).get('all_teams', '')
        )
        top10['ipl_experience'] = top10['striker_id'].apply(
            lambda pid: 'Yes' if player_team_map.get(int(pid), {}).get('has_ipl', False) else 'T20I Only'
        )
    else:
        top10['primary_team'] = 'Unknown'
        top10['ipl_experience'] = 'Unknown'
        
    # Generate tactical roles and auction justification badges
    def assign_batting_profile(row):
        sr = row['adjusted_pressure_strike_rate']
        delta = row['strike_rate_delta']
        balls = row['pressure_balls_faced']
        
        if delta >= 20.0 and sr >= 175.0:
            return "Elite Finisher / Power Accelerator"
        elif delta >= 15.0:
            return "High-Elevation Pressure Rescuer"
        elif sr >= 180.0:
            return "Dynamic Powerhitter"
        elif balls >= 400:
            return "Proven High-Volume Match-Winner"
        else:
            return "Middle-Overs Pressure Stabilizer"
            
    top10['tactical_role'] = top10.apply(assign_batting_profile, axis=1)
    top10['justification'] = top10.apply(
        lambda r: f"Adj SR {r['adjusted_pressure_strike_rate']:.1f} (Δ {r['strike_rate_delta']:+.1f}) across {r['pressure_balls_faced']} balls in {r['pressure_matches']} matches",
        axis=1
    )
    
    ordered_cols = [
        'rank', 'striker_id', 'striker_name', 'batting_type', 'primary_team', 'ipl_experience',
        'pressure_reliability_score', 'adjusted_pressure_strike_rate', 'overall_strike_rate',
        'pressure_strike_rate', 'strike_rate_delta', 'pressure_runs', 'pressure_balls_faced',
        'pressure_matches', 'pressure_boundary_pct', 'tactical_role', 'justification'
    ]
    return top10[[c for c in ordered_cols if c in top10.columns]]


def generate_top_10_bowlers(
    bowling_df: pd.DataFrame,
    player_team_map: Optional[Dict[int, Dict[str, str]]] = None,
    min_legal_balls: int = DEFAULT_BOWL_MIN_LEGAL_BALLS,
    min_matches: int = DEFAULT_BOWL_MIN_MATCHES
) -> pd.DataFrame:
    """
    Filters eligible bowlers and generates the Top 10 Bowlers Under Pressure ranking.
    """
    eligible = bowling_df[
        (bowling_df['pressure_legal_balls'] >= min_legal_balls) &
        (bowling_df['pressure_matches'] >= min_matches)
    ].copy()
    
    # Sort descending by composite pressure reliability score
    ranked = eligible.sort_values('pressure_reliability_score', ascending=False).reset_index(drop=True)
    top10 = ranked.head(10).copy()
    top10['rank'] = range(1, 11)
    
    # Enrich with team info
    if player_team_map:
        top10['primary_team'] = top10['bowler_id'].apply(
            lambda pid: player_team_map.get(int(pid), {}).get('primary_team', 'Independent')
        )
        top10['all_teams'] = top10['bowler_id'].apply(
            lambda pid: player_team_map.get(int(pid), {}).get('all_teams', '')
        )
        top10['ipl_experience'] = top10['bowler_id'].apply(
            lambda pid: 'Yes' if player_team_map.get(int(pid), {}).get('has_ipl', False) else 'T20I Only'
        )
    else:
        top10['primary_team'] = 'Unknown'
        top10['ipl_experience'] = 'Unknown'
        
    # Generate tactical roles and auction justification badges
    def assign_bowling_profile(row):
        econ = row['adjusted_pressure_economy']
        delta = row['delta_economy']
        balls = row['pressure_legal_balls']
        wkts = row['pressure_wickets']
        
        if econ <= 7.0:
            return "World-Class Pressure Lock / Restrictor"
        elif wkts >= 30:
            return "Elite High-Volume Wicket Striker"
        elif delta <= -0.5:
            return "High-Stress Tightener"
        elif balls >= 400:
            return "Workhorse Death/Pressure Specialist"
        else:
            return "Squeeze Specialist / Middle Choker"
            
    top10['tactical_role'] = top10.apply(assign_bowling_profile, axis=1)
    top10['justification'] = top10.apply(
        lambda r: f"Adj Econ {r['adjusted_pressure_economy']:.2f} (Δ {r['delta_economy']:+.2f}) with {r['pressure_wickets']} wkts in {r['pressure_overs']} ov ({r['pressure_matches']} matches)",
        axis=1
    )
    
    ordered_cols = [
        'rank', 'bowler_id', 'bowler_name', 'bowling_type', 'primary_team', 'ipl_experience',
        'pressure_reliability_score', 'adjusted_pressure_economy', 'overall_economy',
        'pressure_economy', 'delta_economy', 'pressure_wickets', 'pressure_overs',
        'pressure_legal_balls', 'pressure_matches', 'pressure_dot_pct', 'tactical_role', 'justification'
    ]
    return top10[[c for c in ordered_cols if c in top10.columns]]
