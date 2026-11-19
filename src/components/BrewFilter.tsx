interface Props {
  options: readonly string[];
  selected: ReadonlySet<string>;
  onToggle: (tech: string) => void;
  onClear: () => void;
}

/** "Brew your stack": ingredient chips that filter the menu. */
export function BrewFilter({ options, selected, onToggle, onClear }: Props) {
  return (
    <details className="brew" open>
      <summary>Brew your stack</summary>
      <p className="brew-help">Pick ingredients to see the dishes made with all of them.</p>
      <ul className="chips" aria-label="Ingredients">
        {options.map((tech) => (
          <li key={tech}>
            <button
              type="button"
              className="chip"
              aria-pressed={selected.has(tech)}
              onClick={() => onToggle(tech)}
            >
              {tech}
            </button>
          </li>
        ))}
      </ul>
      <button type="button" className="btn secondary" onClick={onClear} disabled={selected.size === 0}>
        Clear ingredients
      </button>
    </details>
  );
}
