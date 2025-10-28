import type { BusSchedule } from "@/types/schedule"

// Mock data generator - simulates Kupos API response
export function generateMockSchedule(): BusSchedule[] {
  const companies = ["Cruz del Sur", "Oltursa", "Movil Tours", "Tepsa", "Civa", "Flores", "Excluciva", "Soyuz"]
  const routes = [
    { origin: "Lima", destination: "Arequipa" },
    { origin: "Lima", destination: "Cusco" },
    { origin: "Lima", destination: "Trujillo" },
    { origin: "Arequipa", destination: "Lima" },
    { origin: "Cusco", destination: "Lima" },
    { origin: "Piura", destination: "Lima" },
    { origin: "Lima", destination: "Chiclayo" },
    { origin: "Ica", destination: "Lima" },
  ]

  const schedules: BusSchedule[] = []
  const now = new Date()

  // Generate departures (salidas)
  for (let i = 0; i < 12; i++) {
    const scheduledTime = new Date(now)
    scheduledTime.setHours(now.getHours() + i)
    scheduledTime.setMinutes(Math.floor(Math.random() * 60))

    const route = routes[Math.floor(Math.random() * routes.length)]
    const isPast = scheduledTime < now
    const isDelayed = Math.random() > 0.7

    let status: BusSchedule["status"] = "a-tiempo"
    if (isPast) status = "completado"
    else if (isDelayed) status = "retrasado"

    const actualTime = isDelayed ? new Date(scheduledTime.getTime() + 30 * 60000) : undefined

    schedules.push({
      id: `departure-${i}`,
      type: "salida",
      company: companies[Math.floor(Math.random() * companies.length)],
      plateNumber: `A${Math.floor(Math.random() * 9) + 1}X-${Math.floor(Math.random() * 900) + 100}`,
      route: `${route.origin} - ${route.destination}`,
      origin: route.origin,
      destination: route.destination,
      scheduledTime,
      actualTime,
      status,
      platformNumber: isPast ? undefined : Math.floor(Math.random() * 20) + 1,
      gate: `Puerta ${String.fromCharCode(65 + Math.floor(Math.random() * 4))}`,
    })
  }

  // Generate arrivals (llegadas)
  for (let i = 0; i < 10; i++) {
    const scheduledTime = new Date(now)
    scheduledTime.setHours(now.getHours() + i)
    scheduledTime.setMinutes(Math.floor(Math.random() * 60))

    const route = routes[Math.floor(Math.random() * routes.length)]
    const isPast = scheduledTime < now
    const isDelayed = Math.random() > 0.75

    let status: BusSchedule["status"] = "a-tiempo"
    if (isPast) status = "completado"
    else if (isDelayed) status = "retrasado"

    const actualTime = isDelayed ? new Date(scheduledTime.getTime() + 45 * 60000) : undefined

    schedules.push({
      id: `arrival-${i}`,
      type: "llegada",
      company: companies[Math.floor(Math.random() * companies.length)],
      plateNumber: `A${Math.floor(Math.random() * 9) + 1}X-${Math.floor(Math.random() * 900) + 100}`,
      route: `${route.origin} - ${route.destination}`,
      origin: route.origin,
      destination: route.destination,
      scheduledTime,
      actualTime,
      status,
      platformNumber: isPast ? undefined : Math.floor(Math.random() * 20) + 1,
    })
  }

  return schedules.sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime())
}
