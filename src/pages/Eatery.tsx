import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEatery, getMenu } from "../api/eatout";
import MenuList from "../components/MenuList";
import Stepper from "../components/Stepper";
import StickyBar from "../components/StickyBar";
import TimeSlots from "../components/TimeSlots";
import TopBar from "../components/TopBar";
import ZonePicker from "../components/ZonePicker";
import { useBooking } from "../context/BookingContext";
import { peopleLabel } from "../lib/format";
import { isOpenNow } from "../lib/hours";
import type { Eatery as EateryType, Menu } from "../types";

export default function Eatery() {
  const { id } = useParams();
  const [place, setPlace] = useState<EateryType | null | undefined>(undefined);
  const [menu, setMenu] = useState<Menu | null>(null);
  const booking = useBooking();

  useEffect(() => {
    if (!id) return;
    let alive = true;
    getEatery(id).then((found) => {
      if (alive) setPlace(found);
    });
    getMenu(id).then((loaded) => {
      if (alive) setMenu(loaded);
    });
    return () => {
      alive = false;
    };
  }, [id]);

  useEffect(() => {
    if (id) booking.ensurePlace(id);
  }, [id, booking]);

  useEffect(() => {
    if (place?.zones?.length && !booking.draft.zone) {
      booking.setZone(place.zones[0]);
    }
  }, [place, booking]);

  if (place === undefined) {
    return (
      <main className="page">
        <p className="lede">Loading…</p>
      </main>
    );
  }

  if (!place || !id) {
    return (
      <main className="page">
        <TopBar backTo="/" />
        <p className="empty">We can’t find that place.</p>
      </main>
    );
  }

  const open = isOpenNow(place);
  const { draft, itemCount, subtotal } = booking;
  const hasTable = Boolean(draft.timeIso);

  return (
    <main className="page has-bar">
      <TopBar backTo="/" backAriaLabel="Back to places" />

      <div className="place-head">
        <div className="row">
          <h1>{place.name}</h1>
          <span className={`badge ${open ? "open" : "closed"}`}>{open ? "Open now" : "Closed"}</span>
        </div>
        <p>
          {place.area} · {place.cuisine} · {place.hoursLabel}
        </p>
        <p>{place.blurb}</p>
      </div>

      <section className="section" aria-labelledby="book-heading">
        <h2 id="book-heading">Book a table</h2>
        <p className="meta" style={{ marginBottom: 12 }}>
          How many people?
        </p>
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
      </section>

      <section className="section" aria-labelledby="menu-heading">
        <h2 id="menu-heading">
          Menu
          {menu?.live ? <span className="live">Live tonight</span> : null}
        </h2>
        {!menu ? (
          <p className="hint">Loading the menu…</p>
        ) : menu.items.length === 0 ? (
          <p className="hint">No dishes listed right now. You can still book a table.</p>
        ) : (
          <MenuList
            items={menu.items}
            cart={draft.items}
            onAdd={(item) =>
              booking.addItem({ id: item.id, name: item.name, price: item.price })
            }
            onQty={booking.setQty}
          />
        )}
      </section>

      <StickyBar
        count={itemCount}
        subtotal={subtotal}
        currency={place.currency}
        hasTable={hasTable}
        to={`/place/${place.id}/review`}
      />
    </main>
  );
}
