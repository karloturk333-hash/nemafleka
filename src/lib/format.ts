/** Format an integer EUR amount the Croatian way: "45 €". */
export function formatEur(n: number): string {
  return `${n} €`;
}

/** "od X €" label. */
export function fromEur(n: number): string {
  return `od ${n} €`;
}
