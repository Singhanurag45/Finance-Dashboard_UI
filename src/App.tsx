import { Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components'
import { HomePage, InsightsPage, TransactionsPage } from '@/pages'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/insights" element={<InsightsPage />} />
      </Route>
    </Routes>
  )
}
