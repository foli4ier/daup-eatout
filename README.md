# EatOut

Diner app for eatout.daup.co.za. Find a place, pick a time, order food.

Hungry people use this on their phone: search eateries, book a table, and pre-order from the menu. Pay at the table — nothing here takes a card.

## Local

Install dependencies, then start the Vite development server and open the URL it prints (usually on port 5173).

The production build script is tsc then Vite. Preview serves the dist folder.

## Deploy

Cloudflare Workers Builds on main. Static files land in dist and are served as a single-page app via wrangler.json.

Do not commit node_modules or dist.

## Data

Menus and bookings currently live in the browser (memory + localStorage) behind a small typed client in src/api/eatout.ts. Swap that file for HTTP calls when a live API is ready. Noop Restaurant loads its menu from the live eatery feed when it can, and falls back to a baked menu if the request fails.
