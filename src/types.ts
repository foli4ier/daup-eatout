export type Currency = "ZAR" | "USD";

export type HoursWindow = {
  open: string;
  close: string;
};

export type Eatery = {
  id: string;
  name: string;
  area: string;
  cuisine: string;
  currency: Currency;
  slug: string;
  blurb: string;
  hours: HoursWindow[];
  hoursLabel: string;
  timezone: "Africa/Johannesburg";
  zones?: string[];
};

export type MenuItem = {
  id: string;
  name: string;
  category: string;
  description?: string;
  price: number;
  currency: Currency;
  available: boolean;
  dietaryTags?: string[];
};

export type Menu = {
  eateryId: string;
  items: MenuItem[];
  live: boolean;
};

export type CartLine = {
  id: string;
  name: string;
  qty: number;
  price: number;
};

export type Reservation = {
  id: string;
  eateryId: string;
  partySize: number;
  time: string;
  zone?: string;
  guestName?: string;
  phone?: string;
  createdAt: string;
};

export type Order = {
  id: string;
  eateryId: string;
  reservationId?: string;
  items: CartLine[];
  guestName?: string;
  phone?: string;
  createdAt: string;
};

export type ListEateriesParams = {
  query?: string;
  area?: string;
  cuisine?: string;
  openNow?: boolean;
};

export type CreateReservationInput = {
  eateryId: string;
  partySize: number;
  time: string;
  zone?: string;
  guestName?: string;
  phone?: string;
};

export type CreateOrderInput = {
  eateryId: string;
  reservationId?: string;
  items: CartLine[];
  guestName?: string;
  phone?: string;
};

export type TimeSlot = {
  iso: string;
  label: string;
  minutes: number;
};
