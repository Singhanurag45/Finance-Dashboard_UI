import { NavLink } from 'react-router-dom'
import { BarChart3, HomeIcon, Layers3 } from 'lucide-react'

const navItems = [
  { id: 'dashboard', label: 'Overview', to: '/', icon: HomeIcon },
  { id: 'transactions', label: 'Transactions', to: '/transactions', icon: Layers3 },
  { id: 'insights', label: 'Insights', to: '/insights', icon: BarChart3 },
]

const NewSidebar = () => {
  return (
    <aside className="relative z-10 hidden w-64 shrink-0 border-r border-teal-100 bg-teal-50 px-4 py-8 lg:flex lg:flex-col dark:border-zinc-800 dark:bg-zinc-900/90 dark:backdrop-blur-sm">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 opacity-10 [mask-image:radial-gradient(#fff,transparent,85%)] dark:opacity-5">
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="geo_pattern"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
              x="-1"
              y="-1"
            >
              <path
                d="M12.5 12a.5.5 0 11-1 0 .5.5 0 011 0zm7-7a.5.5 0 11-1 0 .5.5 0 011 0zm-14 0a.5.5 0 11-1 0 .5.5 0 011 0zM19.5 19a.5.5 0 11-1 0 .5.5 0 011 0zM5.5 19a.5.5 0 11-1 0 .5.5 0 011 0z"
                fill="currentColor"
                className="text-teal-900/40 dark:text-zinc-50/20"
              />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#geo_pattern)"
          />
        </svg>
      </div>

      <div className="relative z-10 flex items-center gap-3 px-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-600/90 text-teal-50 shadow-lg shadow-teal-500/20 dark:bg-teal-500 dark:text-teal-950">
          <span className="text-lg font-bold">DF</span>
        </div>
        <div>
          <p className="text-base font-bold leading-tight text-zinc-950 dark:text-zinc-50">
            Dashboard UI
          </p>
          <p className="text-xs text-teal-900/70 dark:text-teal-200">
            Fintech control center
          </p>
        </div>
      </div>

      <nav className="relative z-10 mt-10 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.to}
            className={({ isActive }) =>
              `group flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-teal-600 font-semibold text-white shadow-md shadow-teal-500/20 dark:bg-teal-500 dark:text-teal-950'
                  : 'font-medium text-teal-950/80 hover:bg-teal-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <item.icon
                className={`h-5 w-5 ${
                  item.id === 'dashboard' // Assuming you want special styling for one
                    ? 'stroke-[2.5]'
                    : 'stroke-[1.5]'
                }`}
              />
              <span className="tracking-tight">{item.label}</span>
            </div>
            {item.id === 'dashboard' && (
              <span className="flex items-center gap-1.5 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-700 dark:bg-red-500/20 dark:text-red-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75 dark:bg-red-500" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500 dark:bg-red-400" />
                </span>
                LIVE
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="relative z-10 mt-auto rounded-2xl border border-teal-100/60 bg-teal-100/30 p-4 text-xs dark:border-zinc-800/60 dark:bg-zinc-800/50">
        <p className="font-bold text-teal-950 dark:text-teal-50">
          Today&apos;s Snapshot
        </p>
        <p className="mt-1 text-teal-900/70 dark:text-teal-200">
          Analyze KPIs, revenue streams, and system usage at a glance.
        </p>
        <button className="mt-3 w-full rounded-lg bg-teal-600/90 py-2 font-semibold text-white shadow-sm hover:bg-teal-700 dark:bg-teal-500 dark:text-teal-950 dark:hover:bg-teal-400">
          View Details
        </button>
      </div>
    </aside>
  )
}

export default NewSidebar
