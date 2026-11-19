import { LEVELS, isLevel, type Level } from "../menu";

const LABELS: Record<Level, { name: string; hint: string }> = {
  light: { name: "Light", hint: "one-line summary" },
  medium: { name: "Medium", hint: "full description" },
  deep: { name: "Deep", hint: "technical write-up" },
};

interface Props {
  value: Level;
  onChange: (level: Level) => void;
}

/** "Sweetness": how much detail each dish shows. A radio group, so it works by keyboard and screen reader. */
export function SweetnessPicker({ value, onChange }: Props) {
  return (
    <fieldset className="sweetness">
      <legend>Sweetness (level of detail)</legend>
      <div className="sweetness-options">
        {LEVELS.map((level) => (
          <label key={level} className="sweetness-option">
            <input
              type="radio"
              name="sweetness"
              value={level}
              checked={value === level}
              onChange={(event) => {
                if (isLevel(event.target.value)) onChange(event.target.value);
              }}
            />
            <span>
              <strong>{LABELS[level].name}</strong> <small>{LABELS[level].hint}</small>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
