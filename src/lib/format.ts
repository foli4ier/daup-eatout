import type { Currency } from "../types";

export function money(amount: number, currency: Currency): string {
  const rounded = Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
  if (currency === "USD") return `$${rounded}`;
  return `R${rounded}`;
}

export function peopleLabel(n: number): string {
  return n === 1 ? "1 person" : `${n} people`;
}

export function titleCaseName(name: string): string {
  const letters = name.replace(/[^A-Za-z]/g, "");
  if (!letters || letters !== letters.toUpperCase()) return name;
  return name
    .toLowerCase()
    .replace(/(^|[\s&/-])([a-z])/g, (_, prefix: string, letter: string) => prefix + letter.toUpperCase());
}
