import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { BarChart3 } from 'lucide-react'

export type MonthlyFlowDatum = {
  month: string
  income: number
  expenses: number
}

type Props = {
  data: MonthlyFlowDatum[]
}

function formatMoney(value: number) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)
}

export function MonthlyIncomeExpenseChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="bg-app-surface flex h-[260px] w-full min-w-0 max-w-full items-center justify-center rounded-2xl border border-app p-6 backdrop-blur shadow-sm sm:h-[320px]">
        <div className="max-w-sm text-center">
          <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-violet-300 ring-1 ring-white/15">
            <BarChart3 className="h-4.5 w-4.5" />
          </span>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            No cash flow data
          </p>
          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
            Add transactions to see monthly income vs expenses.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full min-h-[240px] w-full min-w-0 max-w-full sm:min-h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 12, right: 6, left: -14, bottom: 8 }}>
          <defs>
            <linearGradient id="incomeBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.55} />
            </linearGradient>
            <linearGradient id="expenseBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fb7185" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#f472b6" stopOpacity={0.55} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 4" />
          <XAxis
            dataKey="month"
            tick={{ fill: '#a1a1aa', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.10)' }}
            tickLine={{ stroke: 'rgba(255,255,255,0.10)' }}
          />
          <YAxis
            tick={{ fill: '#a1a1aa', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.10)' }}
            tickLine={{ stroke: 'rgba(255,255,255,0.10)' }}
            tickFormatter={(v) => {
              const abs = Math.abs(v)
              if (abs >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
              if (abs >= 1_000) return `${(v / 1_000).toFixed(1)}K`
              return String(v)
            }}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null
              return (
                <div className="min-w-44 rounded-xl border border-white/10 bg-zinc-950/70 p-3 backdrop-blur shadow-xl shadow-black/40">
                  <p className="text-xs font-semibold text-zinc-200">{label}</p>
                  <p className="mt-1 text-xs text-emerald-300">
                    Income: {typeof payload[0]?.value === 'number' ? formatMoney(payload[0].value) : '-'}
                  </p>
                  <p className="mt-1 text-xs text-rose-300">
                    Expenses: {typeof payload[1]?.value === 'number' ? formatMoney(payload[1].value) : '-'}
                  </p>
                </div>
              )
            }}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: 8 }}
          />
          <Bar dataKey="income" name="Income" fill="url(#incomeBar)" radius={[10, 10, 0, 0]} />
          <Bar dataKey="expenses" name="Expenses" fill="url(#expenseBar)" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

