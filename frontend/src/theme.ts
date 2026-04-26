// Single source of truth for all colors.
// Change values here → entire app updates.
export const theme = {
  light: {
    bg:           "bg-gray-50",
    bgCard:       "bg-white",
    bgSidebar:    "bg-white",
    border:       "border-gray-200",
    textPrimary:  "text-gray-900",
    textSecondary:"text-gray-500",
    textMuted:    "text-gray-400",
    accent:       "text-teal-600",
    accentBg:     "bg-teal-50",
    accentBorder: "border-teal-200",
    navActive:    "bg-teal-50 text-teal-700",
    navHover:     "hover:bg-gray-100",
  },
  dark: {
    bg:           "dark:bg-navy-700",
    bgCard:       "dark:bg-navy-800",
    bgSidebar:    "dark:bg-navy-800",
    border:       "dark:border-navy-600",
    textPrimary:  "dark:text-gray-100",
    textSecondary:"dark:text-gray-400",
    textMuted:    "dark:text-gray-500",
    accent:       "dark:text-teal-400",
    accentBg:     "dark:bg-teal-900/20",
    accentBorder: "dark:border-teal-800",
    navActive:    "dark:bg-teal-900/30 dark:text-teal-400",
    navHover:     "dark:hover:bg-navy-600",
  },
}

export type Theme = typeof theme