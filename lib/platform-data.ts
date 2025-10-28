import type { Platform } from "@/types/platform"

// Mock data - in production this would come from a database
export function generateMockPlatforms(): Platform[] {
  const companies = ["Cruz del Sur", "Oltursa", "Movil Tours", "Tepsa", "Civa", "Flores"]
  const destinations = ["Lima", "Arequipa", "Cusco", "Trujillo", "Piura", "Chiclayo", "Ica", "Tacna"]

  const platforms: Platform[] = []

  for (let i = 1; i <= 20; i++) {
    const isOccupied = Math.random() > 0.4
    const isMaintenance = !isOccupied && Math.random() > 0.9

    let status: Platform["status"] = "libre"
    if (isMaintenance) status = "mantenimiento"
    else if (isOccupied) status = "ocupado"

    const platform: Platform = {
      id: `platform-${i}`,
      number: i,
      status,
    }

    if (isOccupied) {
      const entryTime = new Date()
      entryTime.setHours(entryTime.getHours() - Math.floor(Math.random() * 4))

      const estimatedDeparture = new Date()
      estimatedDeparture.setHours(estimatedDeparture.getHours() + Math.floor(Math.random() * 3) + 1)

      platform.bus = {
        id: `bus-${i}`,
        company: companies[Math.floor(Math.random() * companies.length)],
        plateNumber: `A${Math.floor(Math.random() * 9) + 1}X-${Math.floor(Math.random() * 900) + 100}`,
        destination: destinations[Math.floor(Math.random() * destinations.length)],
        entryTime,
        estimatedDeparture,
      }
    }

    platforms.push(platform)
  }

  return platforms
}
