import { useEffect, useRef, useState } from 'react'
import { createSwapy } from 'swapy'
import type { Swapy, SwapEndEvent } from 'swapy'
import { EpisodeCastSizeChart } from './EpisodeCastSizeChart'
import { DimensionBreakdownChart } from './DimensionBreakdownChart'
import type { AnalyticsEpisode, AnalyticsLocation } from '../types'

const TILE_ORDER_STORAGE_KEY = 'analytics-tile-order'
const TILE_IDS = ['cast-size', 'dimensions'] as const
type TileId = (typeof TILE_IDS)[number]
const SLOT_IDS = TILE_IDS.map((_, index) => `slot-${index + 1}`)

function readStoredOrder(): TileId[] {
  const stored = localStorage.getItem(TILE_ORDER_STORAGE_KEY)
  if (!stored) return [...TILE_IDS]
  try {
    const parsed: unknown = JSON.parse(stored)
    const isValidOrder =
      Array.isArray(parsed) && parsed.length === TILE_IDS.length && TILE_IDS.every((id) => parsed.includes(id))
    return isValidOrder ? (parsed as TileId[]) : [...TILE_IDS]
  } catch {
    return [...TILE_IDS]
  }
}

interface AnalyticsBoardProps {
  episodes: AnalyticsEpisode[]
  locations: AnalyticsLocation[]
}

export function AnalyticsBoard({ episodes, locations }: AnalyticsBoardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [order, setOrder] = useState<TileId[]>(readStoredOrder)

  useEffect(() => {
    if (!containerRef.current) return

    const swapy: Swapy = createSwapy(containerRef.current, { animation: 'dynamic' })

    swapy.onSwapEnd((event: SwapEndEvent) => {
      if (!event.hasChanged) return
      const bySlot = new Map(event.slotItemMap.asArray.map(({ slot, item }) => [slot, item as TileId]))
      setOrder((current) => {
        const nextOrder = SLOT_IDS.map((slot, index) => bySlot.get(slot) ?? current[index])
        localStorage.setItem(TILE_ORDER_STORAGE_KEY, JSON.stringify(nextOrder))
        return nextOrder
      })
    })

    return () => swapy.destroy()
  }, [])

  const tiles: Record<TileId, React.ReactNode> = {
    'cast-size': <EpisodeCastSizeChart episodes={episodes} />,
    dimensions: <DimensionBreakdownChart locations={locations} />,
  }

  return (
    <div ref={containerRef} className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2">
      {order.map((tileId, index) => (
        <div key={SLOT_IDS[index]} data-swapy-slot={SLOT_IDS[index]} className="h-full">
          <div data-swapy-item={tileId} className="flex h-full flex-col">
            <div
              data-swapy-handle
              className="mb-1 flex shrink-0 cursor-grab items-center gap-1.5 px-1 text-xs text-neutral-400 select-none active:cursor-grabbing dark:text-neutral-500"
            >
              <span aria-hidden="true">⠿</span> Drag to reorder
            </div>
            <div className="min-h-0 flex-1">{tiles[tileId]}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
