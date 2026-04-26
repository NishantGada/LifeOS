import { NavLink } from "react-router-dom"
import {
  Home, CheckSquare, Cloud, Newspaper,
  TrendingUp, UtensilsCrossed, Target, Sun, Moon
} from "lucide-react"

const nav = [
  { to: "/",        icon: Home,            label: "Home"    },
  { to: "/todo",    icon: CheckSquare,     label: "Tasks"   },
  { to: "/weather", icon: Cloud,           label: "Weather" },
  { to: "/news",    icon: Newspaper,       label: "News"    },
  { to: "/stocks",  icon: TrendingUp,      label: "Stocks"  },
  { to: "/meals",   icon: UtensilsCrossed, label: "Meals"   },
  { to: "/goals",   icon: Target,          label: "Goals"   },
]

interface Props {
  isDark: boolean
  toggle: () => void
}

export default function Sidebar({ isDark, toggle }: Props) {
  return (
    <aside className="
      fixed top-0 left-0 h-screen w-56 z-10
      flex flex-col
      bg-white dark:bg-navy-800
      border-r border-gray-200 dark:border-navy-600
    ">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-gray-200 dark:border-navy-600">
        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
          LifeOS
        </span>
        <span className="text-lg font-light text-teal-500">.</span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
              transition-colors duration-150
              ${isActive
                ? "bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-navy-600 hover:text-gray-900 dark:hover:text-gray-100"
              }
            `}
          >
            <Icon size={17} strokeWidth={1.8} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Dark mode toggle */}
      <div className="px-4 py-4 border-t border-gray-200 dark:border-navy-600">
        <button
          onClick={toggle}
          className="
            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
            text-gray-500 dark:text-gray-400
            hover:bg-gray-100 dark:hover:bg-navy-600
            hover:text-gray-800 dark:hover:text-gray-200
            transition-colors duration-150
          "
        >
          {isDark ? <Sun size={17} strokeWidth={1.8} /> : <Moon size={17} strokeWidth={1.8} />}
          {isDark ? "Light mode" : "Dark mode"}
        </button>
      </div>
    </aside>
  )
}