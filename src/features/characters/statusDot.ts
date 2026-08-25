import type { CharacterStatus } from './types'

export const STATUS_DOT: Record<CharacterStatus, string> = {
  Alive: 'bg-emerald-500',
  Dead: 'bg-red-500',
  unknown: 'bg-neutral-400',
}
