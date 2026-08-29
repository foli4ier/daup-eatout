type Props = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (n: number) => void;
  valueLabel: string;
};

export default function Stepper({ label, value, min = 1, max = 12, onChange, valueLabel }: Props) {
  return (
    <div className="stepper" role="group" aria-label={label}>
      <button
        type="button"
        className="icon-btn"
        aria-label={`Fewer people, currently ${valueLabel}`}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
      >
        −
      </button>
      <div className="value" aria-live="polite">
        {valueLabel}
      </div>
      <button
        type="button"
        className="icon-btn"
        aria-label={`More people, currently ${valueLabel}`}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
}
