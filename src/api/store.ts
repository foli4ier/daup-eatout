import type { Order, Reservation } from "../types";

const KEY = "eatout.bookings.v1";

type Persisted = {
  reservations: Reservation[];
  orders: Order[];
};

function empty(): Persisted {
  return { reservations: [], orders: [] };
}

function read(): Persisted {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw) as Persisted;
    return {
      reservations: Array.isArray(parsed.reservations) ? parsed.reservations : [],
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
    };
  } catch {
    return empty();
  }
}

function write(data: Persisted): void {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function saveReservation(reservation: Reservation): Reservation {
  const data = read();
  data.reservations = [reservation, ...data.reservations.filter((r) => r.id !== reservation.id)];
  write(data);
  return reservation;
}

export function saveOrder(order: Order): Order {
  const data = read();
  data.orders = [order, ...data.orders.filter((o) => o.id !== order.id)];
  write(data);
  return order;
}

export function getReservation(id: string): Reservation | null {
  return read().reservations.find((r) => r.id === id) ?? null;
}

export function getOrderForReservation(reservationId: string): Order | null {
  return read().orders.find((o) => o.reservationId === reservationId) ?? null;
}

export function newId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now().toString(36)}-${rand}`;
}
