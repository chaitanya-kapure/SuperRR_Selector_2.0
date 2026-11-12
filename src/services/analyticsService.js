/**
 * SupeRR Selector 2.0 — Analytics Integration Service
 * 
 * Provides clean contracts and loading mechanisms for Python-generated analytics artifacts.
 * Gracefully handles pending / in-development states without fabricating false numbers.
 */

const API_BASE_URL = import.meta.env.VITE_ANALYTICS_API_URL || '/data';

/**
 * Fetch helper with standard error and missing-file handling
 */
async function fetchArtifact(endpoint) {
  try {
    const res = await fetch(`${API_BASE_URL}/${endpoint}`);
    if (!res.ok) {
      return { isLoaded: false, status: 'pending', error: `Artifact ${endpoint} not ready` };
    }
    const data = await res.json();
    return { isLoaded: true, status: 'ready', data };
  } catch (err) {
    return { isLoaded: false, status: 'pending', error: err.message };
  }
}

export const analyticsService = {
  // Overview metrics & pipeline status
  async getOverview() {
    return fetchArtifact('overview.json');
  },

  // Batting pressure metrics & leaderboards
  async getBattingAnalytics() {
    return fetchArtifact('batting_metrics.json');
  },

  // Bowling pressure metrics & leaderboards
  async getBowlingAnalytics() {
    return fetchArtifact('bowling_metrics.json');
  },

  // Top 10 Batters Under Pressure
  async getTop10Batters() {
    return fetchArtifact('top10_batters.json');
  },

  // Top 10 Bowlers Under Pressure
  async getTop10Bowlers() {
    return fetchArtifact('top10_bowlers.json');
  },

  // Player comparison dataset
  async getPlayerComparison(playerIds = []) {
    return fetchArtifact(`player_comparisons.json?ids=${playerIds.join(',')}`);
  },

  // Verified Audit summary from official Round 1 data pack
  getDataAuditSummary() {
    return {
      status: 'verified',
      auditDate: 'November 2026',
      totalMatches: 883,
      matchesWithBallByBall: 867,
      abandonedMatches: 16,
      totalDeliveries: 200999,
      totalCompetitions: 141,
      totalIPLMatches: 371,
      iplSeasons: ['2022', '2023', '2024', '2025', '2026'],
      totalT20IMatches: 482,
      uniqueStrikers: 888,
      uniqueBowlers: 647,
      totalPlayersMapped: 1217,
      totalDismissals: 10881,
      bowlerWickets: 10058,
      nonBowlerDismissals: 823,
      widesTotal: 7714,
      scorecardVerified: true
    };
  }
};

export default analyticsService;
