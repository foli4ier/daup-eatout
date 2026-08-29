import { money } from "../lib/format";
import type { CartLine, MenuItem } from "../types";

type Props = {
  items: MenuItem[];
  cart: CartLine[];
  onAdd: (item: MenuItem) => void;
  onQty: (id: string, qty: number) => void;
};

function grouped(items: MenuItem[]): [string, MenuItem[]][] {
  const order: string[] = [];
  const map = new Map<string, MenuItem[]>();
  for (const item of items) {
    const cat = item.category || "Menu";
    if (!map.has(cat)) {
      map.set(cat, []);
      order.push(cat);
    }
    map.get(cat)!.push(item);
  }
  return order.map((cat) => [cat, map.get(cat)!]);
}

export default function MenuList({ items, cart, onAdd, onQty }: Props) {
  const qtyOf = (id: string) => cart.find((line) => line.id === id)?.qty ?? 0;

  return (
    <div className="menu-block">
      {grouped(items).map(([category, dishes]) => (
        <section key={category}>
          <h3 className="cat">{category}</h3>
          {dishes.map((dish) => {
            const qty = qtyOf(dish.id);
            return (
              <article
                key={dish.id}
                className={`dish ${dish.available ? "" : "unavailable"}`.trim()}
              >
                <div>
                  <h3>{dish.name}</h3>
                  {dish.description ? <p>{dish.description}</p> : null}
                  <div className="price">{money(dish.price, dish.currency)}</div>
                  {dish.dietaryTags?.length ? (
                    <div className="tags">
                      {dish.dietaryTags.map((tag) => (
                        <span className="tag" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div className="dish-actions">
                  {!dish.available ? (
                    <span className="meta">Not on today</span>
                  ) : qty > 0 ? (
                    <div className="qty-pill">
                      <button
                        type="button"
                        className="icon-btn"
                        aria-label={`Remove one ${dish.name}`}
                        onClick={() => onQty(dish.id, qty - 1)}
                      >
                        −
                      </button>
                      <span aria-live="polite">{qty}</span>
                      <button
                        type="button"
                        className="icon-btn solid"
                        aria-label={`Add another ${dish.name}`}
                        onClick={() => onQty(dish.id, qty + 1)}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="icon-btn solid"
                      aria-label={`Add ${dish.name} to order`}
                      onClick={() => onAdd(dish)}
                    >
                      +
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      ))}
    </div>
  );
}
