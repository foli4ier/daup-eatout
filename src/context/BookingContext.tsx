import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartLine } from "../types";

const KEY = "eatout.draft.v1";

export type BookingDraft = {
  eateryId: string | null;
  partySize: number;
  day: "today" | "tomorrow";
  timeIso: string | null;
  zone: string | null;
  items: CartLine[];
  guestName: string;
  phone: string;
};

const emptyDraft: BookingDraft = {
  eateryId: null,
  partySize: 2,
  day: "today",
  timeIso: null,
  zone: null,
  items: [],
  guestName: "",
  phone: "",
};

function readDraft(): BookingDraft {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyDraft;
    const parsed = JSON.parse(raw) as Partial<BookingDraft>;
    return {
      ...emptyDraft,
      ...parsed,
      items: Array.isArray(parsed.items) ? parsed.items : [],
      partySize: typeof parsed.partySize === "number" && parsed.partySize > 0 ? parsed.partySize : 2,
    };
  } catch {
    return emptyDraft;
  }
}

function persist(draft: BookingDraft): void {
  localStorage.setItem(KEY, JSON.stringify(draft));
}

type BookingContextValue = {
  draft: BookingDraft;
  itemCount: number;
  subtotal: number;
  setPartySize: (n: number) => void;
  setDay: (day: "today" | "tomorrow") => void;
  setTime: (iso: string | null) => void;
  setZone: (zone: string | null) => void;
  setGuest: (guestName: string, phone: string) => void;
  addItem: (item: Omit<CartLine, "qty">) => void;
  setQty: (id: string, qty: number) => void;
  ensurePlace: (eateryId: string) => void;
  clearOrder: () => void;
  resetDraft: () => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<BookingDraft>(readDraft);

  const update = useCallback((patch: Partial<BookingDraft> | ((prev: BookingDraft) => BookingDraft)) => {
    setDraft((prev) => {
      const next = typeof patch === "function" ? patch(prev) : { ...prev, ...patch };
      persist(next);
      return next;
    });
  }, []);

  const ensurePlace = useCallback(
    (eateryId: string) => {
      update((prev) => {
        if (prev.eateryId === eateryId) return prev;
        return {
          ...emptyDraft,
          eateryId,
          guestName: prev.guestName,
          phone: prev.phone,
        };
      });
    },
    [update],
  );

  const value = useMemo<BookingContextValue>(() => {
    const itemCount = draft.items.reduce((sum, line) => sum + line.qty, 0);
    const subtotal = draft.items.reduce((sum, line) => sum + line.qty * line.price, 0);
    return {
      draft,
      itemCount,
      subtotal,
      setPartySize: (n) => update({ partySize: Math.min(12, Math.max(1, n)) }),
      setDay: (day) => update({ day, timeIso: null }),
      setTime: (iso) => update({ timeIso: iso }),
      setZone: (zone) => update({ zone }),
      setGuest: (guestName, phone) => update({ guestName, phone }),
      addItem: (item) =>
        update((prev) => {
          const existing = prev.items.find((line) => line.id === item.id);
          const items = existing
            ? prev.items.map((line) =>
                line.id === item.id ? { ...line, qty: line.qty + 1 } : line,
              )
            : [...prev.items, { ...item, qty: 1 }];
          return { ...prev, items };
        }),
      setQty: (id, qty) =>
        update((prev) => ({
          ...prev,
          items:
            qty <= 0
              ? prev.items.filter((line) => line.id !== id)
              : prev.items.map((line) => (line.id === id ? { ...line, qty } : line)),
        })),
      ensurePlace,
      clearOrder: () => update({ items: [] }),
      resetDraft: () => {
        const next = { ...emptyDraft, guestName: draft.guestName, phone: draft.phone };
        persist(next);
        setDraft(next);
      },
    };
  }, [draft, ensurePlace, update]);

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside BookingProvider");
  return ctx;
}
