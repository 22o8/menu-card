import type { DashboardSummary } from '~/types'
import { useApi } from './useApi'

const fallbackSummary: DashboardSummary = {
  totalBooks: 12,
  publishedBooks: 4,
  draftBooks: 8,
  totalPages: 38,
  totalViews: 18420,
  totalThemes: 4,
  totalAssets: 96
}

export const useDashboard = () => {
  const { buildUrl } = useApi()
  const summary = useState<DashboardSummary>('dashboard-summary', () => fallbackSummary)
  const pending = useState<boolean>('dashboard-pending', () => false)

  const loadSummary = async () => {
    pending.value = true
    try {
      summary.value = await $fetch<DashboardSummary>(buildUrl('/Dashboard/summary'))
    } catch {
      summary.value = fallbackSummary
    } finally {
      pending.value = false
    }

    return summary.value
  }

  return {
    summary,
    pending,
    loadSummary
  }
}
