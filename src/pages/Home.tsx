import { useEffect, useMemo, useState } from "react";
import { listAreas, listCuisines, listEateries } from "../api/eatout";
import EateryCard from "../components/EateryCard";
import TopBar from "../components/TopBar";
import type { Eatery } from "../types";

export default function Home() {
  const [query, setQuery] = useState("");
  const [area, setArea] = useState<string | null>(null);
  const [cuisine, setCuisine] = useState<string | null>(null);
  const [openNow, setOpenNow] = useState(false);
  const [places, setPlaces] = useState<Eatery[]>([]);

  const areas = useMemo(() => listAreas(), []);
  const cuisines = useMemo(() => listCuisines(), []);

  useEffect(() => {
    let alive = true;
    listEateries({
      query: query || undefined,
      area: area ?? undefined,
      cuisine: cuisine ?? undefined,
      openNow: openNow || undefined,
    }).then((result) => {
      if (alive) setPlaces(result);
    });
    return () => {
      alive = false;
    };
  }, [query, area, cuisine, openNow]);

  return (
    <main className="page">
      <TopBar />
      <h1>EatOut</h1>
      <p className="lede">Find a table. Order food.</p>

      <label className="sr-only" htmlFor="search">
        Search eateries
      </label>
      <input
        id="search"
        className="search"
        type="search"
        placeholder="Search name, area, cuisine"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoComplete="off"
      />

      <div className="chips">
        <button
          type="button"
          className="chip ghost"
          aria-pressed={openNow}
          onClick={() => setOpenNow((v) => !v)}
        >
          Open now
        </button>
        {cuisines.map((c) => (
          <button
            key={c}
            type="button"
            className="chip"
            aria-pressed={cuisine === c}
            onClick={() => setCuisine(cuisine === c ? null : c)}
          >
            {c}
          </button>
        ))}
        {areas.map((a) => (
          <button
            key={a}
            type="button"
            className="chip"
            aria-pressed={area === a}
            onClick={() => setArea(area === a ? null : a)}
          >
            {a}
          </button>
        ))}
      </div>

      {places.length === 0 ? (
        <p className="empty">Nothing matches. Clear a filter or try another name.</p>
      ) : (
        <div className="list">
          {places.map((eatery) => (
            <EateryCard key={eatery.id} eatery={eatery} />
          ))}
        </div>
      )}
    </main>
  );
}
