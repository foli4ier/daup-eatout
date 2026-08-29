import type { Eatery, MenuItem } from "../types";

export const EATERIES: Eatery[] = [
  {
    id: "kortrijk",
    name: "Kortrijk Bistro & Grill",
    area: "Kortrijk",
    cuisine: "Grill",
    currency: "ZAR",
    slug: "kortrijk.daup",
    blurb: "Grill, wine, and a terrace when the evening is warm.",
    hours: [{ open: "17:00", close: "22:00" }],
    hoursLabel: "Evenings, 5:00–10:00 pm",
    timezone: "Africa/Johannesburg",
    zones: ["Inside", "Terrace"],
  },
  {
    id: "genesis",
    name: "Genesis Bistro",
    area: "Cape Town",
    cuisine: "Bistro",
    currency: "USD",
    slug: "genesis-bistro.daup",
    blurb: "A neighbourhood table in Cape Town. Lunch through dinner.",
    hours: [
      { open: "12:00", close: "15:00" },
      { open: "18:00", close: "22:00" },
    ],
    hoursLabel: "Lunch and dinner",
    timezone: "Africa/Johannesburg",
  },
  {
    id: "noop",
    name: "Noop Restaurant",
    area: "Stellenbosch",
    cuisine: "Contemporary",
    currency: "ZAR",
    slug: "noop.daup",
    blurb: "Contemporary cooking in Stellenbosch. Pre-order from tonight’s menu.",
    hours: [{ open: "12:00", close: "22:00" }],
    hoursLabel: "Lunch and dinner",
    timezone: "Africa/Johannesburg",
  },
];

function dish(
  id: string,
  name: string,
  category: string,
  price: number,
  currency: MenuItem["currency"],
  extra?: Partial<MenuItem>,
): MenuItem {
  return {
    id,
    name,
    category,
    price,
    currency,
    available: true,
    ...extra,
  };
}

export const KORTRIJK_MENU: MenuItem[] = [
  dish("k-livers", "Peri-peri chicken livers", "Starters", 95, "ZAR", {
    description: "Creamy, hot, with toasted sourdough.",
  }),
  dish("k-croquettes", "Biltong & cheddar croquettes", "Starters", 85, "ZAR", {
    description: "Crisp outside, molten centre.",
  }),
  dish("k-halloumi", "Grilled halloumi", "Starters", 88, "ZAR", {
    description: "Lemon, honey, and wild rocket.",
    dietaryTags: ["Vegetarian"],
  }),
  dish("k-ribeye", "Ribeye 300g", "Grill", 245, "ZAR", {
    description: "Flame-grilled. Onion rings, side, and sauce.",
  }),
  dish("k-chops", "Lamb loin chops", "Grill", 265, "ZAR", {
    description: "Rosemary butter and charred lemon.",
  }),
  dish("k-chicken", "Half chicken peri-peri", "Grill", 165, "ZAR", {
    description: "Off the coals, mild or hot.",
  }),
  dish("k-belly", "Sticky pork belly", "Grill", 185, "ZAR", {
    description: "Apple slaw and crackling.",
  }),
  dish("k-burger", "Smash burger", "Burgers", 145, "ZAR", {
    description: "Cheddar, pickles, brioche, chips.",
  }),
  dish("k-chips", "Hand-cut chips", "Sides", 45, "ZAR", {
    dietaryTags: ["Vegetarian"],
  }),
  dish("k-greens", "Seasonal greens", "Sides", 48, "ZAR", {
    dietaryTags: ["Vegetarian"],
  }),
  dish("k-malva", "Malva pudding", "Desserts", 75, "ZAR", {
    description: "Warm, with cream.",
    dietaryTags: ["Vegetarian"],
  }),
  dish("k-ice", "Vanilla ice cream", "Desserts", 55, "ZAR", {
    dietaryTags: ["Vegetarian"],
  }),
];

export const GENESIS_MENU: MenuItem[] = [
  dish("g-soup", "Tomato & basil soup", "Starters", 9, "USD", {
    description: "Ripe tomatoes, olive oil, grilled bread.",
    dietaryTags: ["Vegetarian"],
  }),
  dish("g-burrata", "Burrata & stone fruit", "Starters", 14, "USD", {
    description: "When in season, with basil oil.",
    dietaryTags: ["Vegetarian"],
  }),
  dish("g-tartare", "Beef tartare", "Starters", 16, "USD", {
    description: "Caper, shallot, toasted sourdough.",
  }),
  dish("g-chicken", "Roast chicken", "Mains", 24, "USD", {
    description: "Pan juices, roast potatoes, greens.",
  }),
  dish("g-fish", "Catch of the day", "Mains", 28, "USD", {
    description: "Ask us what came in this morning.",
  }),
  dish("g-risotto", "Wild mushroom risotto", "Mains", 22, "USD", {
    description: "Parmesan and thyme.",
    dietaryTags: ["Vegetarian"],
  }),
  dish("g-steak", "Steak frites", "Mains", 32, "USD", {
    description: "Pepper sauce on the side.",
  }),
  dish("g-salad", "House salad", "Sides", 11, "USD", {
    dietaryTags: ["Vegetarian"],
  }),
  dish("g-fries", "Fries", "Sides", 7, "USD", {
    dietaryTags: ["Vegetarian"],
  }),
  dish("g-tart", "Lemon tart", "Desserts", 11, "USD", {
    dietaryTags: ["Vegetarian"],
  }),
  dish("g-choc", "Chocolate pot", "Desserts", 12, "USD", {
    dietaryTags: ["Vegetarian"],
  }),
];

export const NOOP_FALLBACK_MENU: MenuItem[] = [
  dish("n-tuna", "Seared & Tempura Yellowfin Tuna", "Starters & Small Plates", 160, "ZAR", {
    description: "Baby herbs, wakame, avocado, edamame, wasabi mayo.",
    dietaryTags: ["Chef Special"],
  }),
  dish("n-pork", "Honey & Soy Pork Roast Belly", "Grill & Mains", 140, "ZAR", {
    description: "Coconut curry cream, tempura lychee, toasted peanuts.",
    dietaryTags: ["Chef Special"],
  }),
  dish("n-ravioli", "Homemade Wild Mushroom Ravioli", "Mains", 135, "ZAR", {
    description: "White truffle beurre noisette, parmesan, crisp sage.",
    dietaryTags: ["Vegetarian", "Chef Special"],
  }),
  dish("n-squid", "Spiced Crispy Squid", "Mains", 135, "ZAR", {
    description: "Mango & ginger chutney, saffron aioli.",
  }),
  dish("n-mussels", "Fresh West Coast Black Mussels", "Mains", 135, "ZAR", {
    description: "White wine, onion, garlic & cream.",
  }),
  dish("n-prawn", "Prawn Tempura", "Mains", 149, "ZAR", {
    description: "Pickled daikon, sesame, sweet tentsuyu.",
  }),
  dish("n-malva", "Traditional Malva Pudding", "Desserts", 120, "ZAR", {
    description: "Anglaise and homemade milk ice cream.",
    dietaryTags: ["Vegetarian"],
  }),
  dish("n-cheese", "Cheese Board", "Desserts", 185, "ZAR", {
    description: "Five cheeses, homemade preserves, toasted sourdough.",
  }),
];

export const SEEDED_MENUS: Record<string, MenuItem[]> = {
  kortrijk: KORTRIJK_MENU,
  genesis: GENESIS_MENU,
  noop: NOOP_FALLBACK_MENU,
};

export const NOOP_MENU_URL = "https://eatery.daup.co.za/data/scraped_menus.json";
