import type { ThemeMode } from '../../theme/themeSlice'

// Recharts' entrance animation can get stuck rendering a series at zero size
// if the chart mounts while the page layout is still settling (e.g. a
// ResizeObserver measuring before the final layout pass). Spread this onto
// every Bar/Line so no chart has to remember to disable it individually.
export const NO_ENTRANCE_ANIMATION = { isAnimationActive: false } as const

// Recharts renders raw SVG, which Tailwind's class-based dark mode can't reach —
// colors have to be resolved to hex and passed as props instead.
export const CHART_COLORS: Record<
  ThemeMode,
  {
    bar: string
    barHover: string
    muted: string
    mutedHover: string
    grid: string
    text: string
    axisLine: string
    tooltipBg: string
    valueText: string
  }
> = {
  light: {
    bar: '#059669', // emerald-600
    barHover: '#10b981', // emerald-500 — lighter, reads as "lifted"
    muted: '#a3a3a3', // neutral-400 — the Other/Unknown aggregate bucket
    mutedHover: '#d4d4d4', // neutral-300
    grid: '#e5e5e5', // neutral-200
    text: '#525252', // neutral-600
    axisLine: '#d4d4d4', // neutral-300
    tooltipBg: '#ffffff',
    valueText: '#171717', // neutral-900
  },
  dark: {
    bar: '#34d399', // emerald-400
    barHover: '#6ee7b7', // emerald-300
    muted: '#737373', // neutral-500 — the Other/Unknown aggregate bucket
    mutedHover: '#a3a3a3', // neutral-400
    grid: '#404040', // neutral-700
    text: '#a3a3a3', // neutral-400
    axisLine: '#525252', // neutral-600
    tooltipBg: '#171717', // neutral-900
    valueText: '#fafafa', // neutral-50
  },
}
