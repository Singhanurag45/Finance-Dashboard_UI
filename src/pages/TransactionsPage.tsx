import { TransactionsTable } from '@/components/transactions/TransactionsTable'
import { motion } from 'framer-motion'

export function TransactionsPage() {
  return (
    <section className="relative space-y-8 pb-10">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />

      <header className="relative space-y-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-600 dark:text-teal-400 sm:text-[13px]">
              Ledger
            </p>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">
            Transactions
          </h1>
          <p className="max-w-md text-sm text-zinc-600 dark:text-zinc-400 sm:text-[15px]">
            Manage your cash flow with advanced search, filtering, and real-time sorting.
          </p>
        </div>
      </header>

      {/* Table Wrapper with refined styling */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl border border-teal-100/50 bg-white/50 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/50"
      >
        <TransactionsTable />
      </motion.div>
    </section>
  )
}
