export type SlotProps = { "data-slot": string } | Record<string, never>;

export function getSlots(dataSlot?: string): SlotProps {
  return dataSlot ? { "data-slot": dataSlot } : {};
}
