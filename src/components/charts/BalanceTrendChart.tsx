import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { LineChart } from 'lucide-react'
import { useDashboardStore } from '@/store'

export type BalanceTrendPoint = {
  date: string // ISO date YYYY-MM-DD
  balance: number
  expenses: number
}

type Props = {
  data: BalanceTrendPoint[]
}

function formatMoney(value: number) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)
}

function formatAxisDate(isoDate: string) {
  // Display month/day for a compact dashboard axis.
  // Invalid dates fall back to raw string.
  const d = new Date(isoDate + 'T00:00:00')
  if (Number.isNaN(d.getTime())) return isoDate
  return d.toLocaleDateString(undefined, { month: 'short', day: '2-digit' })
}

export function BalanceTrendChart({ data }: Props) {
  const theme = useDashboardStore((s) => s.theme)
  const isDark = theme === 'dark'

  if (data.length === 0) {
    return (
      <div className="bg-app-surface flex h-[240px] w-full min-w-0 max-w-full items-center justify-center rounded-2xl border border-app p-6 backdrop-blur shadow-sm sm:h-[320px]">
        <div className="max-w-sm text-center">
          <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-violet-300 ring-1 ring-white/15">
            <LineChart className="h-4.5 w-4.5" />
          </span>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            No data to plot
          </p>
          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
            Add transactions to see your balance trend.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[240px] w-full min-w-0 max-w-full sm:h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 12, right: 8, left: -12, bottom: 4 }}
        >
          <defs>
            <linearGradient id="balanceArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.28} />
              <stop offset="55%" stopColor="#60a5fa" stopOpacity={0.12} />
              <stop offset="100%" stopColor="#000000" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.10)'}
            strokeDasharray="3 4"
          />
          <XAxis
            dataKey="date"
            tickFormatter={formatAxisDate}
            tick={{ fill: isDark ? '#a1a1aa' : '#64748b', fontSize: 12 }}
            axisLine={{
              stroke: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.14)',
            }}
            tickLine={{
              stroke: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.14)',
            }}
          />
          <YAxis
            tick={{ fill: isDark ? '#a1a1aa' : '#64748b', fontSize: 12 }}
            tickFormatter={(v) => {
              // Keep labels readable: compact large numbers.
              const abs = Math.abs(v)
              if (abs >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
              if (abs >= 1_000) return `${(v / 1_000).toFixed(1)}K`
              return String(v)
            }}
            axisLine={{
              stroke: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.14)',
            }}
            tickLine={{
              stroke: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.14)',
            }}
          />

          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null
              const balanceValue = payload.find((item) => item.dataKey === 'balance')?.value
              const expensesValue = payload.find((item) => item.dataKey === 'expenses')?.value
              return (
                <div
                  className={`min-w-40 rounded-xl p-3 backdrop-blur shadow-xl ${
                    isDark
                      ? 'border border-white/10 bg-zinc-950/80 shadow-black/40'
                      : 'border border-zinc-200 bg-white/95 shadow-zinc-900/10'
                  }`}
                >
                  <p
                    className={`text-xs font-semibold ${
                      isDark ? 'text-zinc-200' : 'text-zinc-800'
                    }`}
                  >
                    {typeof label === 'string' ? formatAxisDate(label) : ''}
                  </p>
                  <p
                    className={`mt-1 text-xs ${
                      isDark ? 'text-zinc-400' : 'text-zinc-500'
                    }`}
                  >
                    Balance
                  </p>
                  <p
                    className={`text-sm font-semibold ${
                      isDark ? 'text-white' : 'text-zinc-950'
                    }`}
                  >
                    {typeof balanceValue === 'number' ? formatMoney(balanceValue) : '-'}
                  </p>
                  <p
                    className={`mt-2 text-xs ${
                      isDark ? 'text-zinc-400' : 'text-zinc-500'
                    }`}
                  >
                    Expenses
                  </p>
                  <p className="text-sm font-semibold text-rose-400">
                    {typeof expensesValue === 'number' ? formatMoney(expensesValue) : '-'}
                  </p>
                </div>
              )
            }}
          />

          <Area
            type="monotone"
            dataKey="balance"
            stroke="url(#balanceStroke)"
            strokeWidth={2.4}
            fill="url(#balanceArea)"
            fillOpacity={1}
            dot={false}
            activeDot={{
              r: 4,
              stroke: '#a78bfa',
              strokeWidth: 2,
              fill: isDark ? '#0b0b10' : '#ffffff',
            }}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="#fb7185"
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 4,
              stroke: '#fb7185',
              strokeWidth: 2,
              fill: isDark ? '#0b0b10' : '#ffffff',
            }}
            isAnimationActive={false}
          />
          <defs>
            <linearGradient id="balanceStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="55%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
