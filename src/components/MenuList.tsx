import type { ReactNode } from "react";
import type { Level, MenuItem } from "../menu";

interface Props<T extends MenuItem> {
  items: readonly T[];
  level: Level;
  /** Text shown above the title, e.g. the company name. */
  eyebrow?: (item: T) => string | undefined;
  /** Links shown under the description, e.g. website and code. */
  actions?: (item: T) => ReactNode;
  emptyMessage: string;
}

/** The plain, fully readable menu. The same data will later drive the illustrated tray. */
export function MenuList<T extends MenuItem>({ items, level, eyebrow, actions, emptyMessage }: Props<T>) {
  if (items.length === 0) return <p className="empty">{emptyMessage}</p>;

  return (
    <ul className="menu-list">
      {items.map((item) => (
        <li key={item.id} className="menu-item">
          <article aria-labelledby={`title-${item.id}`}>
            {eyebrow?.(item) && <p className="eyebrow">{eyebrow(item)}</p>}
            <h3 id={`title-${item.id}`}>{item.title}</h3>
            <p className="duration">{item.duration}</p>
            {level === "light" && <p>{item.summary}</p>}
            {level === "medium" && <p>{item.description}</p>}
            {level === "deep" && item.details.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <ul className="tech-list" aria-label="Ingredients">
              {item.tech.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
            {actions?.(item)}
          </article>
        </li>
      ))}
    </ul>
  );
}
