import { NavLink, Outlet } from 'react-router-dom'
import { BarChart3, Bell, ChevronDown, HomeIcon, Layers3 } from 'lucide-react'
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

  return (
    <div className="relative flex min-h-svh dark bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-app transition-colors">
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
      <div className="relative z-10 flex min-h-svh flex-1 flex-col">
        {/* Top navbar */}
        <header className="sticky top-0 z-20 border-b border-white/10 bg-zinc-900/60 backdrop-blur">
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
            {/* Mobile sidebar hint / brand */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white/80 text-zinc-600 shadow-sm hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-zinc-300 dark:hover:bg-white/15 lg:hidden"
                aria-label="Open navigation"
              >
                <span className="sr-only">Open navigation</span>
                <span className="block h-[1px] w-4 bg-zinc-400" />
                <span className="mt-[5px] block h-[1px] w-4 bg-zinc-400" />
                <span className="mt-[5px] block h-[1px] w-4 bg-zinc-400" />
              </button>
              <div className="lg:hidden">
                <p className="text-sm font-semibold leading-tight text-app">
                  Dashboard UI
                </p>
                <p className="text-[11px] text-app-muted">
                  Overview
                </p>
              </div>
            </div>

            {/* Centered nav on mobile */}
            <nav className="flex items-center gap-1 text-xs font-medium text-zinc-700 sm:text-sm dark:text-zinc-400 lg:hidden">
              {navItems.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-full px-3 py-1 ${
                      isActive
                      ? 'bg-zinc-200 text-zinc-900 dark:bg-white/10 dark:text-zinc-50'
                      : 'hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/10 dark:hover:text-zinc-100'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Right controls */}
            <div className="flex items-center gap-3">
              {/* Role switcher (simple select) */}
              <div className="relative">
                <select
                  className="h-9 appearance-none rounded-full border border-zinc-300 bg-white/95 pl-3 pr-9 text-xs font-semibold text-zinc-900 shadow-sm outline-none ring-0 transition hover:border-violet-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/40 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-100 scheme-light dark:scheme-dark sm:text-sm"
                  value={role}
                  onChange={(e) => switchRole(e.target.value as Role)}
                >
                  {roles.map((roleItem) => (
                    <option key={roleItem} value={roleItem}>
                      {roleItem}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 dark:text-zinc-400" />
              </div>

              <button
                type="button"
                className="group inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 bg-white/95 text-zinc-800 shadow-sm transition hover:border-violet-400 hover:text-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:text-violet-300"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4 transition-transform duration-150 group-hover:scale-105" />
              </button>

              {/* User avatar */}
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 bg-white/95 text-xs font-semibold text-zinc-900 shadow-sm transition hover:border-violet-400 hover:text-violet-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:hover:text-violet-300"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-300/70 bg-gradient-to-br from-zinc-50 to-zinc-200 text-[11px] font-semibold text-zinc-900 dark:border-white/15 dark:from-white/10 dark:to-white/5 dark:text-zinc-50">
                  AS
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 px-4 pb-6 pt-4 sm:px-6 sm:pb-8 sm:pt-6">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:gap-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
