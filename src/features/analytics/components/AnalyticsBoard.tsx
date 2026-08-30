import { useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EpisodeCastSizeChart } from "./EpisodeCastSizeChart";
import { DimensionBreakdownChart } from "./DimensionBreakdownChart";
import { SeasonTrendSparklines } from "./SeasonTrendSparklines";
import type { AnalyticsEpisode, AnalyticsLocation } from "../types";

const TILE_ORDER_STORAGE_KEY = "analytics-tile-order";
const TILE_IDS = ["cast-size", "dimensions", "season-trend"] as const;
type TileId = (typeof TILE_IDS)[number];

function readStoredOrder(): TileId[] {
  const stored = localStorage.getItem(TILE_ORDER_STORAGE_KEY);
  if (!stored) return [...TILE_IDS];
  try {
    const parsed: unknown = JSON.parse(stored);
    const isValidOrder =
      Array.isArray(parsed) &&
      parsed.length === TILE_IDS.length &&
      TILE_IDS.every((id) => parsed.includes(id));
    return isValidOrder ? (parsed as TileId[]) : [...TILE_IDS];
  } catch (err) {
    console.warn("[AnalyticsBoard:persist] failed to parse stored order", err);
    return [...TILE_IDS];
  }
}

interface SortableTileProps {
  id: TileId;
  isLast: boolean;
  children: React.ReactNode;
}

function SortableTile({ id, isLast, children }: SortableTileProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`h-full ${isLast ? "md:col-span-2" : ""} ${isDragging ? "opacity-50" : ""}`}
    >
      <div className="flex h-full flex-col">
        <div
          {...attributes}
          {...listeners}
          className="mb-1 flex shrink-0 cursor-grab items-center gap-1.5 px-1 text-xs text-neutral-400 select-none active:cursor-grabbing dark:text-neutral-500"
        >
          <span aria-hidden="true">⠿</span> Drag to reorder
        </div>
        <div className="min-h-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

interface AnalyticsBoardProps {
  episodes: AnalyticsEpisode[];
  locations: AnalyticsLocation[];
}

export function AnalyticsBoard({ episodes, locations }: AnalyticsBoardProps) {
  const [order, setOrder] = useState<TileId[]>(readStoredOrder);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setOrder((current) => {
      const oldIndex = current.indexOf(active.id as TileId);
      const newIndex = current.indexOf(over.id as TileId);
      const next = arrayMove(current, oldIndex, newIndex);
      localStorage.setItem(TILE_ORDER_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  const tiles: Record<TileId, React.ReactNode> = {
    "cast-size": <EpisodeCastSizeChart episodes={episodes} />,
    dimensions: <DimensionBreakdownChart locations={locations} />,
    "season-trend": <SeasonTrendSparklines episodes={episodes} />,
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={order} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2">
          {order.map((tileId, index) => (
            <SortableTile key={tileId} id={tileId} isLast={index === order.length - 1}>
              {tiles[tileId]}
            </SortableTile>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
