import {
  Wallet2,
  ArrowDownCircle,
  ArrowUpCircle,
  Inbox,
  Download,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { appName } from "@/data";
import { useDashboardStore } from "@/store";
import { BalanceTrendChart } from "@/components/charts/BalanceTrendChart";
import { CategoryExpensesPieChart } from "@/components/charts/CategoryExpensesPieChart";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";

export function HomePage() {
  const transactions = useDashboardStore((s) => s.transactions);
  const role = useDashboardStore((s) => s.role);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setIsLoading(false), 300);
    return () => window.clearTimeout(t);
  }, []);

  const totals = useMemo(() => {
    let income = 0;
    let expenses = 0;
    transactions.forEach((t) => {
      if (t.type === "income") income += t.amount;
      else expenses += t.amount;
    });
    return { income, expenses, balance: income - expenses };
  }, [transactions]);

  const balanceTrend = useMemo(() => {
    const summaryByDate = new Map<string, { net: number; expenses: number }>();
    transactions.forEach((t) => {
      const net = t.type === "income" ? t.amount : -t.amount;
      const current = summaryByDate.get(t.date) ?? { net: 0, expenses: 0 };
      current.net += net;
      if (t.type === "expense") current.expenses += t.amount;
      summaryByDate.set(t.date, current);
    });
    const sortedDates = Array.from(summaryByDate.keys()).sort();
    const { points } = sortedDates.reduce(
      (state, date) => {
        const current = summaryByDate.get(date) ?? { net: 0, expenses: 0 };
        const balance = state.running + current.net;
        return {
          running: balance,
          points: [
            ...state.points,
            { date, balance, expenses: current.expenses },
          ],
        };
      },
      {
        running: 0,
        points: [] as { date: string; balance: number; expenses: number }[],
      },
    );
    return points;
  }, [transactions]);

  const expenseCategoryData = useMemo(() => {
    const totals = new Map<string, number>();
    transactions.forEach((t) => {
      if (t.type !== "expense") return;
      totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount);
    });
    const sorted = Array.from(totals.entries()).sort((a, b) => b[1] - a[1]);
    const top = sorted.slice(0, 7);
    const restSum = sorted.slice(7).reduce((acc, [, v]) => acc + v, 0);

    const withOther = top.map(([name, value]) => ({ name, value }));
    if (restSum > 0) withOther.push({ name: "Other", value: restSum });
    return withOther;
  }, [transactions]);

  const formatMoney = (value: number) => {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value);
  };

  const handleGenerateReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      role,
      totals: {
        income: totals.income,
        expenses: totals.expenses,
        balance: totals.balance,
      },
      expenseCategories: expenseCategoryData,
      balanceTrend,
      transactionsCount: transactions.length,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `finance-report-${new Date()
      .toISOString()
      .slice(0, 19)
      .replaceAll(":", "-")}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="min-w-0 max-w-full space-y-8 pb-10">
      {/* Header */}
      <header className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-600 dark:text-teal-400">
            {appName} System
          </p>
        </div>
        <div className="flex min-w-0 flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="min-w-0">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">
              Overview
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 sm:text-base">
              Monitor your fiscal health and transaction velocity in real-time.
            </p>
          </div>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-teal-600/20 hover:bg-teal-700 transition-all sm:w-auto sm:justify-start"
            onClick={handleGenerateReport}
          >
            <Download className="h-4 w-4" />
            Generate Report
          </motion.button>
        </div>
      </header>

      {/* Metrics Cards */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          title="Current Balance"
          value={totals.balance}
          isLoading={isLoading}
          icon={<Wallet2 className="h-5 w-5" />}
          trend={totals.balance >= 0 ? "Healthy Position" : "Deficit Warning"}
          variant="teal"
          formatMoney={formatMoney}
        />
        <MetricCard
          title="Monthly Income"
          value={totals.income}
          isLoading={isLoading}
          icon={<ArrowDownCircle className="h-5 w-5" />}
          trend="+12.4% vs last"
          variant="emerald"
          formatMoney={formatMoney}
        />
        <MetricCard
          title="Monthly Expenses"
          value={totals.expenses}
          isLoading={isLoading}
          icon={<ArrowUpCircle className="h-5 w-5" />}
          trend="-5.1% vs last"
          variant="rose"
          formatMoney={formatMoney}
        />
      </section>

      {/* Empty State */}
      {!isLoading && transactions.length === 0 && (
        <div className="rounded-3xl border border-dashed border-teal-200 bg-teal-50/30 p-10 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="mx-auto flex max-w-xs flex-col items-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-teal-500 shadow-sm ring-1 ring-teal-100 dark:bg-zinc-800 dark:ring-zinc-700">
              <Inbox className="h-6 w-6" />
            </div>
            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Clean Slate
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              Add transactions to start generating fiscal insights.
            </p>
            <Link
              to="/transactions"
              className="mt-5 rounded-xl bg-teal-600 px-6 py-2 text-sm font-bold text-white hover:bg-teal-700"
            >
              {role === "Admin" ? "Add Transaction" : "Go to Ledger"}
            </Link>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <section className="grid min-w-0 gap-6 lg:grid-cols-[1.8fr_1fr] [&>*]:min-w-0">
        <ChartContainer
          title="Balance Trend"
          subtitle="Cumulative growth over 30 days"
          icon={<BarChart3 className="h-4 w-4" />}
          badge="Live Feed"
          isLoading={isLoading}
        >
          <BalanceTrendChart data={balanceTrend} />
        </ChartContainer>

        <ChartContainer
          title="Spending Mix"
          subtitle="Top expense categories"
          icon={<PieChartIcon className="h-4 w-4" />}
          badge="Categorized"
          isLoading={isLoading}
        >
          <CategoryExpensesPieChart data={expenseCategoryData} />
        </ChartContainer>
      </section>

      {/* Transactions Table Section */}
      <div className="min-w-0 max-w-full overflow-x-auto rounded-3xl border border-zinc-100 bg-white/50 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="border-b border-zinc-100 p-4 sm:p-6 dark:border-zinc-800">
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100">
            Recent Transactions
          </h3>
        </div>
        <TransactionsTable />
      </div>
    </section>
  );
}

/* Helper Components for consistent UI */

type MetricVariant = "teal" | "emerald" | "rose";

type MetricCardProps = {
  title: string;
  value: number;
  isLoading: boolean;
  icon: ReactNode;
  trend: string;
  variant: MetricVariant;
  formatMoney: (amount: number) => string;
};

function MetricCard({
  title,
  value,
  isLoading,
  icon,
  trend,
  variant,
  formatMoney,
}: MetricCardProps) {
  const styles = {
    teal: "border-teal-100 bg-white hover:border-teal-500/30 shadow-teal-900/5 icon-bg-teal-600",
    emerald:
      "border-emerald-100 bg-emerald-50/30 hover:border-emerald-500/30 icon-bg-emerald-500",
    rose: "border-rose-100 bg-white hover:border-rose-500/30 icon-bg-rose-500",
  }[variant];

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative min-w-0 max-w-full overflow-hidden rounded-3xl border p-6 transition-all hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900 ${styles}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
            {title}
          </p>
          {isLoading ? (
            <div className="mt-2 h-9 w-32 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
          ) : (
            <p
              className={`mt-2 text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50`}
            >
              {formatMoney(value)}
            </p>
          )}
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg 
          ${
            variant === "teal"
              ? "bg-teal-600 shadow-teal-600/20"
              : variant === "emerald"
                ? "bg-emerald-500 shadow-emerald-500/20"
                : "bg-rose-500 shadow-rose-500/20"
          }`}
        >
          {icon}
        </div>
      </div>
      <p className="mt-4 text-xs font-bold text-zinc-500">{trend}</p>
    </motion.article>
  );
}

type ChartContainerProps = {
  title: string;
  subtitle: string;
  icon: ReactNode;
  badge: string;
  isLoading: boolean;
  children: ReactNode;
};

function ChartContainer({
  title,
  subtitle,
  icon,
  badge,
  isLoading,
  children,
}: ChartContainerProps) {
  return (
    <article className="min-w-0 max-w-full overflow-hidden rounded-3xl border border-zinc-100 bg-white p-4 shadow-sm transition-all hover:border-teal-500/20 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-3 sm:gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 sm:h-11 sm:w-11 dark:bg-teal-500/10 dark:text-teal-400">
            {icon}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100">
              {title}
            </h3>
            <p className="text-xs text-zinc-500">{subtitle}</p>
          </div>
        </div>
        <span className="w-fit shrink-0 rounded-full bg-zinc-50 px-3 py-1 text-[10px] font-bold text-zinc-500 dark:bg-zinc-800">
          {badge}
        </span>
      </div>
      {isLoading ? (
        <div className="h-[220px] w-full min-w-0 animate-pulse rounded-2xl bg-zinc-50 sm:h-64 dark:bg-zinc-800/50" />
      ) : (
        children
      )}
    </article>
  );
}
