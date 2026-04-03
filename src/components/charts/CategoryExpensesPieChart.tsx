import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { PieChart as PieChartIcon } from 'lucide-react'
import { useDashboardStore } from '@/store'

export type CategoryExpenseDatum = {
  name: string
  value: number
}

type Props = {
  data: CategoryExpenseDatum[]
}

const PALETTE = [
  '#f472b6', // fuchsia/pink
  '#a78bfa', // violet
  '#60a5fa', // blue
  '#34d399', // emerald
  '#fbbf24', // amber
  '#fb7185', // rose
  '#22c55e', // green
  '#38bdf8', // sky
]

function formatMoney(value: number) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)
}

export function CategoryExpensesPieChart({ data }: Props) {
  const theme = useDashboardStore((s) => s.theme)
  const isDark = theme === 'dark'

  if (data.length === 0) {
    return (
      <div className="bg-app-surface flex h-[320px] w-full items-center justify-center rounded-2xl border border-app p-6 backdrop-blur shadow-sm">
        <div className="max-w-sm text-center">
          <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-violet-300 ring-1 ring-white/15">
            <PieChartIcon className="h-4.5 w-4.5" />
          </span>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            No expenses available
          </p>
          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
            Add expense transactions to see category distribution.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const p = payload[0]
              const name = p?.name
              const value = p?.value
              return (
                <div
                  className={`rounded-xl p-3 backdrop-blur shadow-sm ${
                    isDark
                      ? 'border border-white/10 bg-zinc-950/80 shadow-black/20'
                      : 'border border-zinc-200 bg-white/95 shadow-zinc-900/10'
                  }`}
                >
                  <p
                    className={`text-xs font-semibold ${
                      isDark ? 'text-zinc-200' : 'text-zinc-800'
                    }`}
                  >
                    {name}
                  </p>
                  <p
                    className={`mt-1 text-xs ${
                      isDark ? 'text-zinc-400' : 'text-zinc-500'
                    }`}
                  >
                    Expenses
                  </p>
                  <p
                    className={`text-sm font-semibold ${
                      isDark ? 'text-white' : 'text-zinc-950'
                    }`}
                  >
                    {typeof value === 'number' ? formatMoney(value) : '-'}
                  </p>
                </div>
              )
            }}
          />

          <Pie
            data={data}
            nameKey="name"
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={95}
            paddingAngle={3}
            stroke={isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.9)'}
            isAnimationActive={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${entry.name}`}
                fill={PALETTE[index % PALETTE.length]}
              />
            ))}
          </Pie>

          <Legend
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: 10 }}
            formatter={(value) => (
              <span
                className={`text-xs ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}
              >
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
