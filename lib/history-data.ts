import type { BusEntry } from "@/types/platform"

// Cost calculation: S/. 5 per hour
const COST_PER_HOUR = 5

export function generateMockHistory(): BusEntry[] {
  const companies = ["Cruz del Sur", "Oltursa", "Movil Tours", "Tepsa", "Civa", "Flores"]
  const destinations = ["Lima", "Arequipa", "Cusco", "Trujillo", "Piura", "Chiclayo", "Ica", "Tacna"]

  const history: BusEntry[] = []
  const now = new Date()

  // Generate 50 historical entries
  for (let i = 0; i < 50; i++) {
    const entryTime = new Date(now)
    entryTime.setDate(now.getDate() - Math.floor(Math.random() * 7)) // Last 7 days
    entryTime.setHours(Math.floor(Math.random() * 24))
    entryTime.setMinutes(Math.floor(Math.random() * 60))

    const durationMinutes = Math.floor(Math.random() * 300) + 30 // 30 min to 5 hours
    const exitTime = new Date(entryTime.getTime() + durationMinutes * 60000)

    const durationHours = durationMinutes / 60
    const cost = Math.ceil(durationHours * COST_PER_HOUR)

    history.push({
      id: `entry-${i}`,
      platformId: `platform-${Math.floor(Math.random() * 20) + 1}`,
      company: companies[Math.floor(Math.random() * companies.length)],
      plateNumber: `A${Math.floor(Math.random() * 9) + 1}X-${Math.floor(Math.random() * 900) + 100}`,
      destination: destinations[Math.floor(Math.random() * destinations.length)],
      entryTime,
      exitTime,
      duration: durationMinutes,
      cost,
    })
  }

  return history.sort((a, b) => b.entryTime.getTime() - a.entryTime.getTime())
}

export function calculateStats(history: BusEntry[]) {
  const totalEntries = history.length
  const totalRevenue = history.reduce((sum, entry) => sum + (entry.cost || 0), 0)
  const avgDuration = history.reduce((sum, entry) => sum + (entry.duration || 0), 0) / totalEntries
  const avgCost = totalRevenue / totalEntries

  return {
    totalEntries,
    totalRevenue,
    avgDuration: Math.round(avgDuration),
    avgCost: Math.round(avgCost),
  }
}
