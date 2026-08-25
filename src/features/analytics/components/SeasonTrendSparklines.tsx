import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAppSelector } from '../../../app/hooks'
import { CARD_SURFACE } from '../../../shared/styles'
import { castSizeBySeason } from '../utils/aggregate'
import type { AnalyticsEpisode } from '../types'
import { CHART_COLORS, NO_ENTRANCE_ANIMATION } from './chartColors'
import { makeChartTooltip } from './ChartTooltipContent'

interface SeasonTrendSparklinesProps {
  episodes: AnalyticsEpisode[]
}

export function SeasonTrendSparklines({ episodes }: SeasonTrendSparklinesProps) {
  const mode = useAppSelector((state) => state.theme.mode)
  const colors = CHART_COLORS[mode]
  const seasons = castSizeBySeason(episodes)

  const TooltipContent = makeChartTooltip({
    unit: 'characters',
    colors,
    getLabel: (payload) => String(payload.name ?? ''),
    getAccentColor: () => colors.bar,
  })

  return (
    <div className={`${CARD_SURFACE} flex h-full flex-col p-4`}>
      <h2 className="mb-1 font-semibold text-neutral-900 dark:text-neutral-100">Cast size trend by season</h2>
      <p className="mb-2 text-sm text-neutral-500 dark:text-neutral-400">
        Each line traces cast size episode-by-episode within a season.
      </p>
      <div className="flex flex-1 flex-col justify-center">
        {seasons.map((season) => (
          <div
            key={season.season}
            className="flex items-center gap-4 border-b border-neutral-100 py-2.5 last:border-b-0 dark:border-neutral-800"
          >
            <span className="w-20 shrink-0 text-sm font-medium text-neutral-600 dark:text-neutral-400">
              {season.label}
            </span>
            <div className="h-10 min-w-0 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={season.points} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
                  <XAxis dataKey="code" hide />
                  <YAxis hide domain={['dataMin - 3', 'dataMax + 3']} />
                  <Tooltip cursor={false} content={TooltipContent} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke={colors.bar}
                    strokeWidth={2}
                    dot={false}
                    {...NO_ENTRANCE_ANIMATION}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
