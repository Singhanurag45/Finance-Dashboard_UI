import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDashboardStore } from "@/store";
import type { TransactionCategory } from "@/data/transactions";
import { MonthlyIncomeExpenseChart } from "@/components/charts/MonthlyIncomeExpenseChart";
import {
  BarChart3,
  Sparkles,
  TrendingUp,
  Wallet,
  ArrowUpRight,
} from "lucide-react";

// Helper for currency formatting
function formatMoney(value: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function monthKeyToLabel(yyyyMm: string) {
  const [y, m] = yyyyMm.split("-");
  const date = new Date(Number(y), Number(m) - 1, 1);
  if (Number.isNaN(date.getTime())) return yyyyMm;
  return date.toLocaleString(undefined, { month: "short", year: "2-digit" });
}

export function InsightsPage() {
  const transactions = useDashboardStore((s) => s.transactions);
  const role = useDashboardStore((s) => s.role);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setIsLoading(false), 400);
    return () => window.clearTimeout(t);
  }, []);

  const insights = useMemo(() => {
    const incomeTotal = transactions.reduce(
      (acc, t) => (t.type === "income" ? acc + t.amount : acc),
      0,
    );
    const expensesTotal = transactions.reduce(
      (acc, t) => (t.type === "expense" ? acc + t.amount : acc),
      0,
    );
    const netSavings = incomeTotal - expensesTotal;
    const savingsRate = incomeTotal > 0 ? (netSavings / incomeTotal) * 100 : 0;

    const byCategory = new Map<TransactionCategory, number>();
    transactions.forEach((t) => {
      if (t.type !== "expense") return;
      byCategory.set(t.category, (byCategory.get(t.category) ?? 0) + t.amount);
    });

    const sortedCats = Array.from(byCategory.entries()).sort(
      (a, b) => b[1] - a[1],
    );
    const highestSpending =
      sortedCats.length > 0
        ? { category: sortedCats[0][0], amount: sortedCats[0][1] }
        : null;

    const byMonth = new Map<string, { income: number; expenses: number }>();
    transactions.forEach((t) => {
      const month = t.date.slice(0, 7);
      const current = byMonth.get(month) ?? { income: 0, expenses: 0 };
      if (t.type === "income") current.income += t.amount;
      else current.expenses += t.amount;
      byMonth.set(month, current);
    });

    const months = Array.from(byMonth.keys()).sort();
    const lastMonths = months.slice(Math.max(0, months.length - 6));
    const monthlyData = lastMonths.map((month) => {
      const v = byMonth.get(month) ?? { income: 0, expenses: 0 };
      return {
        month: monthKeyToLabel(month),
        income: v.income,
        expenses: v.expenses,
      };
    });

    return {
      incomeTotal,
      expensesTotal,
      netSavings,
      savingsRate,
      highestSpending,
      monthlyData,
    };
  }, [transactions]);

  return (
    <section className="min-w-0 max-w-full space-y-8 pb-10">
      {/* Header Section */}
      <header className="relative space-y-2">
        <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
          <TrendingUp className="h-4 w-4" />
          <p className="text-xs font-bold uppercase tracking-widest sm:text-[13px]">
            Market Intelligence
          </p>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">
          Financial Insights
        </h1>
        <p className="max-w-2xl text-sm text-zinc-600 dark:text-zinc-400 sm:text-base">
          Real-time analysis of your cash flow, savings velocity, and top
          spending categories.
        </p>
      </header>

      {/* Empty State */}
      {!isLoading && transactions.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-dashed border-teal-200 bg-teal-50/50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/50"
        >
          <div className="mx-auto flex max-w-sm flex-col items-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-teal-500 shadow-sm ring-1 ring-teal-100 dark:bg-zinc-800 dark:text-teal-400 dark:ring-zinc-700">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Calculating your future...
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Add your first transaction to unlock deep-dive analytics and
              spending trends.
            </p>
            <Link
              to="/transactions"
              className="mt-6 flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-teal-700 hover:shadow-lg hover:shadow-teal-600/20 active:scale-95"
            >
              {role === "Admin" ? "Create Transaction" : "Explore Data"}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <section className="grid min-w-0 gap-5 sm:grid-cols-2 lg:grid-cols-3 [&>*]:min-w-0">
        {/* Card 1: Top Spending */}
        <StatCard title="Highest Spending" isLoading={isLoading} index={0}>
          {insights.highestSpending ? (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  {insights.highestSpending.category}
                </p>
                <p className="text-sm text-zinc-500">
                  {formatMoney(insights.highestSpending.amount)} total
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-zinc-500 italic">No data yet</p>
          )}
        </StatCard>

        {/* Card 2: Net Savings */}
        <StatCard title="Net Savings" isLoading={isLoading} index={1}>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <p
                className={`text-2xl font-bold ${insights.netSavings >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600"}`}
              >
                {formatMoney(insights.netSavings)}
              </p>
              <span
                className={`text-[10px] font-black uppercase tracking-tighter ${insights.netSavings >= 0 ? "text-emerald-600/60" : "text-red-600/60"}`}
              >
                {insights.netSavings >= 0 ? "Surplus" : "Deficit"}
              </span>
            </div>
            <p className="mt-1 text-sm text-zinc-500">
              Rate:{" "}
              <span className="font-bold text-zinc-900 dark:text-zinc-100">
                {insights.savingsRate.toFixed(1)}%
              </span>
            </p>
          </div>
        </StatCard>

        {/* Card 3: Monthly Flow */}
        <StatCard title="Total Cash Flow" isLoading={isLoading} index={2}>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Income</span>
              <span className="font-bold text-emerald-600">
                {formatMoney(insights.incomeTotal)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Expenses</span>
              <span className="font-bold text-red-600">
                {formatMoney(insights.expensesTotal)}
              </span>
            </div>
          </div>
        </StatCard>
      </section>

      {/* Main Chart Section */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="min-w-0 max-w-full overflow-hidden rounded-3xl border border-teal-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="flex flex-col items-start justify-between gap-4 border-b border-zinc-100 p-6 sm:flex-row sm:items-center dark:border-zinc-800">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Volume Comparison
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Monthly Inflow vs Outflow
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-zinc-50 px-3 py-1 dark:bg-zinc-800">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-widest">
              Past {insights.monthlyData.length} Months
            </span>
          </div>
        </div>

        <div className="min-w-0 p-4 sm:p-6">
          {isLoading ? (
            <div className="h-[260px] w-full min-w-0 animate-pulse rounded-2xl bg-zinc-100 sm:h-[350px] dark:bg-zinc-800/50" />
          ) : (
            <div className="h-[260px] w-full min-w-0 sm:h-[350px]">
              <MonthlyIncomeExpenseChart data={insights.monthlyData} />
            </div>
          )}
        </div>
      </motion.article>
    </section>
  );
}

// Sub-component for Cleaner Code
function StatCard({
  title,
  isLoading,
  children,
  index,
}: {
  title: string;
  isLoading: boolean;
  children: React.ReactNode;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative flex min-w-0 max-w-full flex-col justify-between overflow-hidden rounded-3xl border border-teal-50 bg-white p-5 shadow-sm transition-all hover:border-teal-200 hover:shadow-xl hover:shadow-teal-900/5 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-teal-500/30 sm:p-6"
    >
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-teal-600 transition-colors">
          {title}
        </p>
        <div className="mt-4">
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-8 w-32 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
              <div className="h-4 w-20 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
            </div>
          ) : (
            children
          )}
        </div>
      </div>
      {/* Subtle accent line on hover */}
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-teal-500 transition-all group-hover:w-full" />
    </motion.article>
  );
}
