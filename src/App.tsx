import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { BrowsePage } from '@/pages/BrowsePage'
import { ReviewPage } from '@/pages/ReviewPage'
import { ZoneConfigPage } from '@/pages/ZoneConfigPage'
import { SummaryPage } from '@/pages/SummaryPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<BrowsePage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/zones" element={<ZoneConfigPage />} />
        <Route path="/summary" element={<SummaryPage />} />
      </Route>
    </Routes>
  )
}
