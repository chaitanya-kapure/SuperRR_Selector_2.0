"""
SupeRR Selector 2.0 — Comprehensive Deep Dataset Audit
======================================================
"""
import pandas as pd
import numpy as np
import os, sys, json

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

DATA_DIR = r"d:\RR\data\raw\SupeRR Selector Season 2 _ Problem Statement _ Data Pack\SupeRR Selector Season 2 _ Data Pack"

def run_deep_audit():
    print("=" * 80)
    print("SUPERR SELECTOR 2.0 — COMPREHENSIVE DATASET AUDIT")
    print("=" * 80)

    # 1. Load dataframes
    comp = pd.read_csv(os.path.join(DATA_DIR, 'competitions.csv'), low_memory=False)
    teams = pd.read_csv(os.path.join(DATA_DIR, 'teams.csv'), low_memory=False)
    matches = pd.read_csv(os.path.join(DATA_DIR, 'matches.csv'), low_memory=False)
    bbb = pd.read_csv(os.path.join(DATA_DIR, 'ball_by_ball.csv'), low_memory=False)
    pe = pd.read_csv(os.path.join(DATA_DIR, 'playing_eleven.csv'), low_memory=False)
    pm = pd.read_csv(os.path.join(DATA_DIR, 'competition_team_player_mapping.csv'), low_memory=False)

    print("\n--- 1. RECORD COUNTS & MEMORY ---")
    print(f"Competitions: {len(comp):,} rows, {comp.shape[1]} cols")
    print(f"Teams: {len(teams):,} rows, {teams.shape[1]} cols")
    print(f"Matches: {len(matches):,} rows, {matches.shape[1]} cols")
    print(f"Ball by Ball: {len(bbb):,} rows, {bbb.shape[1]} cols")
    print(f"Playing 11: {len(pe):,} rows, {pe.shape[1]} cols")
    print(f"Player Mapping: {len(pm):,} rows, {pm.shape[1]} cols")

    # 2. Match IDs reconciliation
    print("\n--- 2. MATCH COVERAGE & RECONCILIATION ---")
    matches_ids = set(matches['match_id'].unique())
    bbb_ids = set(bbb['match_id'].unique())
    pe_ids = set(pe['match_id'].unique())

    print(f"Unique match_ids in matches.csv: {len(matches_ids)}")
    print(f"Unique match_ids in ball_by_ball.csv: {len(bbb_ids)}")
    print(f"Unique match_ids in playing_eleven.csv: {len(pe_ids)}")

    missing_in_bbb = matches_ids - bbb_ids
    print(f"Matches in matches.csv but NOT in ball_by_ball.csv: {len(missing_in_bbb)}")
    if missing_in_bbb:
        missing_df = matches[matches['match_id'].isin(missing_in_bbb)][['match_id', 'match_date', 'home_team', 'away_team', 'result']]
        print("Sample of missing matches:")
        print(missing_df.head(10).to_string(index=False))

    # 3. Competitions & Formats
    print("\n--- 3. COMPETITION FORMATS & SEASONS ---")
    matches_with_comp = matches.merge(comp, on='comp_id', how='left')
    print("Match counts by competition format:")
    print(matches_with_comp['match_format'].value_counts().to_string())

    print("\nMatch counts by season and format:")
    print(pd.crosstab(matches_with_comp['season'], matches_with_comp['match_format']))

    print("\nIPL Breakdown:")
    ipl_comps = comp[comp['comp_name'].str.contains('IPL', case=False, na=False)]
    print(ipl_comps[['comp_id', 'comp_name', 'match_format', 'season']].to_string(index=False))
    ipl_match_count = matches[matches['comp_id'].isin(ipl_comps['comp_id'])].shape[0]
    print(f"Total IPL matches in matches.csv: {ipl_match_count}")
    ipl_bbb_matches = bbb[bbb['match_id'].isin(matches[matches['comp_id'].isin(ipl_comps['comp_id'])]['match_id'])]['match_id'].nunique()
    print(f"Total IPL matches with ball_by_ball data: {ipl_bbb_matches}")

    # 4. Ball-by-ball column analysis
    print("\n--- 4. BALL-BY-BALL DEEP DIVE ---")
    print("Innings counts:")
    print(bbb['innings'].value_counts().sort_index())

    print("\nOverid values (min to max):", bbb['overid'].min(), "to", bbb['overid'].max())
    print("Overid distribution (head/tail):")
    print(bbb['overid'].value_counts().sort_index())

    print("\nover_ball_num values:", sorted(bbb['over_ball_num'].unique()))
    print("innings_ball_num range:", bbb['innings_ball_num'].min(), "to", bbb['innings_ball_num'].max())

    print("\nRuns & Extras analysis:")
    print("runs distribution:")
    print(bbb['runs'].value_counts().sort_index())

    print("\nextras_type values:")
    print(bbb['extras_type'].value_counts(dropna=False))

    print("\nextras1_runs summary:")
    print(bbb['extras1_runs'].describe())
    print("extras1_runs values when extras_type is not null:")
    print(bbb[bbb['extras_type'].notnull()]['extras1_runs'].value_counts())
    print("extras1_runs values when extras_type is null:")
    print(bbb[bbb['extras_type'].isnull()]['extras1_runs'].value_counts().head(5))

    print("\nextras_2_runs summary:")
    print(bbb['extras_2_runs'].value_counts())

    # Understand runs definition
    print("\nSample rows of different extras_type to verify total runs calculation:")
    sample_extras = bbb[bbb['extras_type'].notnull()][['match_id', 'innings', 'overid', 'over_ball_num', 'runs', 'extras_type', 'extras1_runs', 'extras_2_runs', 'is_four', 'is_six']].head(10)
    print(sample_extras.to_string(index=False))

    # 5. Dismissal & Wicket analysis
    print("\n--- 5. WICKETS & DISMISSALS ---")
    print("is_wicket value counts:")
    print(bbb['is_wicket'].value_counts())

    print("\ndismissal_type value counts:")
    print(bbb['dismissal_type'].value_counts(dropna=False))

    print("\nis_wicket vs dismissal_type check:")
    print(pd.crosstab(bbb['is_wicket'], bbb['dismissal_type'], dropna=False))

    # 6. Bowler vs Batter attribution
    print("\n--- 6. BOWLER VS BATTER RUNS & WICKETS ATTRIBUTION ---")
    # In cricket rules:
    # Bowler's wickets: bowled, caught, lbw, stumped, hit wicket, caught and bowled.
    # Non-bowler wickets: run out, retired hurt, timed out, obstructing field.
    bowler_wickets = ['bowled', 'caught', 'lbw', 'stumped', 'hit wicket', 'caught and bowled']
    bbb['is_bowler_wicket'] = bbb['dismissal_type'].str.lower().isin(bowler_wickets)
    print(f"Total wickets: {bbb['is_wicket'].sum():,}")
    print(f"Total bowler wickets: {bbb['is_bowler_wicket'].sum():,}")
    print(f"Wickets breakdown by dismissal_type:")
    print(bbb.groupby('dismissal_type')['is_bowler_wicket'].value_counts())

    # Legal delivery check:
    # Typically, wides and no-balls are NOT legal deliveries.
    # Let's inspect extras_type for wides and no-balls
    print("\nLegal delivery check:")
    print("extras_type unique:", bbb['extras_type'].unique())
    is_wide_or_noball = bbb['extras_type'].str.lower().isin(['wides', 'wide', 'no ball', 'noball', 'no-ball', 'no balls'])
    print(f"Deliveries with wide/no-ball extras: {is_wide_or_noball.sum():,}")
    print("Breakdown of extras_type:")
    print(bbb['extras_type'].str.lower().value_counts())

    # 7. Player Mapping & Playing Eleven Reconciliation
    print("\n--- 7. PLAYER IDENTIFIERS & CROSS-FILE INTEGRITY ---")
    pm_players = set(pm['player_id'].unique())
    pe_players = set(pe['player_id'].unique())
    striker_players = set(bbb['striker_id'].unique())
    bowler_players = set(bbb['bowler_id'].unique())
    all_bbb_players = striker_players | bowler_players

    print(f"Unique players in player_mapping: {len(pm_players)}")
    print(f"Unique players in playing_eleven: {len(pe_players)}")
    print(f"Unique strikers in ball_by_ball: {len(striker_players)}")
    print(f"Unique bowlers in ball_by_ball: {len(bowler_players)}")
    print(f"Total unique players in ball_by_ball: {len(all_bbb_players)}")
    print(f"Players in BBB but NOT in player_mapping: {len(all_bbb_players - pm_players)}")
    print(f"Players in BBB but NOT in playing_eleven: {len(all_bbb_players - pe_players)}")

    # Check for name consistency
    name_check = bbb.groupby('striker_id')['striker_name'].nunique()
    multi_names = name_check[name_check > 1]
    print(f"Players with multiple names in ball_by_ball striker_name: {len(multi_names)}")
    if len(multi_names) > 0:
        for pid in multi_names.index[:5]:
            print(f"  Player ID {pid}: {bbb[bbb['striker_id'] == pid]['striker_name'].unique()}")

    # 8. Match target & Result analysis
    print("\n--- 8. MATCH TARGET & REVISED OVERS ANALYSIS ---")
    print("revised_target nulls:", matches['revised_target'].isnull().sum(), f"out of {len(matches)}")
    print("revised_overs nulls:", matches['second_inn_revised_overs'].isnull().sum(), f"out of {len(matches)}")
    print("knock_out value counts:")
    print(matches['knock_out'].value_counts())

    # Check how first innings total relates to second innings target
    # Let's compute actual 1st innings total for all matches in bbb
    inn1_totals = bbb[bbb['innings'] == 1].groupby('match_id').agg(
        runs_sum=('runs', 'sum'),
        extras_sum=('extras1_runs', 'sum') # let's check what extras1_runs means!
    )
    print("\nFirst innings score samples:")
    print(inn1_totals.head(5))

    # Let's inspect a complete match to see how runs, extras, and total score are recorded
    sample_mid = bbb['match_id'].iloc[0]
    print(f"\nExamining single match (ID: {sample_mid}):")
    m_row = matches[matches['match_id'] == sample_mid].iloc[0]
    print(f"Match: {m_row['home_team']} vs {m_row['away_team']}, Result: {m_row['result']}")
    m_bbb = bbb[bbb['match_id'] == sample_mid]
    for inn in sorted(m_bbb['innings'].unique()):
        inn_b = m_bbb[m_bbb['innings'] == inn]
        print(f"  Innings {inn}: {len(inn_b)} deliveries, runs={inn_b['runs'].sum()}, extras1={inn_b['extras1_runs'].sum()}, extras2={inn_b['extras_2_runs'].sum()}, wickets={inn_b['is_wicket'].sum()}")
        print(f"  Extras types in inn {inn}: {inn_b['extras_type'].value_counts().to_dict()}")

    print("\n" + "=" * 80)
    print("AUDIT SCRIPT COMPLETED SUCCESSFULLY")
    print("=" * 80)

if __name__ == '__main__':
    run_deep_audit()
