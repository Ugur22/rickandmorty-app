import type { TooltipContentProps } from 'recharts'
import type { CHART_COLORS } from './chartColors'

type Palette = (typeof CHART_COLORS)['light']

interface MakeChartTooltipOptions {
  unit: string
  colors: Palette
  getLabel: (payload: Record<string, unknown>) => string
  getAccentColor: (payload: Record<string, unknown>) => string
}

// Shared across both charts: value leads (bold, large), category name follows
// (secondary), and identity is a short line-key rather than a swatch box.
export function makeChartTooltip({ unit, colors, getLabel, getAccentColor }: MakeChartTooltipOptions) {
  return function ChartTooltipContent({ active, payload }: TooltipContentProps) {
    if (!active || !payload?.length) return null
    const entry = payload[0]
    const data = (entry.payload ?? {}) as Record<string, unknown>

    return (
      <div
        className="rounded-lg px-3 py-2 shadow-lg"
        style={{ background: colors.tooltipBg, border: `1px solid ${colors.axisLine}` }}
      >
        <div className="flex items-baseline gap-1.5">
          <span className="inline-block h-3.5 w-[3px] rounded-full" style={{ background: getAccentColor(data) }} />
          <span className="text-base font-semibold" style={{ color: colors.valueText }}>
            {entry.value}
          </span>
          <span className="text-xs" style={{ color: colors.text }}>
            {unit}
          </span>
        </div>
        <div className="mt-0.5 text-xs" style={{ color: colors.text }}>
          {getLabel(data)}
        </div>
      </div>
    )
  }
}
