import { localDateLabel, slotsForDay } from "../lib/hours";
import type { Eatery } from "../types";

type Props = {
  eatery: Eatery;
  day: "today" | "tomorrow";
  timeIso: string | null;
  onDay: (day: "today" | "tomorrow") => void;
  onTime: (iso: string) => void;
};

export default function TimeSlots({ eatery, day, timeIso, onDay, onTime }: Props) {
  const slots = slotsForDay(eatery, day);
  return (
    <>
      <div className="day-toggle" role="group" aria-label="Which day">
        <button
          type="button"
          className="slot"
          aria-pressed={day === "today"}
          onClick={() => onDay("today")}
        >
          {localDateLabel("today")}
        </button>
        <button
          type="button"
          className="slot"
          aria-pressed={day === "tomorrow"}
          onClick={() => onDay("tomorrow")}
        >
          {localDateLabel("tomorrow")}
        </button>
      </div>
      {slots.length === 0 ? (
        <p className="hint">
          {day === "today"
            ? "No times left today. Try tomorrow."
            : "No times on that day."}
        </p>
      ) : (
        <div className="slots" role="group" aria-label="Available times">
          {slots.map((slot) => (
            <button
              key={slot.iso}
              type="button"
              className="slot"
              aria-pressed={timeIso === slot.iso}
              onClick={() => onTime(slot.iso)}
            >
              {slot.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
