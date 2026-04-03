import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { X, Calendar, DollarSign, Tag, Activity } from 'lucide-react'
import { useDashboardStore } from '@/store'
import type { Transaction, TransactionCategory, TransactionType } from '@/data/transactions'

const CATEGORIES: TransactionCategory[] = [
  'Salary', 'Food', 'Shopping', 'Groceries', 'Rent', 'Utilities', 'Travel', 
  'Health', 'Education', 'Entertainment', 'Subscriptions', 'Transport', 
  'Freelance', 'Investments', 'Other'
]

type FormState = {
  date: string
  amount: string
  category: TransactionCategory
  type: TransactionType
}

type FormErrors = Partial<Record<keyof FormState, string>>

type AddTransactionModalProps = {
  onClose: () => void
  /** When set, the modal updates this transaction instead of creating one. */
  editing?: Transaction | null
}

export function AddTransactionModal({ onClose, editing = null }: AddTransactionModalProps) {
  const addTransaction = useDashboardStore((s) => s.addTransaction)
  const editTransaction = useDashboardStore((s) => s.editTransaction)

  const [form, setForm] = useState<FormState>(() =>
    editing
      ? {
          date: editing.date,
          amount: String(editing.amount),
          category: editing.category,
          type: editing.type,
        }
      : {
          date: new Date().toISOString().slice(0, 10),
          amount: '',
          category: 'Food',
          type: 'expense',
        },
  )

  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const validate = (): boolean => {
    const nextErrors: FormErrors = {}
    if (!form.date) nextErrors.date = 'Required'
    const amountValue = Number(form.amount.trim())
    if (!form.amount.trim()) nextErrors.amount = 'Required'
    else if (!Number.isFinite(amountValue) || amountValue <= 0) {
      nextErrors.amount = 'Must be > 0'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const onSubmit = () => {
    if (!validate()) return
    const payload = {
      date: form.date,
      amount: Number(form.amount.trim()),
      category: form.category,
      type: form.type,
    } satisfies Omit<Transaction, 'id'>
    if (editing) {
      editTransaction(editing.id, payload)
    } else {
      addTransaction(payload)
    }
    onClose()
  }

  const isEdit = Boolean(editing)

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 p-4 backdrop-blur-sm dark:bg-black/60">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-xl rounded-3xl border border-teal-100 p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              {isEdit ? 'Edit Transaction' : 'New Transaction'}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {isEdit
                ? 'Update this entry in your financial ledger.'
                : 'Add a new entry to your financial ledger.'}
            </p>
          </div>
          <button onClick={onClose} className="rounded-full bg-zinc-100 p-2 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {/* Date */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
              <Calendar className="h-3 w-3" /> Date
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 text-sm outline-none transition-all focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-200"
            />
            {errors.date && <p className="text-[10px] font-bold text-red-500">{errors.date}</p>}
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
              <DollarSign className="h-3 w-3" /> Amount (USD)
            </label>
            <input
              type="number"
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 text-sm outline-none transition-all focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-200"
            />
            {errors.amount && <p className="text-[10px] font-bold text-red-500">{errors.amount}</p>}
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
              <Tag className="h-3 w-3" /> Category
            </label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value as TransactionCategory })
              }
              className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 text-sm outline-none transition-all focus:border-teal-500 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-200"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Type */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
              <Activity className="h-3 w-3" /> Entry Type
            </label>
            <select
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value as TransactionType })
              }
              className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 text-sm outline-none transition-all focus:border-teal-500 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-200"
            >
              <option value="income">Inflow / Income</option>
              <option value="expense">Outflow / Expense</option>
            </select>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-end gap-3 border-t border-zinc-100 pt-6 dark:border-zinc-800">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
            Discard
          </button>
          <button
            onClick={onSubmit}
            className="rounded-xl bg-teal-600 px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-teal-600/20 hover:bg-teal-700 active:scale-95 transition-all"
          >
            {isEdit ? 'Save changes' : 'Confirm Entry'}
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  )
}
