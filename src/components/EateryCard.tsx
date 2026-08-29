import { Link } from "react-router-dom";
import { isOpenNow } from "../lib/hours";
import type { Eatery } from "../types";

export default function EateryCard({ eatery }: { eatery: Eatery }) {
  const open = isOpenNow(eatery);
  return (
    <Link className="card" to={`/place/${eatery.id}`}>
      <div className="row">
        <h2>{eatery.name}</h2>
        <span className={`badge ${open ? "open" : "closed"}`}>{open ? "Open now" : "Closed"}</span>
      </div>
      <div className="meta">
        {eatery.area} · {eatery.cuisine}
      </div>
      <div className="meta" style={{ marginTop: 4 }}>
        {eatery.hoursLabel}
      </div>
    </Link>
  );
}
