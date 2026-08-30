import { useEffect, useRef, useState } from "react";
import { createSwapy } from "swapy";
import type { Swapy, SwapEndEvent } from "swapy";
import { EpisodeCastSizeChart } from "./EpisodeCastSizeChart";
import { DimensionBreakdownChart } from "./DimensionBreakdownChart";
import { SeasonTrendSparklines } from "./SeasonTrendSparklines";
import type { AnalyticsEpisode, AnalyticsLocation } from "../types";

const TILE_ORDER_STORAGE_KEY = "analytics-tile-order";
const TILE_IDS = ["cast-size", "dimensions", "season-trend"] as const;
type TileId = (typeof TILE_IDS)[number];
const SLOT_IDS = TILE_IDS.map((_, index) => `slot-${index + 1}`);

function readStoredOrder(): TileId[] {
  const stored = localStorage.getItem(TILE_ORDER_STORAGE_KEY);
  if (!stored) return [...TILE_IDS];
  try {
    const parsed: unknown = JSON.parse(stored);
    const isValidOrder =
      Array.isArray(parsed) &&
      parsed.length === TILE_IDS.length &&
      TILE_IDS.every((id) => parsed.includes(id));
    console.groupCollapsed("[AnalyticsBoard:persist] mount read");
    console.info("raw", stored);
    console.info("parsed", parsed);
    console.info("isValidOrder", isValidOrder);
    console.groupEnd();
    return isValidOrder ? (parsed as TileId[]) : [...TILE_IDS];
  } catch (err) {
    console.warn("[AnalyticsBoard:persist] failed to parse stored order", err);
    return [...TILE_IDS];
  }
}

interface AnalyticsBoardProps {
  episodes: AnalyticsEpisode[];
  locations: AnalyticsLocation[];
}

export function AnalyticsBoard({ episodes, locations }: AnalyticsBoardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Only used to render the initial layout. swapy owns all reordering after
  // mount by moving item DOM nodes directly, outside React's control — if we
  // fed swaps back into this via setState, React would re-render and patch
  // attributes onto DOM nodes it still thinks are in their old slot, while
  // swapy has already physically relocated them elsewhere, corrupting the
  // tree (observed as an uncaught "removeChild: not a child of this node").
  const [initialOrder] = useState<TileId[]>(readStoredOrder);

  useEffect(() => {
    if (!containerRef.current) return;

    const swapy: Swapy = createSwapy(containerRef.current, {
      animation: "dynamic",
    });

    swapy.onSwapEnd((event: SwapEndEvent) => {
      try {
        console.groupCollapsed("[AnalyticsBoard:persist] swapEnd");
        console.info("hasChanged", event.hasChanged);
        console.info("slotItemMap.asArray", event.slotItemMap.asArray);
        if (!event.hasChanged) return;
        // slotItemMap always reports the full, live slot->item mapping read
        // straight from the DOM, so this is authoritative regardless of how
        // many swaps have happened since mount.
        const bySlot = new Map(
          event.slotItemMap.asArray.map(({ slot, item }) => [
            slot,
            item as TileId,
          ]),
        );
        const nextOrder = SLOT_IDS.map(
          (slot, index) => bySlot.get(slot) ?? initialOrder[index],
        );
        console.info("nextOrder", nextOrder);

        localStorage.setItem(TILE_ORDER_STORAGE_KEY, JSON.stringify(nextOrder));
        console.info(
          "readback",
          localStorage.getItem(TILE_ORDER_STORAGE_KEY),
        );
      } catch (err) {
        console.error("[AnalyticsBoard:persist] swapEnd threw", err);
      } finally {
        console.groupEnd();
      }
    });

    return () => swapy.destroy();
  }, [initialOrder]);

  const tiles: Record<TileId, React.ReactNode> = {
    "cast-size": <EpisodeCastSizeChart episodes={episodes} />,
    dimensions: <DimensionBreakdownChart locations={locations} />,
    "season-trend": <SeasonTrendSparklines episodes={episodes} />,
  };

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2"
    >
      {initialOrder.map((tileId, index) => (
        <div
          key={SLOT_IDS[index]}
          data-swapy-slot={SLOT_IDS[index]}
          // The last slot spans the full row — as wide as the ones above it combined.
          className={`h-full ${index === SLOT_IDS.length - 1 ? "md:col-span-2" : ""}`}
        >
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
  );
}
