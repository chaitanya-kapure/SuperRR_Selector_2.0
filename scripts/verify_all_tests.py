"""
SupeRR Selector 2.0 — Comprehensive Read-Only Test Runner
==========================================================
Executes Phase 1 (10 tests) and Phase 2 (12 tests) automated validation suites
and reports complete pass/fail diagnostics.
"""

import os
import sys
import pandas as pd

# Add project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src_analytics.data.loader import load_raw_data
from src_analytics.validation.test_reconstruction import run_automated_tests
from src_analytics.validation.test_phase2_metrics import run_phase2_tests

def main():
    print("=" * 80)
    print("RUNNING ALL AUTOMATED VALIDATION TESTS (22 TESTS TOTAL)")
    print("=" * 80)

    raw = load_raw_data()
    matches = raw['matches']
    
    recon_df = pd.read_csv('data/processed/reconstructed_match_states.csv')
    batting_df = pd.read_csv('data/processed/player_pressure_batting_metrics.csv')
    bowling_df = pd.read_csv('data/processed/player_pressure_bowling_metrics.csv')
    top10_batters = pd.read_csv('data/processed/top_10_pressure_batters.csv')
    top10_bowlers = pd.read_csv('data/processed/top_10_pressure_bowlers.csv')

    print("\n--- PHASE 1: RECONSTRUCTION & CRICKET ACCOUNTING TESTS (10 TESTS) ---")
    p1 = run_automated_tests(recon_df, matches)
    for test_name, res in p1.items():
        status = "PASSED" if res['passed'] else "FAILED"
        print(f"[{status}] {test_name}: {res.get('detail', '')}")

    print("\n--- PHASE 2: MODELING, BAYESIAN SHRINKAGE & RANKING TESTS (12 TESTS) ---")
    p2 = run_phase2_tests(recon_df, batting_df, bowling_df, top10_batters, top10_bowlers)
    for test_name, res in p2.items():
        status = "PASSED" if res['passed'] else "FAILED"
        print(f"[{status}] {res.get('title', test_name)}: {res.get('details', '')}")

    total_passed = sum(1 for r in p1.values() if r['passed']) + sum(1 for r in p2.values() if r['passed'])
    total_tests = len(p1) + len(p2)
    print("\n" + "=" * 80)
    print(f"FINAL AUDIT RESULT: {total_passed}/{total_tests} TESTS PASSED")
    print("=" * 80)

if __name__ == '__main__':
    main()
