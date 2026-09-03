import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getBooking } from "../api/eatout";
import TopBar from "../components/TopBar";
import { money, peopleLabel } from "../lib/format";
import { formatWhen } from "../lib/hours";
import type { Eatery, Order, Reservation } from "../types";

export default function Confirmation() {
  const { id } = useParams();
  const [data, setData] = useState<{
    reservation: Reservation;
    order: Order | null;
    eatery: Eatery | null;
  } | null | undefined>(undefined);

  useEffect(() => {
    if (!id) return;
    getBooking(id).then(setData);
  }, [id]);

  if (data === undefined) {
    return (
      <main className="page">
        <p className="lede">Loading…</p>
      </main>
    );
  }

  if (!data || !data.eatery) {
    return (
      <main className="page">
        <TopBar backTo="/" />
        <h1>We can’t find that booking</h1>
        <p className="lede">This booking is on this phone. If you clear the browser, we can’t show it.</p>
      </main>
    );
  }

  const { reservation, order, eatery } = data;
  const foodTotal = order?.items.reduce((sum, line) => sum + line.qty * line.price, 0) ?? 0;

  return (
    <main className="page">
      <TopBar />
      <div className="success-mark" aria-hidden="true">
        ✓
      </div>
      <h1>You’re booked</h1>
      <p className="lede">
        {order ? "Table booked and order placed." : "Table booked."} See you at {eatery.name}.
      </p>

      <section className="section">
        <h2>Table</h2>
        <p>
          <strong>{eatery.name}</strong>
          <br />
          {eatery.area}
        </p>
        <p>
          {formatWhen(reservation.time)}
          <br />
          {peopleLabel(reservation.partySize)}
          {reservation.zone ? ` · ${reservation.zone}` : ""}
        </p>
        {reservation.guestName ? <p>For {reservation.guestName}</p> : null}
      </section>

      {order ? (
        <section className="section">
          <h2>Your order</h2>
          {order.items.map((line) => (
            <div className="line-item" key={line.id}>
              <div>
                {line.qty} × {line.name}
              </div>
              <div>{money(line.price * line.qty, eatery.currency)}</div>
            </div>
          ))}
          <div className="total">
            <span>Food total</span>
            <span>{money(foodTotal, eatery.currency)}</span>
          </div>
        </section>
      ) : null}

      <p className="note">Pay at the table. Nothing is charged now.</p>

      <div className="stack">
        <Link className="btn btn-primary" to="/">
          Find another place
        </Link>
      </div>
    </main>
  );
}
