import { useState, useEffect, useMemo } from 'react'
import {
  GitCompare,
  Flame,
  Shield,
  Search,
  Plus,
  ArrowRight,
  BarChart2,
  CheckCircle2,
  AlertCircle,
  Trophy,
  Crown,
  Sparkles,
  TrendingUp,
  Zap,
  Lock,
  UserCheck
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts'
import SectionHeader from '../components/ui/SectionHeader'
import StatusBadge from '../components/ui/StatusBadge'
import PlayerAutocomplete from '../components/ui/PlayerAutocomplete'
import PlayerAvatar from '../components/ui/PlayerAvatar'
import analyticsService from '../services/analyticsService'

export default function PlayerComparison() {
  const [roleMode, setRoleMode] = useState('batters') // 'batters' | 'bowlers'
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [player1Id, setPlayer1Id] = useState('')
  const [player2Id, setPlayer2Id] = useState('')

  useEffect(() => {
    async function loadData() {
      const res = await analyticsService.getPlayerProfiles()
      if (res.isLoaded && res.data.length > 0) {
        setProfiles(res.data)
        // Default player selections
        const batList = res.data.filter((p) => p.batting)
        if (batList.length >= 2) {
          setPlayer1Id(String(batList[0].player_id))
          setPlayer2Id(String(batList[1].player_id))
        }
      }
      setLoading(false)
    }
    loadData()
  }, [])

  // Switch role defaults
  const handleRoleSwitch = (newRole) => {
    setRoleMode(newRole)
    if (newRole === 'batters') {
      const batList = profiles.filter((p) => p.batting)
      if (batList.length >= 2) {
        setPlayer1Id(String(batList[0].player_id))
        setPlayer2Id(String(batList[1].player_id))
      }
    } else {
      const bowlList = profiles.filter((p) => p.bowling)
      if (bowlList.length >= 2) {
        setPlayer1Id(String(bowlList[0].player_id))
        setPlayer2Id(String(bowlList[4].player_id)) // Haris Rauf or Moeen Ali
      }
    }
  }

  const eligiblePlayers = useMemo(() => {
    if (roleMode === 'batters') {
      return profiles.filter((p) => p.batting).sort((a, b) => a.batting.rank - b.batting.rank)
    }
    return profiles.filter((p) => p.bowling).sort((a, b) => a.bowling.rank - b.bowling.rank)
  }, [profiles, roleMode])

  const p1 = profiles.find((p) => String(p.player_id) === String(player1Id))
  const p2 = profiles.find((p) => String(p.player_id) === String(player2Id))

  const stat1 = roleMode === 'batters' ? p1?.batting : p1?.bowling
  const stat2 = roleMode === 'batters' ? p2?.batting : p2?.bowling

  // Comparison metrics for BarChart
  const comparisonChartData = useMemo(() => {
    if (!stat1 || !stat2 || !p1 || !p2) return []
    if (roleMode === 'batters') {
      return [
        { metric: 'Adj SR', [p1.player_name]: stat1.adjusted_sr, [p2.player_name]: stat2.adjusted_sr },
        { metric: 'Pressure SR', [p1.player_name]: stat1.pressure_sr, [p2.player_name]: stat2.pressure_sr },
        { metric: 'Δ SR', [p1.player_name]: Math.max(0, stat1.sr_delta), [p2.player_name]: Math.max(0, stat2.sr_delta) },
        { metric: 'Boundary %', [p1.player_name]: stat1.boundary_pct, [p2.player_name]: stat2.boundary_pct },
        { metric: 'Reliability', [p1.player_name]: stat1.reliability_score, [p2.player_name]: stat2.reliability_score },
      ]
    } else {
      return [
        { metric: 'Adj Econ (inv)', [p1.player_name]: Math.max(0, 15 - stat1.adjusted_econ), [p2.player_name]: Math.max(0, 15 - stat2.adjusted_econ) },
        { metric: 'Press Econ (inv)', [p1.player_name]: Math.max(0, 15 - stat1.pressure_econ), [p2.player_name]: Math.max(0, 15 - stat2.pressure_econ) },
        { metric: 'Press Wkts', [p1.player_name]: stat1.pressure_wickets, [p2.player_name]: stat2.pressure_wickets },
        { metric: 'Press Overs', [p1.player_name]: stat1.pressure_overs, [p2.player_name]: stat2.pressure_overs },
        { metric: 'Reliability', [p1.player_name]: stat1.reliability_score, [p2.player_name]: stat2.reliability_score },
      ]
    }
  }, [p1, p2, stat1, stat2, roleMode])

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in" style={{ background: '#080D1B' }}>

      {/* Header */}
      <SectionHeader
        label="Head-to-Head Analytics · Rajasthan Royals Auction Strategy"
        title="Player Comparison"
        description="Select any two qualified players using Google-style search to compare their Empirical Bayes pressure resilience, baseline divergence, situational efficiency, and tactical auction fit."
        action={<StatusBadge status="ready" label="360 Indexed Profiles" />}
      />

      {/* Mode Switcher */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleRoleSwitch('batters')}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
            roleMode === 'batters'
              ? 'bg-rr-pink text-white shadow-rr-pink'
              : 'bg-[#111A30] text-rr-muted hover:text-white border border-white/[0.07]'
          }`}
        >
          <Flame className="w-4 h-4" />
          Compare Batters ({profiles.filter((p) => p.batting).length})
        </button>
        <button
          onClick={() => handleRoleSwitch('bowlers')}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
            roleMode === 'bowlers'
              ? 'bg-rr-gold text-black shadow-rr-gold'
              : 'bg-[#111A30] text-rr-muted hover:text-white border border-white/[0.07]'
          }`}
        >
          <Shield className="w-4 h-4" />
          Compare Bowlers ({profiles.filter((p) => p.bowling).length})
        </button>
      </div>

      {/* ── SEARCH & SELECTOR CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Player 1 Selector */}
        <div
          className="p-5 rounded-xl border flex flex-col justify-between"
          style={{ background: '#111A30', borderColor: 'rgba(233,30,99,0.35)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rr-pink bg-rr-pink/15 px-2 py-0.5 rounded border border-rr-pink/20">
              Player A
            </span>
            <span className="text-xs text-rr-muted">Rank #{stat1?.rank || '—'}</span>
          </div>

          <div className="space-y-3">
            <PlayerAutocomplete
              selectedPlayerId={player1Id}
              onSelectPlayer={(id) => setPlayer1Id(id)}
              players={eligiblePlayers}
              roleMode={roleMode}
              label="Player A"
              themeColor="pink"
              disabledPlayerId={player2Id}
              disabledLabel="Selected in Player B"
              placeholder={`Search ${roleMode === 'batters' ? 'batter' : 'bowler'} (e.g. Naman, Virat, Yashasvi)...`}
            />

            {p1 ? (
              <div className="pt-3 border-t border-white/[0.06] flex items-center gap-4">
                <PlayerAvatar
                  playerId={p1.player_id}
                  playerName={p1.player_name}
                  teamName={p1.primary_team}
                  role={roleMode === 'batters' ? 'batter' : 'bowler'}
                  size="xl"
                  ringColor="pink"
                  showGlow={true}
                  className="shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-lg font-black text-white truncate">{p1.player_name}</div>
                      <div className="text-xs text-rr-muted truncate">{p1.primary_team}</div>
                      <div className="text-[11px] text-rr-muted-dim mt-0.5">{p1.batting_type || p1.bowling_type || p1.primary_role}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[10px] text-rr-muted uppercase font-bold tracking-wider">Reliability</div>
                      <div className="text-2xl font-black text-rr-pink">{stat1?.reliability_score.toFixed(1)}</div>
                    </div>
                  </div>
                  {stat1?.tactical_role && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rr-pink/15 text-rr-pink border border-rr-pink/25 truncate">
                        {stat1.tactical_role}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="pt-4 pb-2 text-center text-xs text-rr-muted italic">
                No player selected for Player A. Type in the box above to search.
              </div>
            )}
          </div>
        </div>

        {/* Player 2 Selector */}
        <div
          className="p-5 rounded-xl border flex flex-col justify-between"
          style={{ background: '#111A30', borderColor: 'rgba(212,175,55,0.35)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rr-gold bg-rr-gold/15 px-2 py-0.5 rounded border border-rr-gold/20">
              Player B
            </span>
            <span className="text-xs text-rr-muted">Rank #{stat2?.rank || '—'}</span>
          </div>

          <div className="space-y-3">
            <PlayerAutocomplete
              selectedPlayerId={player2Id}
              onSelectPlayer={(id) => setPlayer2Id(id)}
              players={eligiblePlayers}
              roleMode={roleMode}
              label="Player B"
              themeColor="gold"
              disabledPlayerId={player1Id}
              disabledLabel="Selected in Player A"
              placeholder={`Search ${roleMode === 'batters' ? 'batter' : 'bowler'} (e.g. Yashasvi, Tim, Haris)...`}
            />

            {p2 ? (
              <div className="pt-3 border-t border-white/[0.06] flex items-center gap-4">
                <PlayerAvatar
                  playerId={p2.player_id}
                  playerName={p2.player_name}
                  teamName={p2.primary_team}
                  role={roleMode === 'batters' ? 'batter' : 'bowler'}
                  size="xl"
                  ringColor="gold"
                  showGlow={true}
                  className="shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-lg font-black text-white truncate">{p2.player_name}</div>
                      <div className="text-xs text-rr-muted truncate">{p2.primary_team}</div>
                      <div className="text-[11px] text-rr-muted-dim mt-0.5">{p2.batting_type || p2.bowling_type || p2.primary_role}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[10px] text-rr-muted uppercase font-bold tracking-wider">Reliability</div>
                      <div className="text-2xl font-black text-rr-gold">{stat2?.reliability_score.toFixed(1)}</div>
                    </div>
                  </div>
                  {stat2?.tactical_role && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rr-gold/15 text-rr-gold border border-rr-gold/25 truncate">
                        {stat2.tactical_role}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="pt-4 pb-2 text-center text-xs text-rr-muted italic">
                No player selected for Player B. Type in the box above to search.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── METRIC COMPARISON MATRIX ── */}
      {stat1 && stat2 && p1 && p2 ? (
        <div
          className="p-5 rounded-xl"
          style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-rr-pink" />
                Head-to-Head Performance Breakdown
              </h3>
              <p className="text-xs text-rr-muted mt-0.5">
                Empirical evidence comparing pressure resilience against baseline output
              </p>
            </div>
            <span className="text-xs text-rr-muted">Highlighting superior category metrics</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.06] text-rr-muted font-bold text-[10px] uppercase tracking-wider">
                  <th className="py-2.5 px-4">
                    <div className="flex items-center gap-2">
                      <PlayerAvatar
                        playerId={p1.player_id}
                        playerName={p1.player_name}
                        teamName={p1.primary_team}
                        role={roleMode === 'batters' ? 'batter' : 'bowler'}
                        size="xs"
                        ringColor="pink"
                      />
                      <span>{p1.player_name} (A)</span>
                    </div>
                  </th>
                  <th className="py-2.5 px-4 text-center">Analytics Dimension</th>
                  <th className="py-2.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span>{p2.player_name} (B)</span>
                      <PlayerAvatar
                        playerId={p2.player_id}
                        playerName={p2.player_name}
                        teamName={p2.primary_team}
                        role={roleMode === 'batters' ? 'batter' : 'bowler'}
                        size="xs"
                        ringColor="gold"
                      />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {roleMode === 'batters' ? (
                  <>
                    <tr>
                      <td className={`py-3 px-4 font-black ${stat1.adjusted_sr >= stat2.adjusted_sr ? 'text-emerald-400' : 'text-white/70'}`}>
                        {stat1.adjusted_sr.toFixed(1)} SR {stat1.adjusted_sr >= stat2.adjusted_sr && '👑'}
                      </td>
                      <td className="py-3 px-4 text-center text-rr-muted font-semibold">Empirical Bayes Adjusted SR</td>
                      <td className={`py-3 px-4 text-right font-black ${stat2.adjusted_sr > stat1.adjusted_sr ? 'text-emerald-400' : 'text-white/70'}`}>
                        {stat2.adjusted_sr > stat1.adjusted_sr && '👑 '} {stat2.adjusted_sr.toFixed(1)} SR
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-white/80">{stat1.overall_sr.toFixed(1)} SR</td>
                      <td className="py-3 px-4 text-center text-rr-muted font-semibold">Overall Baseline Strike Rate</td>
                      <td className="py-3 px-4 text-right text-white/80">{stat2.overall_sr.toFixed(1)} SR</td>
                    </tr>
                    <tr>
                      <td className={`py-3 px-4 font-bold ${stat1.sr_delta >= stat2.sr_delta ? 'text-emerald-400' : 'text-white/70'}`}>
                        +{stat1.sr_delta.toFixed(1)} {stat1.sr_delta >= stat2.sr_delta && '✓'}
                      </td>
                      <td className="py-3 px-4 text-center text-rr-muted font-semibold">Strike Rate Delta (Δ SR)</td>
                      <td className={`py-3 px-4 text-right font-bold ${stat2.sr_delta > stat1.sr_delta ? 'text-emerald-400' : 'text-white/70'}`}>
                        {stat2.sr_delta > stat1.sr_delta && '✓ '} +{stat2.sr_delta.toFixed(1)}
                      </td>
                    </tr>
                    <tr>
                      <td className={`py-3 px-4 ${stat1.pressure_balls >= stat2.pressure_balls ? 'text-white font-bold' : 'text-white/70'}`}>
                        {stat1.pressure_balls} balls ({stat1.pressure_matches} matches)
                      </td>
                      <td className="py-3 px-4 text-center text-rr-muted font-semibold">Sample Volume Faced</td>
                      <td className={`py-3 px-4 text-right ${stat2.pressure_balls > stat1.pressure_balls ? 'text-white font-bold' : 'text-white/70'}`}>
                        {stat2.pressure_balls} balls ({stat2.pressure_matches} matches)
                      </td>
                    </tr>
                    <tr>
                      <td className={`py-3 px-4 ${stat1.boundary_pct >= stat2.boundary_pct ? 'text-rr-pink font-bold' : 'text-white/70'}`}>
                        {stat1.boundary_pct.toFixed(1)}%
                      </td>
                      <td className="py-3 px-4 text-center text-rr-muted font-semibold">Pressure Boundary %</td>
                      <td className={`py-3 px-4 text-right ${stat2.boundary_pct > stat1.boundary_pct ? 'text-rr-pink font-bold' : 'text-white/70'}`}>
                        {stat2.boundary_pct.toFixed(1)}%
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-rr-pink">{stat1.tactical_role}</td>
                      <td className="py-3 px-4 text-center text-rr-muted font-semibold">Tactical Auction Profile</td>
                      <td className="py-3 px-4 text-right font-bold text-rr-gold">{stat2.tactical_role}</td>
                    </tr>
                  </>
                ) : (
                  <>
                    <tr>
                      <td className={`py-3 px-4 font-black ${stat1.adjusted_econ <= stat2.adjusted_econ ? 'text-emerald-400' : 'text-white/70'}`}>
                        {stat1.adjusted_econ.toFixed(2)} RPO {stat1.adjusted_econ <= stat2.adjusted_econ && '👑'}
                      </td>
                      <td className="py-3 px-4 text-center text-rr-muted font-semibold">Adjusted Economy (Lower is Better)</td>
                      <td className={`py-3 px-4 text-right font-black ${stat2.adjusted_econ < stat1.adjusted_econ ? 'text-emerald-400' : 'text-white/70'}`}>
                        {stat2.adjusted_econ < stat1.adjusted_econ && '👑 '} {stat2.adjusted_econ.toFixed(2)} RPO
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-white/80">{stat1.overall_econ.toFixed(2)} RPO</td>
                      <td className="py-3 px-4 text-center text-rr-muted font-semibold">Overall Baseline Economy</td>
                      <td className="py-3 px-4 text-right text-white/80">{stat2.overall_econ.toFixed(2)} RPO</td>
                    </tr>
                    <tr>
                      <td className={`py-3 px-4 font-bold ${stat1.econ_delta <= stat2.econ_delta ? 'text-emerald-400' : 'text-white/70'}`}>
                        {stat1.econ_delta > 0 ? '+' : ''}{stat1.econ_delta.toFixed(2)} {stat1.econ_delta <= stat2.econ_delta && '✓'}
                      </td>
                      <td className="py-3 px-4 text-center text-rr-muted font-semibold">Economy Delta (Δ Econ)</td>
                      <td className={`py-3 px-4 text-right font-bold ${stat2.econ_delta < stat1.econ_delta ? 'text-emerald-400' : 'text-white/70'}`}>
                        {stat2.econ_delta < stat1.econ_delta && '✓ '} {stat2.econ_delta > 0 ? '+' : ''}{stat2.econ_delta.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td className={`py-3 px-4 ${stat1.pressure_wickets >= stat2.pressure_wickets ? 'text-rr-gold font-bold' : 'text-white/70'}`}>
                        {stat1.pressure_wickets} wickets ({stat1.pressure_overs} ov)
                      </td>
                      <td className="py-3 px-4 text-center text-rr-muted font-semibold">Pressure Breakthroughs</td>
                      <td className={`py-3 px-4 text-right ${stat2.pressure_wickets > stat1.pressure_wickets ? 'text-rr-gold font-bold' : 'text-white/70'}`}>
                        {stat2.pressure_wickets} wickets ({stat2.pressure_overs} ov)
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-rr-pink">{stat1.tactical_role}</td>
                      <td className="py-3 px-4 text-center text-rr-muted font-semibold">Tactical Auction Profile</td>
                      <td className="py-3 px-4 text-right font-bold text-rr-gold">{stat2.tactical_role}</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div
          className="p-8 rounded-xl border border-white/[0.08] text-center space-y-3"
          style={{ background: '#111A30' }}
        >
          <GitCompare className="w-8 h-8 mx-auto text-rr-pink opacity-70" />
          <div className="text-sm font-bold text-white">Select Both Players to Compare</div>
          <p className="text-xs text-rr-muted max-w-md mx-auto">
            Use the Google-style search boxes above to select Player A and Player B from the {roleMode === 'batters' ? '255 qualified batters' : '172 qualified bowlers'} across domestic and international T20s.
          </p>
        </div>
      )}

      {/* ── VISUAL HEAD-TO-HEAD BARS ── */}
      {stat1 && stat2 && p1 && p2 && (
        <div
          className="p-5 rounded-xl"
          style={{ background: '#111A30', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-rr-gold" />
                Visual Side-by-Side Comparison
              </h3>
              <p className="text-xs text-rr-muted mt-0.5">
                Relative strengths across key statistical metrics
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonChartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                <XAxis dataKey="metric" stroke="#A7B2C7" fontSize={11} />
                <YAxis stroke="#6B7A99" fontSize={11} />
                <Tooltip contentStyle={{ background: '#0D1428', borderColor: '#241338', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey={p1.player_name} fill="#FF1768" radius={[4, 4, 0, 0]} />
                <Bar dataKey={p2.player_name} fill="#D4AF37" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
