export const getLevenshteinDistance = (a: string, b: string): number => {
  const tmp: number[][] = []
  let i: number, j: number
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length
  for (i = 0; i <= a.length; i++) tmp[i] = [i]
  for (j = 0; j <= b.length; j++) tmp[0][j] = j
  for (i = 1; i <= a.length; i++) {
    for (j = 1; j <= b.length; j++) {
      tmp[i][j] = Math.min(
        tmp[i - 1][j] + 1,
        tmp[i][j - 1] + 1,
        tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      )
    }
  }
  return tmp[a.length][b.length]
}

export const getCloseMatches = (query: string, list: string[], limit = 3): string[] => {
  const q = query.toLowerCase().trim()
  if (!q) return []
  
  // Prefix matching first (exact start)
  const startMatches = list.filter((item) => item.toLowerCase().startsWith(q))
  if (startMatches.length >= limit) return startMatches.slice(0, limit)

  // Mid-word contains matching second
  const containMatches = list.filter((item) => item.toLowerCase().includes(q) && !startMatches.includes(item))
  const combined = [...startMatches, ...containMatches]
  if (combined.length >= limit) return combined.slice(0, limit)

  // Typo tolerance Levenshtein distance third
  const distanceList = list
    .map((item) => ({
      item,
      distance: getLevenshteinDistance(q, item.toLowerCase())
    }))
    .filter((d) => d.distance <= 3) // Tolerates up to 3 character edits
    .sort((a, b) => a.distance - b.distance)
    .map((d) => d.item)

  const finalMatches = Array.from(new Set([...combined, ...distanceList]))
  return finalMatches.slice(0, limit)
}
export default getCloseMatches
