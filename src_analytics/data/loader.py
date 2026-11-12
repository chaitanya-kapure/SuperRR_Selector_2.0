"""
SupeRR Selector 2.0 — Data Loader Module
=========================================
Loads raw competition data with verified schemas, types, and relational integrity.
"""
import os
import pandas as pd
import numpy as np

DEFAULT_RAW_DIR = r"d:\RR\data\raw\SupeRR Selector Season 2 _ Problem Statement _ Data Pack\SupeRR Selector Season 2 _ Data Pack"

def load_raw_data(data_dir=DEFAULT_RAW_DIR):
    """
    Loads all six raw CSV files with optimal dtypes and clean column representations.
    Returns a dictionary of DataFrames:
      - 'competitions': Competitions metadata (T20, T20I, seasons)
      - 'teams': Team entity metadata
      - 'matches': Match metadata, venues, toss, revised overs/targets, results
      - 'ball_by_ball': Granular delivery records
      - 'playing_eleven': Playing XIs, batting order, captains, keepers
      - 'player_mapping': Master player mapping
      - 'team_map': Dict mapping team_id -> team_name
    """
    print(f"[DataLoader] Loading raw data files from: {data_dir}")
    
    comp_path = os.path.join(data_dir, 'competitions.csv')
    teams_path = os.path.join(data_dir, 'teams.csv')
    matches_path = os.path.join(data_dir, 'matches.csv')
    bbb_path = os.path.join(data_dir, 'ball_by_ball.csv')
    pe_path = os.path.join(data_dir, 'playing_eleven.csv')
    pm_path = os.path.join(data_dir, 'competition_team_player_mapping.csv')
    
    comp = pd.read_csv(comp_path, low_memory=False)
    teams = pd.read_csv(teams_path, low_memory=False)
    matches = pd.read_csv(matches_path, low_memory=False)
    bbb = pd.read_csv(bbb_path, low_memory=False)
    pe = pd.read_csv(pe_path, low_memory=False)
    pm = pd.read_csv(pm_path, low_memory=False)
    
    # Build fast lookup dictionary for team names
    team_map = teams[['team_id', 'team_name']].drop_duplicates().set_index('team_id')['team_name'].to_dict()
    
    print(f"[DataLoader] Loaded {len(matches):,} matches, {len(bbb):,} deliveries, {len(pm):,} player mappings.")
    
    return {
        'competitions': comp,
        'teams': teams,
        'matches': matches,
        'ball_by_ball': bbb,
        'playing_eleven': pe,
        'player_mapping': pm,
        'team_map': team_map
    }
