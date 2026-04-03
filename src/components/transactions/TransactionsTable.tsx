import React, { type ComponentType, useEffect, useMemo, useState } from "react";
import {
  Search,
  ArrowUpDown,
  Trash2,
  Edit2,
  Download,
  Wallet,
  Utensils,
  ShoppingBag,
  Package,
  Home,
  Zap,
  Plane,
  HeartPulse,
  GraduationCap,
  Clapperboard,
  CreditCard,
  Car,
  BadgeDollarSign,
  Sparkles,
} from "lucide-react";
import { useDashboardStore } from "@/store";
import { AddTransactionModal } from "./AddTransactionModal";
import type {
  Transaction,
  TransactionCategory,
  TransactionType,
} from "@/data/transactions";

const CATEGORY_ICON: Record<TransactionCategory, ComponentType<{ className?: string }>> = {
  Salary: Wallet,
  Food: Utensils,
  Shopping: ShoppingBag,
  Groceries: Package,
  Rent: Home,
  Utilities: Zap,
  Travel: Plane,
  Health: HeartPulse,
  Education: GraduationCap,
  Entertainment: Clapperboard,
  Subscriptions: CreditCard,
  Transport: Car,
  Freelance: BadgeDollarSign,
  Investments: BadgeDollarSign,
  Other: Package,
};

function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function escapeCsv(value: string) {
  const escaped = value.replaceAll('"', '""');
  if (
    escaped.includes(",") ||
    escaped.includes('"') ||
    escaped.includes("\n") ||
    escaped.includes("\r")
  ) {
    return `"${escaped}"`;
  }
  return escaped;
}

export function TransactionsTable() {
  const transactions = useDashboardStore((s) => s.transactions);
  const role = useDashboardStore((s) => s.role);
  const deleteTransaction = useDashboardStore((s) => s.deleteTransaction);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TransactionType | "all">("all");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    return transactions
      .filter((t) => (typeFilter === "all" ? true : t.type === typeFilter))
      .filter((t) => {
        const query = search.trim().toLowerCase();
        if (!query) return true;

        return [
          t.id,
          t.category,
          t.type,
          t.amount.toString(),
          t.date,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortDir === "asc" ? dateA - dateB : dateB - dateA;
      });
  }, [transactions, search, typeFilter, sortDir]);

  const formatMoney = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);

  const handleExportCsv = () => {
    const header = ["Date", "Amount", "Category", "Type"];
    const csv = [
      header.join(","),
      ...filtered.map((transaction) =>
        [
          escapeCsv(transaction.date),
          escapeCsv(String(transaction.amount)),
          escapeCsv(transaction.category),
          escapeCsv(transaction.type),
        ].join(","),
      ),
    ].join("\n");

    const timestamp = new Date().toISOString().slice(0, 19).replaceAll(":", "-");
    downloadFile(
      `transactions-${timestamp}.csv`,
      csv,
      "text/csv;charset=utf-8",
    );
  };

  return (
    <div className="space-y-6 px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="rounded-3xl border border-teal-100/70 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70 sm:p-5">
        <div className="flex flex-col gap-4 border-b border-zinc-100 pb-4 dark:border-zinc-800 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Ledger Entries
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Search, filter, sort, export, and manage transactions from one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-xs font-bold text-zinc-700 transition-all hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-teal-500/30 dark:hover:bg-teal-500/10 dark:hover:text-teal-300"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>

            {role === "Admin" && (
              <button
                type="button"
                onClick={() => {
                  setEditingTransaction(null);
                  setIsAddModalOpen(true);
                }}
                className="inline-flex h-10 items-center rounded-xl bg-teal-600 px-4 text-xs font-bold text-white shadow-lg shadow-teal-600/20 transition-all hover:bg-teal-700"
              >
                Add Transaction
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by date, amount, category, type, or id..."
              className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-4 text-sm text-zinc-700 outline-none transition-all focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 dark:border-zinc-800 dark:bg-zinc-950/80 dark:text-zinc-200"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value as TransactionType | "all")
              }
              className="h-11 min-w-[132px] rounded-xl border border-zinc-200 bg-white px-3 text-xs font-bold text-zinc-700 outline-none transition-all focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 dark:border-zinc-800 dark:bg-zinc-950/80 dark:text-zinc-300"
            >
              <option value="all">All Flows</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <button
              type="button"
              onClick={() =>
                setSortDir((prev) => (prev === "asc" ? "desc" : "asc"))
              }
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-xs font-bold text-zinc-700 transition-all hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 dark:border-zinc-800 dark:bg-zinc-950/80 dark:text-zinc-300 dark:hover:border-teal-500/30 dark:hover:bg-teal-500/10 dark:hover:text-teal-300"
            >
              <ArrowUpDown className="h-4 w-4" />
              Date {sortDir === "asc" ? "Oldest" : "Newest"}
            </button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-3xl border border-teal-100/60 bg-white/60 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  Date
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  Amount
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  Category
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  Type
                </th>
                {role === "Admin" && (
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-20 text-center text-zinc-400 animate-pulse font-medium"
                  >
                    Syncing Ledger...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Sparkles className="h-8 w-8 text-teal-500/40" />
                      <p className="text-sm font-bold text-zinc-500">
                        No records found
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr
                    key={t.id}
                    className="group hover:bg-teal-50/40 dark:hover:bg-teal-500/5 transition-all"
                  >
                    <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                      {new Date(t.date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td
                      className={`px-6 py-4 text-sm font-bold ${t.type === "income" ? "text-emerald-600" : "text-red-600"}`}
                    >
                      {t.type === "income" ? "+" : "-"}
                      {formatMoney(t.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                          {React.createElement(CATEGORY_ICON[t.category], {
                            className: "h-4 w-4",
                          })}
                        </div>
                        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                          {t.category}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-tighter ${
                          t.type === "income"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                        }`}
                      >
                        {t.type}
                      </span>
                    </td>
                    {role === "Admin" && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            aria-label="Edit transaction"
                            onClick={() => {
                              setIsAddModalOpen(false);
                              setEditingTransaction(t);
                            }}
                            className="p-2 text-zinc-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-500/10 rounded-lg"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteTransaction(t.id)}
                            className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {(isAddModalOpen || editingTransaction) && (
        <AddTransactionModal
          key={editingTransaction?.id ?? "add"}
          editing={editingTransaction}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingTransaction(null);
          }}
        />
      )}
    </div>
  );
}
