/** A dish on the menu: a project (bread) or a job (drink). */
export interface MenuItem {
  id: string;
  title: string;
  summary: string;
  description: string;
  details: string[];
  duration: string;
  tech: string[];
}

/** How much to show: the "sweetness" of the write-up. */
export const LEVELS = ["light", "medium", "deep"] as const;
export type Level = (typeof LEVELS)[number];

export function isLevel(value: string): value is Level {
  return (LEVELS as readonly string[]).includes(value);
}

/** Every technology used by the items, most-used first, then alphabetical. */
export function collectTech(items: readonly MenuItem[]): string[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    for (const tech of new Set(item.tech)) {
      counts.set(tech, (counts.get(tech) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tech]) => tech);
}

/** Items whose tech includes every selected ingredient (all items when none are selected). */
export function filterByStack<T extends MenuItem>(
  items: readonly T[],
  selected: ReadonlySet<string>,
): T[] {
  if (selected.size === 0) return [...items];
  return items.filter((item) => [...selected].every((tech) => item.tech.includes(tech)));
}

/** Screen-reader text announcing how many dishes match. */
export function describeMatches(count: number, selected: ReadonlySet<string>): string {
  if (selected.size === 0) return `Showing all ${count} dishes.`;
  const list = [...selected].join(", ");
  if (count === 0) return `No dishes use all of: ${list}.`;
  return `${count} ${count === 1 ? "dish uses" : "dishes use"} all of: ${list}.`;
}
