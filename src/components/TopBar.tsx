import { Link } from "react-router-dom";

type Props = {
  backTo?: string;
  backAriaLabel?: string;
};

export default function TopBar({ backTo, backAriaLabel = "Back" }: Props) {
  return (
    <header className="topbar">
      {backTo ? (
        <Link className="back" to={backTo} aria-label={backAriaLabel}>
          Back
        </Link>
      ) : null}
      <a className="logo" href="https://www.daup.co.za">
        DAUP
      </a>
    </header>
  );
}
