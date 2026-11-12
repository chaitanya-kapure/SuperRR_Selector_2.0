"""
SupeRR Selector 2.0 — Match-State Reconstruction & Pressure Classification Engine
=================================================================================
Processes ball-by-ball delivery telemetry to compute exact pre-ball match situations
and dual situational pressure indices for batting and bowling.
"""

import os
import sys
import numpy as np
import pandas as pd

BOWLER_WICKET_TYPE_IDS = {1, 2, 3, 5, 6}  # Bowled, Caught, LBW, Stump, Hit Wicket
NON_BOWLER_DISMISSAL_IDS = {4, 9, 10}     # RunOut, Retire Out, Obstructing field


def calculate_delivery_runs_and_extras(row):
    """
    Computes exact delivery runs, extra runs, and legal delivery flags
    following verified cricket audit rules.
    """
    bat_runs = int(row['runs']) if pd.notnull(row['runs']) else 0
    ext_type = str(row['extras_type']).lower() if pd.notnull(row['extras_type']) else ''
    ext2 = int(row['extras_2_runs']) if pd.notnull(row['extras_2_runs']) else 0
    
    if ext_type == 'wide':
        # Wide: not a legal delivery. 1 penalty run + any extras_2_runs.
        is_legal = False
        extra_runs = 1 + ext2
        bowler_runs = extra_runs
        team_runs = extra_runs
        effective_bat_runs = 0
    elif ext_type == 'overstep':
        # Overstep (no ball): not a legal delivery. 1 penalty run + batter runs + extras_2_runs.
        is_legal = False
        extra_runs = 1 + ext2
        bowler_runs = bat_runs + extra_runs
        team_runs = bat_runs + extra_runs
        effective_bat_runs = bat_runs
    elif ext_type in ['legbyes', 'byes']:
        # Byes/legbyes: legal delivery. Runs not charged to the bowler.
        is_legal = True
        extra_runs = max(1, bat_runs) + ext2
        bowler_runs = 0
        team_runs = extra_runs
        effective_bat_runs = 0
    elif ext_type == 'other':
        # Other extras: legal delivery.
        is_legal = True
        extra_runs = 1 + ext2
        bowler_runs = bat_runs + extra_runs
        team_runs = bat_runs + extra_runs
        effective_bat_runs = bat_runs
    elif ext_type == 'penalty':
        # Penalty runs: illegal / dead ball penalty.
        is_legal = False
        extra_runs = 5 + ext2
        bowler_runs = 0
        team_runs = extra_runs
        effective_bat_runs = 0
    else:
        # Standard legal delivery with no extras
        is_legal = True
        extra_runs = ext2
        bowler_runs = bat_runs + ext2
        team_runs = bat_runs + ext2
        effective_bat_runs = bat_runs
        
    is_wicket = bool(row['is_wicket']) if pd.notnull(row['is_wicket']) else False
    dismissal_id = row['dismissal_type_id']
    is_bowler_wkt = is_wicket and pd.notnull(dismissal_id) and int(dismissal_id) in BOWLER_WICKET_TYPE_IDS
    
    return {
        'is_legal': is_legal,
        'team_runs': team_runs,
        'bat_runs': effective_bat_runs,
        'extra_runs': extra_runs,
        'bowler_runs': bowler_runs,
        'is_wicket': is_wicket,
        'is_bowler_wicket': is_bowler_wkt
    }


def classify_situational_pressure(innings, pre_score, pre_wickets, pre_legal_balls,
                                   balls_remaining, target, runs_required, crr, rrr):
    """
    Evaluates cricket match context before the delivery to determine whether
    the situation represents High Pressure for:
      1. Batters chasing targets (Innings 2)
      2. Batters setting targets (Innings 1)
      3. Bowlers defending targets (Innings 2)
      4. Bowlers bowling in first innings (Innings 1)
      
    Returns a dict with:
      - is_pressure_batting (bool)
      - is_pressure_bowling (bool)
      - batting_pressure_score (float 0.0 to 1.0)
      - bowling_pressure_score (float 0.0 to 1.0)
      - pressure_category_batting (str)
      - pressure_category_bowling (str)
    """
    wickets_in_hand = max(0, 10 - pre_wickets)
    
    # Defaults
    is_p_bat = False
    is_p_bowl = False
    bat_score = 0.0
    bowl_score = 0.0
    cat_bat = 'Normal'
    cat_bowl = 'Normal'
    
    if innings == 2:
        # =====================================================================
        # INNINGS 2: CHASING TARGET
        # =====================================================================
        if pd.notnull(target) and runs_required > 0 and balls_remaining > 0:
            
            # --- Batting Pressure in Chase ---
            # 1. High RRR pressure
            if rrr >= 10.0 and runs_required >= 15 and rrr <= 24.0:
                is_p_bat = True
                cat_bat = 'Chasing High RRR'
                bat_score = min(1.0, 0.5 + (rrr - 10.0) * 0.05 + (10 - wickets_in_hand) * 0.04)
                
            # 2. Escalating tempo pressure (falling significantly behind required rate)
            elif (rrr - crr) >= 2.5 and runs_required >= 24 and balls_remaining >= 18:
                is_p_bat = True
                cat_bat = 'Chasing Escalating RRR'
                bat_score = min(1.0, 0.45 + (rrr - crr) * 0.08)
                
            # 3. Wicket Crisis (batting with lower order under pressure)
            elif wickets_in_hand <= 4 and runs_required >= 20 and balls_remaining >= 12:
                is_p_bat = True
                cat_bat = 'Chasing Wicket Crisis'
                bat_score = min(1.0, 0.6 + (5 - wickets_in_hand) * 0.08)
                
            # 4. Death Chase (overs 16–20 in a competitive match)
            elif balls_remaining <= 30 and runs_required <= 65 and rrr >= 8.5 and rrr <= 24.0:
                is_p_bat = True
                cat_bat = 'Death Chase Crunch'
                bat_score = min(1.0, 0.55 + (30 - balls_remaining) * 0.012 + (rrr - 8.5) * 0.03)
                
            # 5. Extreme Final Overs Finish (last 12 balls, win in reach)
            elif balls_remaining <= 12 and runs_required <= 32 and runs_required >= 3:
                is_p_bat = True
                cat_bat = 'Final Overs Climax'
                bat_score = min(1.0, 0.75 + (12 - balls_remaining) * 0.02)
            else:
                bat_score = min(0.40, max(0.0, (rrr / 20.0) * 0.4))
                
            # --- Bowling Pressure Defending in Chase ---
            # 1. Defending in Death Overs when contest is alive
            if balls_remaining <= 30 and runs_required <= 60 and rrr <= 14.0 and runs_required >= 2:
                is_p_bowl = True
                cat_bowl = 'Death Overs Defense'
                bowl_score = min(1.0, 0.55 + (30 - balls_remaining) * 0.012 + max(0, 14.0 - rrr) * 0.03)
                
            # 2. Extreme Final Overs Defense (last 12 balls)
            elif balls_remaining <= 12 and runs_required <= 28 and runs_required >= 3:
                is_p_bowl = True
                cat_bowl = 'Final Overs Climax'
                bowl_score = min(1.0, 0.75 + (12 - balls_remaining) * 0.02)
                
            # 3. Under Attack in Middle Overs (opponent is ahead of par with wickets in hand)
            elif rrr <= 8.5 and wickets_in_hand >= 6 and 30 < balls_remaining <= 72:
                is_p_bowl = True
                cat_bowl = 'Middle Overs Containment'
                bowl_score = min(1.0, 0.45 + (wickets_in_hand - 5) * 0.07 + max(0, 8.5 - rrr) * 0.05)
            else:
                bowl_score = min(0.40, max(0.0, (runs_required / max(1, balls_remaining)) * 0.3))
                
    elif innings == 1:
        # =====================================================================
        # INNINGS 1: SETTING TARGET
        # =====================================================================
        # --- Batting Pressure in 1st Innings ---
        # 1. Powerplay Top-Order Collapse (overs 1–6 with 3+ wickets down)
        if pre_legal_balls <= 36 and pre_wickets >= 3:
            is_p_bat = True
            cat_bat = 'Powerplay Collapse'
            bat_score = min(1.0, 0.55 + (pre_wickets - 2) * 0.12)
            
        # 2. Deep Middle Collapse (first 12 overs with 4+ wickets down)
        elif pre_legal_balls <= 72 and pre_wickets >= 4:
            is_p_bat = True
            cat_bat = 'Middle Collapse Recovery'
            bat_score = min(1.0, 0.50 + (pre_wickets - 3) * 0.10)
            
        # 3. Death Overs Acceleration (overs 16–20 while competitive)
        elif balls_remaining <= 30 and pre_wickets <= 7:
            is_p_bat = True
            cat_bat = 'Death Overs Acceleration'
            bat_score = min(1.0, 0.45 + (30 - balls_remaining) * 0.012 + (8 - pre_wickets) * 0.03)
        else:
            bat_score = min(0.35, (pre_wickets / 10.0) * 0.35)
            
        # --- Bowling Pressure in 1st Innings ---
        # 1. Death Overs Execution against set batters
        if balls_remaining <= 30 and pre_wickets <= 6:
            is_p_bowl = True
            cat_bowl = 'Death Overs Execution'
            bowl_score = min(1.0, 0.45 + (30 - balls_remaining) * 0.012 + (7 - pre_wickets) * 0.03)
            
        # 2. Powerplay Containment against runaway assault
        elif pre_legal_balls <= 36 and crr >= 9.5 and pre_wickets <= 1:
            is_p_bowl = True
            cat_bowl = 'Powerplay Assault Control'
            bowl_score = min(1.0, 0.50 + (crr - 9.5) * 0.08)
        else:
            bowl_score = min(0.35, max(0.0, (crr / 12.0) * 0.35))
            
    elif innings in [3, 4]:
        # =====================================================================
        # SUPER OVERS: ALL DELIVERIES ARE PEAK PRESSURE
        # =====================================================================
        is_p_bat = True
        is_p_bowl = True
        bat_score = 1.0
        bowl_score = 1.0
        cat_bat = 'Super Over Climax'
        cat_bowl = 'Super Over Climax'
        
    return {
        'is_pressure_batting': is_p_bat,
        'is_pressure_bowling': is_p_bowl,
        'batting_pressure_score': round(float(bat_score), 4),
        'bowling_pressure_score': round(float(bowl_score), 4),
        'pressure_category_batting': cat_bat,
        'pressure_category_bowling': cat_bowl
    }


def reconstruct_match_states(bbb_df, matches_df, team_map):
    """
    Executes pre-ball match state reconstruction across all matches.
    Strictly chronological, zero target leakage, complete accounting.
    """
    print("[Reconstruction] Starting delivery-level match-state reconstruction...")
    
    # Index matches metadata for fast lookup
    matches_meta = matches_df.set_index('match_id').to_dict('index')
    
    # Pre-sort ball-by-ball by match_id, innings, and innings_ball_num
    bbb_sorted = bbb_df.sort_values(['match_id', 'innings', 'innings_ball_num']).copy()
    
    # First pass: compute actual 1st innings total runs for every match
    # to serve as target basis for innings 2.
    print("[Reconstruction] Computing 1st innings total scores for target calibration...")
    inn1_delivery_runs = []
    for _, row in bbb_sorted.iterrows():
        acc = calculate_delivery_runs_and_extras(row)
        inn1_delivery_runs.append((row['match_id'], row['innings'], acc['team_runs']))
        
    runs_df = pd.DataFrame(inn1_delivery_runs, columns=['match_id', 'innings', 'team_runs'])
    inn1_totals = runs_df[runs_df['innings'] == 1].groupby('match_id')['team_runs'].sum().to_dict()
    inn3_totals = runs_df[runs_df['innings'] == 3].groupby('match_id')['team_runs'].sum().to_dict()
    
    reconstructed_rows = []
    
    total_deliveries = len(bbb_sorted)
    current_match_id = None
    current_innings = None
    
    # State trackers
    pre_score = 0
    pre_wickets = 0
    pre_legal_balls = 0
    target = np.nan
    total_target_balls = 120
    
    for idx, row in bbb_sorted.iterrows():
        mid = row['match_id']
        inn = row['innings']
        
        # Check for match or innings transition
        if mid != current_match_id or inn != current_innings:
            current_match_id = mid
            current_innings = inn
            pre_score = 0
            pre_wickets = 0
            pre_legal_balls = 0
            
            meta = matches_meta.get(mid, {})
            
            if inn == 1:
                target = np.nan
                rev_overs = meta.get('first_inn_revised_overs')
                total_target_balls = int(rev_overs) if pd.notnull(rev_overs) and rev_overs > 0 else 120
            elif inn == 2:
                rev_target = meta.get('revised_target')
                rev_overs = meta.get('second_inn_revised_overs')
                
                if pd.notnull(rev_target) and rev_target > 0:
                    target = int(rev_target)
                    total_target_balls = int(rev_overs) if pd.notnull(rev_overs) and rev_overs > 0 else 120
                else:
                    inn1_tot = inn1_totals.get(mid, 0)
                    target = inn1_tot + 1
                    first_rev_overs = meta.get('first_inn_revised_overs')
                    total_target_balls = int(first_rev_overs) if pd.notnull(first_rev_overs) and first_rev_overs > 0 else 120
            elif inn == 3:
                # Super Over 1
                target = np.nan
                total_target_balls = 6
            elif inn == 4:
                # Super Over 2 (Chasing)
                inn3_tot = inn3_totals.get(mid, 0)
                target = inn3_tot + 1
                total_target_balls = 6
            else:
                target = np.nan
                total_target_balls = 120

        # Pre-ball situation calculations
        balls_remaining = max(0, total_target_balls - pre_legal_balls)
        
        if pd.notnull(target):
            runs_required = max(0, target - pre_score)
            if balls_remaining > 0:
                rrr = round((runs_required / (balls_remaining / 6.0)), 3)
            else:
                rrr = round(float(runs_required * 6.0), 3)
        else:
            runs_required = np.nan
            rrr = np.nan
            
        if pre_legal_balls > 0:
            crr = round((pre_score / (pre_legal_balls / 6.0)), 3)
        else:
            crr = 0.0
            
        # Classify pressure for this delivery
        p_info = classify_situational_pressure(
            innings=inn,
            pre_score=pre_score,
            pre_wickets=pre_wickets,
            pre_legal_balls=pre_legal_balls,
            balls_remaining=balls_remaining,
            target=target,
            runs_required=runs_required,
            crr=crr,
            rrr=rrr
        )
        
        # Calculate delivery outcome
        delivery_acc = calculate_delivery_runs_and_extras(row)
        
        # Team names
        bat_team_id = row['batting_team_id']
        bowl_team_id = row['bowling_team_id']
        bat_team_name = team_map.get(bat_team_id, f"Team_{bat_team_id}")
        bowl_team_name = team_map.get(bowl_team_id, f"Team_{bowl_team_id}")
        
        # Assemble reconstructed record
        rec = {
            'match_id': mid,
            'innings': inn,
            'overid': row['overid'],
            'over_ball_num': row['over_ball_num'],
            'innings_ball_num': row['innings_ball_num'],
            'batting_team_id': bat_team_id,
            'batting_team_name': bat_team_name,
            'bowling_team_id': bowl_team_id,
            'bowling_team_name': bowl_team_name,
            'striker_id': row['striker_id'],
            'striker_name': row['striker_name'],
            'non_striker_id': row['non_striker_id'],
            'non_striker_name': row['non_striker_name'],
            'bowler_id': row['bowler_id'],
            'bowler_name': row['bowler_name'],
            'batting_type': row.get('batting_type', ''),
            'bowling_type': row.get('bowling_type', ''),
            'batting_order': row.get('batting_order', np.nan),
            # --- Pre-ball match situation ---
            'pre_score': pre_score,
            'pre_wickets': pre_wickets,
            'pre_legal_balls': pre_legal_balls,
            'balls_remaining': balls_remaining,
            'target': target,
            'runs_required': runs_required,
            'current_run_rate': crr,
            'required_run_rate': rrr,
            # --- Pressure classifications ---
            'is_pressure_batting': p_info['is_pressure_batting'],
            'is_pressure_bowling': p_info['is_pressure_bowling'],
            'batting_pressure_score': p_info['batting_pressure_score'],
            'bowling_pressure_score': p_info['bowling_pressure_score'],
            'pressure_category_batting': p_info['pressure_category_batting'],
            'pressure_category_bowling': p_info['pressure_category_bowling'],
            # --- Delivery event outcomes ---
            'runs': delivery_acc['bat_runs'],
            'is_four': bool(row.get('is_four', False)),
            'is_six': bool(row.get('is_six', False)),
            'extras_type': row['extras_type'] if pd.notnull(row['extras_type']) else 'none',
            'extra_runs': delivery_acc['extra_runs'],
            'delivery_runs': delivery_acc['team_runs'],
            'bowler_runs_conceded': delivery_acc['bowler_runs'],
            'is_legal_delivery': delivery_acc['is_legal'],
            'is_wicket': delivery_acc['is_wicket'],
            'is_bowler_wicket': delivery_acc['is_bowler_wicket'],
            'dismissal_type': row.get('dismissal_type', ''),
            'dismissed_player_id': row.get('dismissed_player_id', np.nan),
            'bowl_speed': row.get('bowl_speed', np.nan)
        }
        reconstructed_rows.append(rec)
        
        # Advance state AFTER recording pre-ball situation
        pre_score += delivery_acc['team_runs']
        if delivery_acc['is_legal']:
            pre_legal_balls += 1
        if delivery_acc['is_wicket']:
            pre_wickets += 1

    reconstructed_df = pd.DataFrame(reconstructed_rows)
    print(f"[Reconstruction] Completed {len(reconstructed_df):,} delivery states across {reconstructed_df['match_id'].nunique()} matches.")
    
    return reconstructed_df
