import { useRef, type KeyboardEvent } from "react";

export interface TabDef {
  id: string;
  label: string;
  hint: string;
}

interface Props {
  tabs: readonly TabDef[];
  activeId: string;
  onSelect: (id: string) => void;
}

/** Accessible tab bar (WAI-ARIA tabs pattern: arrow keys move, Home/End jump). */
export function Tabs({ tabs, activeId, onSelect }: Props) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  function onKeyDown(event: KeyboardEvent, index: number) {
    const last = tabs.length - 1;
    const target =
      event.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : event.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (target === null) return;
    event.preventDefault();
    const next = tabs[target];
    if (!next) return;
    onSelect(next.id);
    refs.current[next.id]?.focus();
  }

  return (
    <div role="tablist" aria-label="Sections of the cafe" className="tab-bar">
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          ref={(el) => { refs.current[tab.id] = el; }}
          role="tab"
          type="button"
          id={`tab-${tab.id}`}
          aria-selected={tab.id === activeId}
          aria-controls={`panel-${tab.id}`}
          tabIndex={tab.id === activeId ? 0 : -1}
          className="tab"
          onClick={() => onSelect(tab.id)}
          onKeyDown={(event) => onKeyDown(event, index)}
        >
          <span className="tab-label">{tab.label}</span>
          <span className="tab-hint">{tab.hint}</span>
        </button>
      ))}
    </div>
  );
}
