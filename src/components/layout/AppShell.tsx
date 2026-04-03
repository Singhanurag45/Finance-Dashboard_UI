import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  BarChart3,
  Bell,
  ChevronDown,
  HomeIcon,
  Layers3,
  Menu,
  X,
} from 'lucide-react'
import { useDashboardStore, type Role } from '@/store'
import NewSidebar from '@/components/layout/NewSidebar'

const navItems = [
  { id: 'dashboard', to: '/', label: 'Overview', icon: HomeIcon },
  { id: 'transactions', to: '/transactions', label: 'Transactions', icon: Layers3 },
  { id: 'insights', to: '/insights', label: 'Insights', icon: BarChart3 },
]

const roles: Role[] = ['Admin', 'Viewer']

export function AppShell() {
  const role = useDashboardStore((s) => s.role)
  const switchRole = useDashboardStore((s) => s.switchRole)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    if (!mobileNavOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileNavOpen(false)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [mobileNavOpen])

  return (
    <div className="relative flex min-h-svh w-full min-w-0 max-w-[100vw] overflow-x-hidden dark bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-app transition-colors">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60 bg-[radial-gradient(ellipse_at_top,_rgba(167,139,250,0.35)_0%,transparent_60%),radial-gradient(ellipse_at_bottom,_rgba(59,130,246,0.25)_0%,transparent_55%)]"
      />
      {/* Sidebar - desktop */}
      <NewSidebar />
      {/* <aside className="relative z-10 hidden w-64 shrink-0 border-r border-app bg-white/30 px-4 py-6 lg:flex lg:flex-col dark:bg-app-surface dark:backdrop-blur">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-indigo-500 to-sky-400 text-white shadow-md shadow-violet-500/40">
            <span className="text-base font-semibold">DF</span>
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight text-zinc-900 dark:text-zinc-50">
              Dashboard UI
            </p>
            <p className="text-xs text-app-muted">
              Fintech control center
            </p>
          </div>
        </div>

        <nav className="mt-8 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.to}
              className={({ isActive }) =>
                `group flex w-full items-center justify-between rounded-full px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-white text-violet-700 shadow-sm shadow-violet-500/10 ring-1 ring-violet-500/20 dark:bg-white/10 dark:text-zinc-50 dark:ring-white/20'
                    : 'text-app-muted hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/5 dark:hover:text-zinc-100'
                }`
              }
            >
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full transition-transform duration-150 group-hover:scale-105 ${
                    item.id === 'dashboard'
                      ? 'bg-gradient-to-br from-violet-500/90 to-indigo-500/90 text-white shadow-sm shadow-violet-500/30'
                      : 'bg-zinc-100 text-zinc-500 group-hover:text-violet-600 dark:bg-zinc-900/60 dark:text-zinc-300 dark:group-hover:text-violet-300'
                  }`}
                >
                  <item.icon className="h-3.5 w-3.5" />
                </span>
                <span className="text-xs font-medium tracking-wide uppercase">
                  {item.label}
                </span>
              </div>
              {item.id === 'dashboard' && (
                <span className="rounded-full bg-zinc-900/10 px-2 text-[10px] uppercase tracking-wide text-zinc-600 dark:bg-zinc-50/10 dark:text-zinc-300">
                  Live
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-xl border border-app bg-white/30 p-4 text-xs dark:border-zinc-800/60 dark:bg-zinc-800/50">
          <p className="font-semibold text-zinc-900 dark:text-zinc-50">
            Need help?
          </p>
          <p className="text-app-muted">
            Check our docs or contact support.
          </p>
        </div>
      </aside> */}



      {/* Main column */}
      <div className="relative z-10 flex min-h-svh min-w-0 flex-1 flex-col overflow-x-hidden">
        {/* Mobile navigation drawer */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
              aria-label="Close navigation"
              onClick={() => setMobileNavOpen(false)}
            />
            <div className="absolute left-0 top-0 flex h-full w-[min(100vw,18rem)] flex-col border-r border-white/10 bg-zinc-900 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <p className="text-sm font-semibold text-zinc-100">Menu</p>
                <button
                  type="button"
                  className="rounded-lg p-2 text-zinc-400 hover:bg-white/10 hover:text-zinc-100"
                  aria-label="Close menu"
                  onClick={() => setMobileNavOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex flex-col gap-1 p-3">
                {navItems.map((item) => (
                  <NavLink
                    key={item.id}
                    to={item.to}
                    onClick={() => setMobileNavOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20'
                          : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                      }`
                    }
                  >
                    <item.icon className="h-5 w-5 opacity-90" />
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Top navbar */}
        <header className="sticky top-0 z-20 min-w-0 border-b border-white/10 bg-zinc-900/60 backdrop-blur">
          <div className="flex min-w-0 items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-6">
            <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
              <button
                type="button"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white/80 text-zinc-700 shadow-sm hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-zinc-200 dark:hover:bg-white/15 lg:hidden"
                aria-expanded={mobileNavOpen}
                aria-label={mobileNavOpen ? 'Close navigation' : 'Open navigation'}
                onClick={() => setMobileNavOpen((o) => !o)}
              >
                {mobileNavOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
              <div className="min-w-0 lg:hidden">
                <p className="truncate text-sm font-semibold leading-tight text-app">
                  Dashboard UI
                </p>
                <p className="truncate text-[11px] text-app-muted">
                  Fintech control center
                </p>
              </div>
            </div>

            {/* Right controls */}
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
              <div className="relative">
                <select
                  className="h-8 max-w-[5.75rem] appearance-none truncate rounded-full border border-zinc-300 bg-white/95 pl-2 pr-7 text-[11px] font-semibold text-zinc-900 shadow-sm outline-none ring-0 transition hover:border-violet-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/40 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-100 scheme-light dark:scheme-dark sm:h-9 sm:max-w-none sm:pl-3 sm:pr-9 sm:text-sm"
                  value={role}
                  onChange={(e) => switchRole(e.target.value as Role)}
                  aria-label="Role"
                >
                  {roles.map((roleItem) => (
                    <option key={roleItem} value={roleItem}>
                      {roleItem}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500 sm:right-3 sm:h-4 sm:w-4 dark:text-zinc-400" />
              </div>

              <button
                type="button"
                className="group inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-300 bg-white/95 text-zinc-800 shadow-sm transition hover:border-violet-400 hover:text-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40 sm:h-9 sm:w-9 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:text-violet-300"
                aria-label="Notifications"
              >
                <Bell className="h-3.5 w-3.5 transition-transform duration-150 group-hover:scale-105 sm:h-4 sm:w-4" />
              </button>

              <button
                type="button"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-300 bg-white/95 text-xs font-semibold text-zinc-900 shadow-sm transition hover:border-violet-400 hover:text-violet-600 sm:h-9 sm:w-9 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:hover:text-violet-300"
                aria-label="Account"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-zinc-300/70 bg-gradient-to-br from-zinc-50 to-zinc-200 text-[10px] font-semibold text-zinc-900 sm:h-7 sm:w-7 sm:text-[11px] dark:border-white/15 dark:from-white/10 dark:to-white/5 dark:text-zinc-50">
                  AS
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="min-w-0 flex-1 px-3 pb-6 pt-4 sm:px-6 sm:pb-8 sm:pt-6">
          <div className="mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-4 sm:gap-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
