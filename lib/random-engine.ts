/**
 * Select a cryptographically random winner index from participants
 * Uses crypto.getRandomValues() -- never Math.random()
 */
export function selectRandomWinner(totalRows: number): number {
  if (totalRows <= 0) throw new Error("No participants to select from")
  if (totalRows === 1) return 0

  const array = new Uint32Array(1)
  crypto.getRandomValues(array)
  return array[0] % totalRows
}
