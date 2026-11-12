import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Overview from './pages/Overview'
import BattingAnalytics from './pages/BattingAnalytics'
import BowlingAnalytics from './pages/BowlingAnalytics'
import PlayerComparison from './pages/PlayerComparison'
import Top10Batters from './pages/Top10Batters'
import Top10Bowlers from './pages/Top10Bowlers'
import Methodology from './pages/Methodology'
import DataQuality from './pages/DataQuality'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Core Competition Routes */}
        <Route path="/" element={<Overview />} />
        <Route path="/batting" element={<BattingAnalytics />} />
        <Route path="/bowling" element={<BowlingAnalytics />} />
        <Route path="/comparison" element={<PlayerComparison />} />
        <Route path="/top-batters" element={<Top10Batters />} />
        <Route path="/top-bowlers" element={<Top10Bowlers />} />
        <Route path="/methodology" element={<Methodology />} />
        <Route path="/data-quality" element={<DataQuality />} />

        {/* Backward-compatibility aliases for legacy URLs */}
        <Route path="/discovery" element={<Navigate to="/batting" replace />} />
        <Route path="/analytics" element={<Navigate to="/batting" replace />} />
        <Route path="/auction" element={<Navigate to="/top-batters" replace />} />
        <Route path="/shortlist" element={<Navigate to="/top-batters" replace />} />

        {/* Catch-all redirect to Overview */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
