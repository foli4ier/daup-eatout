type Props = {
  name: string;
  phone: string;
  onName: (v: string) => void;
  onPhone: (v: string) => void;
};

export default function GuestFields({ name, phone, onName, onPhone }: Props) {
  return (
    <>
      <div className="field">
        <label htmlFor="guest-name">First name (optional)</label>
        <input
          id="guest-name"
          name="guestName"
          autoComplete="given-name"
          placeholder="What should we call you?"
          value={name}
          onChange={(e) => onName(e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="guest-phone">Phone (optional)</label>
        <input
          id="guest-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="If we need to reach you"
          value={phone}
          onChange={(e) => onPhone(e.target.value)}
        />
      </div>
    </>
  );
}
