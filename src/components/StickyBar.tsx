import { Link } from "react-router-dom";
import { money } from "../lib/format";
import type { Currency } from "../types";

type Props = {
  count: number;
  subtotal: number;
  currency: Currency;
  hasTable: boolean;
  to: string;
};

export default function StickyBar({ count, subtotal, currency, hasTable, to }: Props) {
  const label = hasTable && count > 0 ? "Book & order" : hasTable ? "Book table" : "Continue";
  const summary =
    count > 0
      ? `${count} in your bag · ${money(subtotal, currency)}`
      : hasTable
        ? "Table ready"
        : "Pick a time or add food";

  return (
    <div className="sticky">
      <div className="summary">
        <strong>{summary}</strong>
        <span>{hasTable ? "Pay when you eat" : "Choose a time before you confirm"}</span>
      </div>
      <Link className="primary" to={to} aria-label={label}>
        {label}
      </Link>
    </div>
  );
}
