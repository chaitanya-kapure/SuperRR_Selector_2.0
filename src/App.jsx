import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import PlayerDiscovery from './pages/PlayerDiscovery'
import PlayerAnalytics from './pages/PlayerAnalytics'
import AuctionIntelligence from './pages/AuctionIntelligence'
import Shortlist from './pages/Shortlist'
import Methodology from './pages/Methodology'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/discovery" element={<PlayerDiscovery />} />
        <Route path="/analytics" element={<PlayerAnalytics />} />
        <Route path="/auction" element={<AuctionIntelligence />} />
        <Route path="/shortlist" element={<Shortlist />} />
        <Route path="/methodology" element={<Methodology />} />
      </Route>
    </Routes>
  )
}
