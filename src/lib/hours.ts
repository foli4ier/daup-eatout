import type { Eatery, TimeSlot } from "../types";

export const JOHANNESBURG = "Africa/Johannesburg";

export type ZonedNow = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

export function zonedNow(timeZone = JOHANNESBURG): ZonedNow {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date())
      .map((part) => [part.type, part.value]),
  );
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
  };
}

export function parseHm(hm: string): number {
  const [h, m] = hm.split(":").map(Number);
  return h * 60 + m;
}

export function isOpenNow(eatery: Eatery, now = zonedNow(eatery.timezone)): boolean {
  const mins = now.hour * 60 + now.minute;
  return eatery.hours.some((window) => {
    const open = parseHm(window.open);
    const close = parseHm(window.close);
    return mins >= open && mins < close;
  });
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function addDays(now: ZonedNow, days: number): ZonedNow {
  const utc = Date.UTC(now.year, now.month - 1, now.day + days, 12, 0, 0);
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: JOHANNESBURG,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date(utc))
      .map((part) => [part.type, part.value]),
  );
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: 12,
    minute: 0,
  };
}

export function localDateLabel(day: "today" | "tomorrow", now = zonedNow()): string {
  const date = day === "today" ? now : addDays(now, 1);
  const weekday = new Date(Date.UTC(date.year, date.month - 1, date.day, 10, 0, 0)).toLocaleDateString(
    "en-GB",
    { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" },
  );
  return day === "today" ? `Today · ${weekday}` : `Tomorrow · ${weekday}`;
}

function clockLabel(minutes: number): string {
  const hour24 = Math.floor(minutes / 60);
  const min = minutes % 60;
  const suffix = hour24 >= 12 ? "pm" : "am";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return min === 0 ? `${hour12}:00 ${suffix}` : `${hour12}:${pad(min)} ${suffix}`;
}

function toIso(date: ZonedNow, minutes: number): string {
  const hour = Math.floor(minutes / 60);
  const min = minutes % 60;
  return `${date.year}-${pad(date.month)}-${pad(date.day)}T${pad(hour)}:${pad(min)}:00+02:00`;
}

export function slotsForDay(
  eatery: Eatery,
  day: "today" | "tomorrow",
  now = zonedNow(eatery.timezone),
): TimeSlot[] {
  const date = day === "today" ? now : addDays(now, 1);
  const nowMins = now.hour * 60 + now.minute;
  const slots: TimeSlot[] = [];

  for (const window of eatery.hours) {
    let t = parseHm(window.open);
    const end = parseHm(window.close);
    while (t + 30 <= end) {
      const tooSoon = day === "today" && t <= nowMins + 14;
      if (!tooSoon) {
        slots.push({
          iso: toIso(date, t),
          label: clockLabel(t),
          minutes: t,
        });
      }
      t += 30;
    }
  }
  return slots;
}

export function formatWhen(iso: string): string {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!match) return iso;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const now = zonedNow();
  const tomorrow = addDays(now, 1);
  const isToday = year === now.year && month === now.month && day === now.day;
  const isTomorrow = year === tomorrow.year && month === tomorrow.month && day === tomorrow.day;
  const time = clockLabel(hour * 60 + minute);
  if (isToday) return `${time} today`;
  if (isTomorrow) return `${time} tomorrow`;
  const date = new Date(Date.UTC(year, month - 1, day, 10, 0, 0)).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
  return `${time}, ${date}`;
}
