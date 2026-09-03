import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createOrder, createReservation, getEatery } from "../api/eatout";
import GuestFields from "../components/GuestFields";
import Stepper from "../components/Stepper";
import TimeSlots from "../components/TimeSlots";
import TopBar from "../components/TopBar";
import ZonePicker from "../components/ZonePicker";
import { useBooking } from "../context/BookingContext";
import { money, peopleLabel } from "../lib/format";
import { formatWhen } from "../lib/hours";
import type { Eatery as EateryType } from "../types";

export default function Review() {
  const { id } = useParams();
  const navigate = useNavigate();
  const booking = useBooking();
  const [place, setPlace] = useState<EateryType | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    booking.ensurePlace(id);
    getEatery(id).then(setPlace);
  }, [id]);

  const { draft, itemCount, subtotal } = booking;

  async function confirm() {
    if (!place || !draft.timeIso) {
      setError("Pick a time for your table.");
      return;
    }
    if (place.zones?.length && !draft.zone) {
      setError("Choose where you would like to sit.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const reservation = await createReservation({
        eateryId: place.id,
        partySize: draft.partySize,
        time: draft.timeIso,
        zone: draft.zone ?? undefined,
        guestName: draft.guestName,
        phone: draft.phone,
      });
      if (draft.items.length) {
        await createOrder({
          eateryId: place.id,
          reservationId: reservation.id,
          items: draft.items,
          guestName: draft.guestName,
          phone: draft.phone,
        });
      }
      booking.resetDraft();
      navigate(`/booked/${reservation.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not complete that. Try again.");
      setBusy(false);
    }
  }

  if (!place) {
    return (
      <main className="page">
        <p className="lede">Loading…</p>
      </main>
    );
  }

  const canConfirm = Boolean(draft.timeIso) && !busy;

  return (
    <main className="page">
      <TopBar backTo={`/place/${place.id}`} backAriaLabel="Back to menu" />

      <h1>Check your table{itemCount ? " and order" : ""}</h1>
      <p className="lede">
        {place.name} · {place.area}. Pay when you eat.
      </p>

      <section className="section">
        <h2>Table</h2>
        {draft.timeIso ? (
          <p>
            {peopleLabel(draft.partySize)} · {formatWhen(draft.timeIso)}
            {draft.zone ? ` · ${draft.zone}` : ""}
          </p>
        ) : (
          <p className="hint">Still need a time.</p>
        )}
        <div style={{ marginTop: 12 }}>
          <Stepper
            label="People"
            value={draft.partySize}
            onChange={booking.setPartySize}
            valueLabel={peopleLabel(draft.partySize)}
          />
          <TimeSlots
            eatery={place}
            day={draft.day}
            timeIso={draft.timeIso}
            onDay={booking.setDay}
            onTime={booking.setTime}
          />
          {place.zones?.length ? (
            <ZonePicker zones={place.zones} value={draft.zone} onChange={booking.setZone} />
          ) : null}
        </div>
      </section>

      <section className="section">
        <h2>Order</h2>
        {draft.items.length === 0 ? (
          <p className="hint">
            No food yet — that’s fine.{" "}
            <Link to={`/place/${place.id}`}>Add dishes</Link> or just book the table.
          </p>
        ) : (
          draft.items.map((line) => (
            <div className="line-item" key={line.id}>
              <div>
                <strong>
                  {line.qty} × {line.name}
                </strong>
                <div className="meta">{money(line.price * line.qty, place.currency)}</div>
              </div>
              <div className="qty-pill">
                <button
                  type="button"
                  className="icon-btn"
                  aria-label={`Remove one ${line.name}`}
                  onClick={() => booking.setQty(line.id, line.qty - 1)}
                >
                  −
                </button>
                <span>{line.qty}</span>
                <button
                  type="button"
                  className="icon-btn solid"
                  aria-label={`Add another ${line.name}`}
                  onClick={() => booking.setQty(line.id, line.qty + 1)}
                >
                  +
                </button>
              </div>
            </div>
          ))
        )}
        {draft.items.length > 0 ? (
          <div className="total">
            <span>Food total</span>
            <span>{money(subtotal, place.currency)}</span>
          </div>
        ) : null}
      </section>

      <section className="section">
        <h2>Your details</h2>
        <GuestFields
          name={draft.guestName}
          phone={draft.phone}
          onName={(guestName) => booking.setGuest(guestName, draft.phone)}
          onPhone={(phone) => booking.setGuest(draft.guestName, phone)}
        />
      </section>

      {error ? <p className="hint">{error}</p> : null}

      <div className="stack">
        <button type="button" className="btn btn-primary" onClick={confirm} disabled={!canConfirm}>
          {busy
            ? "Booking…"
            : itemCount
              ? "Confirm table and order"
              : "Confirm table"}
        </button>
        <Link className="btn btn-outline" to={`/place/${place.id}`}>
          Keep browsing the menu
        </Link>
      </div>
    </main>
  );
}
