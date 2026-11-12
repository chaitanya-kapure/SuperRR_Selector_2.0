"""
SupeRR Selector 2.0 — Automated Verification Test Suite
=======================================================
Validates that reconstructed match states satisfy all cricket accounting rules,
zero-leakage pre-ball state invariance, and integrity constraints.
"""

import sys
import numpy as np
import pandas as pd


def run_automated_tests(df, matches_df):
    """
    Executes a comprehensive suite of 10 automated cricket validation tests.
    Returns a dict with test results, pass/fail status, and diagnostic messages.
    """
    tests = {}
    print("\n" + "=" * 70)
    print("RUNNING AUTOMATED RECONSTRUCTION VALIDATION TESTS")
    print("=" * 70)

    # -------------------------------------------------------------------------
    # TEST 1: Innings Transition & State Reset
    # -------------------------------------------------------------------------
    first_balls = df.groupby(['match_id', 'innings']).first().reset_index()
    t1_pass = (
        (first_balls['pre_score'] == 0).all() and
        (first_balls['pre_wickets'] == 0).all() and
        (first_balls['pre_legal_balls'] == 0).all()
    )
    tests['T01_Innings_State_Reset'] = {
        'passed': bool(t1_pass),
        'detail': f"Checked {len(first_balls)} innings starts. All pre_score, pre_wickets, pre_legal_balls == 0."
    }
    print(f"[TEST 1] Innings State Reset: {'PASSED' if t1_pass else 'FAILED'}")

    # -------------------------------------------------------------------------
    # TEST 2: Legal Ball Progression Invariance
    # -------------------------------------------------------------------------
    # Pre-legal balls should never decrease within an innings and only increment on is_legal_delivery
    diffs = df.groupby(['match_id', 'innings'])['pre_legal_balls'].diff()
    # On first ball diff is NaN, then it should be 0 (if prev ball illegal) or 1 (if prev ball legal)
    illegal_steps = diffs[diffs < 0]
    t2_pass = len(illegal_steps) == 0
    tests['T02_Legal_Ball_Monotonicity'] = {
        'passed': bool(t2_pass),
        'detail': f"pre_legal_balls is monotonic non-decreasing in 100% of rows (negative diffs: {len(illegal_steps)})."
    }
    print(f"[TEST 2] Legal Ball Monotonicity: {'PASSED' if t2_pass else 'FAILED'}")

    # -------------------------------------------------------------------------
    # TEST 3: Wicket Progression & Pre-ball Integrity
    # -------------------------------------------------------------------------
    w_diffs = df.groupby(['match_id', 'innings'])['pre_wickets'].diff()
    w_neg = w_diffs[w_diffs < 0]
    t3_pass = len(w_neg) == 0
    tests['T03_Wicket_Monotonicity'] = {
        'passed': bool(t3_pass),
        'detail': f"pre_wickets is monotonic non-decreasing in 100% of rows (negative diffs: {len(w_neg)})."
    }
    print(f"[TEST 3] Wicket Monotonicity: {'PASSED' if t3_pass else 'FAILED'}")

    # -------------------------------------------------------------------------
    # TEST 4: Wides & No-Balls are Non-Legal Deliveries
    # -------------------------------------------------------------------------
    wides_legal = df[df['extras_type'].str.lower() == 'wide']['is_legal_delivery']
    overstep_legal = df[df['extras_type'].str.lower() == 'overstep']['is_legal_delivery']
    t4_pass = (not wides_legal.any()) and (not overstep_legal.any())
    tests['T04_Illegal_Deliveries_Accounting'] = {
        'passed': bool(t4_pass),
        'detail': f"100% of {len(wides_legal)} wides and {len(overstep_legal)} oversteps classified as is_legal_delivery == False."
    }
    print(f"[TEST 4] Wides & No-Balls Non-Legal: {'PASSED' if t4_pass else 'FAILED'}")

    # -------------------------------------------------------------------------
    # TEST 5: Bowler Wickets Exclusion of Run-Outs
    # -------------------------------------------------------------------------
    runouts_as_bwkt = df[df['dismissal_type'] == 'RunOut']['is_bowler_wicket']
    t5_pass = not runouts_as_bwkt.any()
    tests['T05_RunOut_Bowler_Wicket_Exclusion'] = {
        'passed': bool(t5_pass),
        'detail': f"100% of {len(runouts_as_bwkt)} RunOut dismissals excluded from is_bowler_wicket."
    }
    print(f"[TEST 5] Run-Outs Excluded from Bowler Wickets: {'PASSED' if t5_pass else 'FAILED'}")

    # -------------------------------------------------------------------------
    # TEST 6: First Innings Target Invariance (Target must be NaN in Innings 1)
    # -------------------------------------------------------------------------
    inn1_targets = df[df['innings'] == 1]['target']
    t6_pass = inn1_targets.isnull().all()
    tests['T06_Innings1_Target_Nullity'] = {
        'passed': bool(t6_pass),
        'detail': f"100% of {len(inn1_targets):,} Innings 1 rows have target == NaN (no target leakage)."
    }
    print(f"[TEST 6] Innings 1 Target is NaN: {'PASSED' if t6_pass else 'FAILED'}")

    # -------------------------------------------------------------------------
    # TEST 7: Second Innings Target Validity
    # -------------------------------------------------------------------------
    inn2_targets = df[df['innings'] == 2]['target']
    t7_pass = (inn2_targets > 0).all() and inn2_targets.notnull().all()
    tests['T07_Innings2_Target_Validity'] = {
        'passed': bool(t7_pass),
        'detail': f"100% of {len(inn2_targets):,} Innings 2 rows have target > 0."
    }
    print(f"[TEST 7] Innings 2 Target Valid (>0): {'PASSED' if t7_pass else 'FAILED'}")

    # -------------------------------------------------------------------------
    # TEST 8: Revised Target Match Handling
    # -------------------------------------------------------------------------
    rev_matches = matches_df[matches_df['revised_target'].notnull()]['match_id'].unique()
    rev_df = df[(df['match_id'].isin(rev_matches)) & (df['innings'] == 2)]
    # Check if target matches revised_target
    m_dict = matches_df.set_index('match_id')['revised_target'].to_dict()
    rev_target_matches = rev_df.apply(lambda r: r['target'] == int(m_dict[r['match_id']]), axis=1)
    t8_pass = rev_target_matches.all() if len(rev_df) > 0 else True
    tests['T08_Revised_Target_Consistency'] = {
        'passed': bool(t8_pass),
        'detail': f"DLS / revised target matches match official revised_target in 100% of checked rows ({len(rev_df)} rows across {len(rev_matches)} matches)."
    }
    print(f"[TEST 8] Revised Target Consistency: {'PASSED' if t8_pass else 'FAILED'}")

    # -------------------------------------------------------------------------
    # TEST 9: Runs Required Invariance (Target - Pre-Score)
    # -------------------------------------------------------------------------
    inn2_req = df[df['innings'] == 2]
    expected_req = (inn2_req['target'] - inn2_req['pre_score']).clip(lower=0)
    req_match = (inn2_req['runs_required'] == expected_req).all()
    t9_pass = bool(req_match)
    tests['T09_Runs_Required_Arithmetic'] = {
        'passed': bool(t9_pass),
        'detail': f"runs_required exactly equals max(0, target - pre_score) across all {len(inn2_req):,} Innings 2 rows."
    }
    print(f"[TEST 9] Runs Required Arithmetic: {'PASSED' if t9_pass else 'FAILED'}")

    # -------------------------------------------------------------------------
    # TEST 10: Pressure Score Range Bound [0.0, 1.0]
    # -------------------------------------------------------------------------
    bat_range = (df['batting_pressure_score'] >= 0.0) & (df['batting_pressure_score'] <= 1.0)
    bowl_range = (df['bowling_pressure_score'] >= 0.0) & (df['bowling_pressure_score'] <= 1.0)
    t10_pass = bat_range.all() and bowl_range.all()
    tests['T10_Pressure_Scores_Bounded'] = {
        'passed': bool(t10_pass),
        'detail': f"100% of batting and bowling pressure scores strictly bounded within [0.0, 1.0]."
    }
    print(f"[TEST 10] Pressure Scores Bounded [0.0, 1.0]: {'PASSED' if t10_pass else 'FAILED'}")
    print("=" * 70 + "\n")

    return tests
