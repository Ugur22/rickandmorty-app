import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAppSelector } from '../../../app/hooks'
import { CARD_SURFACE } from '../../../shared/styles'
import { locationCountByDimension } from '../utils/aggregate'
import type { AnalyticsLocation } from '../types'
import { CHART_COLORS } from './chartColors'
import { makeChartTooltip } from './ChartTooltipContent'

const AGGREGATE_BUCKETS = new Set(['Unknown', 'Other'])

interface DimensionBreakdownChartProps {
  locations: AnalyticsLocation[]
}

export function DimensionBreakdownChart({ locations }: DimensionBreakdownChartProps) {
  const mode = useAppSelector((state) => state.theme.mode)
  const colors = CHART_COLORS[mode]
  const data = locationCountByDimension(locations)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const colorFor = (dimension: string, isActive: boolean) => {
    const isAggregate = AGGREGATE_BUCKETS.has(dimension)
    if (isAggregate) return isActive ? colors.mutedHover : colors.muted
    return isActive ? colors.barHover : colors.bar
  }

  const TooltipContent = makeChartTooltip({
    unit: 'locations',
    colors,
    getLabel: (payload) =>
      AGGREGATE_BUCKETS.has(String(payload.dimension))
        ? 'Dimensions outside the top 10'
        : String(payload.dimension ?? ''),
    getAccentColor: (payload) => colorFor(String(payload.dimension), false),
  })

  return (
    <div className={`${CARD_SURFACE} flex h-full flex-col p-4`}>
      <h2 className="mb-1 font-semibold text-neutral-900 dark:text-neutral-100">Locations by dimension</h2>
      <p className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
        Top 10 dimensions by location count, out of {locations.length} known locations.
      </p>
      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%" minHeight={280}>
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
            <CartesianGrid stroke={colors.grid} horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: colors.text, fontSize: 11 }}
              axisLine={{ stroke: colors.axisLine }}
              tickLine={false}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="dimension"
              width={140}
              tick={{ fill: colors.text, fontSize: 11 }}
              axisLine={{ stroke: colors.axisLine }}
              tickLine={false}
            />
            <Tooltip cursor={false} content={TooltipContent} />
            <Bar
              dataKey="count"
              radius={[0, 4, 4, 0]}
              maxBarSize={24}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {data.map((entry, index) => (
                <Cell key={entry.dimension} fill={colorFor(entry.dimension, index === activeIndex)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
