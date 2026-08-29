import { titleCaseName } from "../lib/format";
import { isOpenNow } from "../lib/hours";
import type {
  CreateOrderInput,
  CreateReservationInput,
  Eatery,
  ListEateriesParams,
  Menu,
  MenuItem,
  Order,
  Reservation,
} from "../types";
import { EATERIES, NOOP_FALLBACK_MENU, NOOP_MENU_URL, SEEDED_MENUS } from "./seed";
import { getOrderForReservation, getReservation, newId, saveOrder, saveReservation } from "./store";

let noopLive: MenuItem[] | null = null;
let noopLiveTried = false;

type ScrapedItem = {
  id?: string;
  name?: string;
  category?: string;
  description?: string;
  price?: number;
  currency?: string;
  available?: boolean;
  dietaryTags?: string[];
};

type ScrapedMenu = {
  restaurantName?: string;
  items?: ScrapedItem[];
};

function matches(eatery: Eatery, params: ListEateriesParams = {}): boolean {
  const query = params.query?.trim().toLowerCase();
  if (query) {
    const hay = `${eatery.name} ${eatery.area} ${eatery.cuisine}`.toLowerCase();
    if (!hay.includes(query)) return false;
  }
  if (params.area && eatery.area !== params.area) return false;
  if (params.cuisine && eatery.cuisine !== params.cuisine) return false;
  if (params.openNow && !isOpenNow(eatery)) return false;
  return true;
}

export async function listEateries(params: ListEateriesParams = {}): Promise<Eatery[]> {
  return EATERIES.filter((eatery) => matches(eatery, params));
}

export async function getEatery(id: string): Promise<Eatery | null> {
  return EATERIES.find((eatery) => eatery.id === id) ?? null;
}

function mapScraped(items: ScrapedItem[]): MenuItem[] {
  const mapped: MenuItem[] = [];
  items.forEach((item, index) => {
    const name = (item.name ?? "").trim();
    const price = typeof item.price === "number" ? item.price : 0;
    if (!name || price <= 0) return;
    const currency = item.currency === "USD" ? "USD" : "ZAR";
    const tags = Array.isArray(item.dietaryTags)
      ? item.dietaryTags.filter((tag) => typeof tag === "string" && tag.trim().length > 0)
      : [];
    const dish: MenuItem = {
      id: item.id || `noop-${index + 1}`,
      name: titleCaseName(name),
      category: item.category?.trim() || "Mains",
      price,
      currency,
      available: item.available !== false,
    };
    const description = item.description?.trim();
    if (description) dish.description = description;
    if (tags.length) dish.dietaryTags = tags;
    mapped.push(dish);
  });
  return mapped;
}

async function loadNoopMenu(): Promise<MenuItem[]> {
  if (noopLive) return noopLive;
  if (noopLiveTried) return NOOP_FALLBACK_MENU;
  noopLiveTried = true;
  try {
    const res = await fetch(NOOP_MENU_URL, { headers: { Accept: "application/json" } });
    if (!res.ok) return NOOP_FALLBACK_MENU;
    const data = (await res.json()) as ScrapedMenu[] | ScrapedMenu;
    const menus = Array.isArray(data) ? data : [data];
    const noop = menus.find((menu) =>
      (menu.restaurantName ?? "").toLowerCase().includes("noop"),
    ) ?? menus[0];
    const mapped = mapScraped(noop?.items ?? []);
    if (!mapped.length) return NOOP_FALLBACK_MENU;
    noopLive = mapped;
    return mapped;
  } catch {
    return NOOP_FALLBACK_MENU;
  }
}

export async function getMenu(eateryId: string): Promise<Menu> {
  if (eateryId === "noop") {
    const items = await loadNoopMenu();
    return { eateryId, items, live: items !== NOOP_FALLBACK_MENU };
  }
  return {
    eateryId,
    items: SEEDED_MENUS[eateryId] ?? [],
    live: false,
  };
}

function cleanOptional(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export async function createReservation(input: CreateReservationInput): Promise<Reservation> {
  const eatery = await getEatery(input.eateryId);
  if (!eatery) throw new Error("That place is not on the list.");
  if (input.partySize < 1) throw new Error("Tell us how many people.");
  if (!input.time) throw new Error("Pick a time.");
  const reservation: Reservation = {
    id: newId("table"),
    eateryId: input.eateryId,
    partySize: input.partySize,
    time: input.time,
    zone: cleanOptional(input.zone),
    guestName: cleanOptional(input.guestName),
    phone: cleanOptional(input.phone),
    createdAt: new Date().toISOString(),
  };
  return saveReservation(reservation);
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const eatery = await getEatery(input.eateryId);
  if (!eatery) throw new Error("That place is not on the list.");
  const lines = input.items.filter((item) => item.qty > 0);
  if (!lines.length) throw new Error("Add something to eat first.");
  const order: Order = {
    id: newId("order"),
    eateryId: input.eateryId,
    reservationId: cleanOptional(input.reservationId),
    items: lines.map((item) => ({
      id: item.id,
      name: item.name,
      qty: item.qty,
      price: item.price,
    })),
    guestName: cleanOptional(input.guestName),
    phone: cleanOptional(input.phone),
    createdAt: new Date().toISOString(),
  };
  return saveOrder(order);
}

export async function getBooking(reservationId: string): Promise<{
  reservation: Reservation;
  order: Order | null;
  eatery: Eatery | null;
} | null> {
  const reservation = getReservation(reservationId);
  if (!reservation) return null;
  const order = getOrderForReservation(reservationId);
  const eatery = await getEatery(reservation.eateryId);
  return { reservation, order, eatery };
}

export function listAreas(): string[] {
  return [...new Set(EATERIES.map((e) => e.area))];
}

export function listCuisines(): string[] {
  return [...new Set(EATERIES.map((e) => e.cuisine))];
}
