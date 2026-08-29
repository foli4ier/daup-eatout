type Props = {
  zones: string[];
  value: string | null;
  onChange: (zone: string) => void;
};

export default function ZonePicker({ zones, value, onChange }: Props) {
  return (
    <div style={{ marginTop: 14 }}>
      <h3 className="cat" style={{ marginTop: 0 }}>
        Where would you like to sit?
      </h3>
      <div className="slots" role="group" aria-label="Seating">
        {zones.map((zone) => (
          <button
            key={zone}
            type="button"
            className="zone"
            aria-pressed={value === zone}
            onClick={() => onChange(zone)}
          >
            {zone}
          </button>
        ))}
      </div>
    </div>
  );
}
