import pandas as pd
import numpy as np
import os

DATA_DIR = r"d:\RR\data\raw\SupeRR Selector Season 2 _ Problem Statement _ Data Pack\SupeRR Selector Season 2 _ Data Pack"
bbb = pd.read_csv(os.path.join(DATA_DIR, 'ball_by_ball.csv'), low_memory=False)
matches = pd.read_csv(os.path.join(DATA_DIR, 'matches.csv'), low_memory=False)

def calc_delivery_total_runs(row):
    bat_runs = row['runs']
    ext_type = str(row['extras_type']).lower() if pd.notnull(row['extras_type']) else ''
    ext2 = row['extras_2_runs'] if pd.notnull(row['extras_2_runs']) else 0
    
    if ext_type == 'wide':
        return 1 + ext2
    elif ext_type == 'overstep':
        return 1 + bat_runs + ext2
    elif ext_type in ['byes', 'legbyes']:
        return max(1, bat_runs) + ext2
    elif ext_type == 'other':
        return 1 + bat_runs + ext2
    elif ext_type == 'penalty':
        return 5 + ext2
    else:
        return bat_runs + ext2

bbb['delivery_runs'] = bbb.apply(calc_delivery_total_runs, axis=1)

for mid in [13511, 13512, 13513, 13514, 13515]:
    m = matches[matches['match_id'] == mid].iloc[0]
    print(f"\nMatch {mid}: {m['home_team']} vs {m['away_team']} | Result: {m['result']}")
    for inn, g in bbb[bbb['match_id'] == mid].groupby('innings'):
        print(f"   Innings {inn}: {g['delivery_runs'].sum()} runs, {g['is_wicket'].sum()} wickets, {len(g)} balls")
