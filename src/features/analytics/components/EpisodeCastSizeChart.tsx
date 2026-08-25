import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAppSelector } from '../../../app/hooks'
import { CARD_SURFACE } from '../../../shared/styles'
import { castSizeByEpisode } from '../utils/aggregate'
import type { AnalyticsEpisode } from '../types'
import { CHART_COLORS } from './chartColors'
import { makeChartTooltip } from './ChartTooltipContent'

interface EpisodeCastSizeChartProps {
  episodes: AnalyticsEpisode[]
}

export function EpisodeCastSizeChart({ episodes }: EpisodeCastSizeChartProps) {
  const mode = useAppSelector((state) => state.theme.mode)
  const colors = CHART_COLORS[mode]
  const data = castSizeByEpisode(episodes)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const TooltipContent = makeChartTooltip({
    unit: 'characters',
    colors,
    getLabel: (payload) => String(payload.name ?? ''),
    getAccentColor: () => colors.bar,
  })

  return (
    <div className={`${CARD_SURFACE} flex h-full flex-col p-4`}>
      <h2 className="mb-1 font-semibold text-neutral-900 dark:text-neutral-100">Cast size per episode</h2>
      <p className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
        Characters credited per episode, across all {data.length} episodes.
      </p>
      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%" minHeight={280}>
          <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 20 }}>
            <CartesianGrid stroke={colors.grid} vertical={false} />
            <XAxis
              dataKey="code"
              tick={{ fill: colors.text, fontSize: 11 }}
              interval={Math.ceil(data.length / 12) - 1}
              angle={-60}
              textAnchor="end"
              height={50}
              axisLine={{ stroke: colors.axisLine }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: colors.text, fontSize: 11 }}
              axisLine={{ stroke: colors.axisLine }}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip cursor={false} content={TooltipContent} />
            <Bar
              dataKey="count"
              radius={[4, 4, 0, 0]}
              maxBarSize={24}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {data.map((entry, index) => (
                <Cell key={entry.code} fill={index === activeIndex ? colors.barHover : colors.bar} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
