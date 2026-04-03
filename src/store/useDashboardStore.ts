import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  type Transaction,
  type TransactionCategory,
  type TransactionType,
  transactions as seedTransactions,
} from '@/data/transactions'

export type Role = 'Admin' | 'Viewer'

export type Theme = 'dark'

export type TransactionFilters = {
  type: 'all' | TransactionType
  category: 'all' | TransactionCategory
  query: string
  fromDate: string // YYYY-MM-DD or empty
  toDate: string // YYYY-MM-DD or empty
}

function normalizeDate(value: string): string {
  return value.trim()
}

function applyTransactionFilters(
  all: Transaction[],
  filters: TransactionFilters,
): Transaction[] {
  const type = filters.type
  const category = filters.category
  const query = filters.query.trim().toLowerCase()
  const fromDate = normalizeDate(filters.fromDate)
  const toDate = normalizeDate(filters.toDate)

  return all
    .filter((t) => (type === 'all' ? true : t.type === type))
    .filter((t) => (category === 'all' ? true : t.category === category))
    .filter((t) => {
      if (!fromDate && !toDate) return true
      if (fromDate && t.date < fromDate) return false
      if (toDate && t.date > toDate) return false
      return true
    })
    .filter((t) => {
      if (!query) return true
      const haystack = `${t.id} ${t.category} ${t.type}`.toLowerCase()
      return haystack.includes(query)
    })
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}

function makeId(): string {
  // Browser runtime: best-effort unique id.
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `txn_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

type AddTransactionInput = Omit<Transaction, 'id'> & { id?: string }

export type DashboardState = {
  // Transactions
  transactions: Transaction[]
  filteredTransactions: Transaction[]

  // Filters
  filters: TransactionFilters

  // Selected role
  role: Role

  // Theme
  theme: Theme

  // Actions
  addTransaction: (input: AddTransactionInput) => void
  filterTransactions: (next: Partial<TransactionFilters>) => void
  switchRole: (role: Role) => void
  deleteTransaction: (id: string) => void
  editTransaction: (
    id: string,
    next: Partial<Omit<Transaction, 'id'>>,
  ) => void
}

const defaultFilters: TransactionFilters = {
  type: 'all',
  category: 'all',
  query: '',
  fromDate: '',
  toDate: '',
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => {
      const initialTransactions = seedTransactions
      const initialFiltered = applyTransactionFilters(
        initialTransactions,
        defaultFilters,
      )

      return {
        transactions: initialTransactions,
        filteredTransactions: initialFiltered,
        filters: defaultFilters,
        role: 'Admin',
        theme: 'dark',

        addTransaction: (input) => {
          const id = input.id ?? makeId()
          const nextTx: Transaction = {
            id,
            date: input.date,
            amount: input.amount,
            category: input.category,
            type: input.type,
          }

          set((state) => {
            const transactions = [nextTx, ...state.transactions]
            const filteredTransactions = applyTransactionFilters(
              transactions,
              state.filters,
            )
            return { transactions, filteredTransactions }
          })
        },

        filterTransactions: (next) => {
          const mergedFilters = { ...get().filters, ...next }
          const filteredTransactions = applyTransactionFilters(
            get().transactions,
            mergedFilters,
          )
          set({ filters: mergedFilters, filteredTransactions })
        },

        switchRole: (role) => {
          set({ role })
        },

        deleteTransaction: (id) => {
          set((state) => {
            const transactions = state.transactions.filter((t) => t.id !== id)
            const filteredTransactions = applyTransactionFilters(
              transactions,
              state.filters,
            )
            return { transactions, filteredTransactions }
          })
        },

        editTransaction: (id, next) => {
          set((state) => {
            const transactions = state.transactions.map((t) => {
              if (t.id !== id) return t
              return { ...t, ...next }
            })
            const filteredTransactions = applyTransactionFilters(
              transactions,
              state.filters,
            )
            return { transactions, filteredTransactions }
          })
        },
      }
    },
    {
      name: 'dashboard_ui_store',
      version: 1,
      // Only persist what's requested: transactions + selected role.
      partialize: (state) => ({
        transactions: state.transactions,
        role: state.role,
        theme: 'dark',
      }),
      onRehydrateStorage: () => (state) => {
        // After rehydrating transactions, ensure derived `filteredTransactions`
        // matches the current filters.
        if (state) {
          state.theme = 'dark'
        }
        state?.filterTransactions({})
      },
    },
  ),
)
