export interface Platform {
  id: string
  number: number
  status: "libre" | "ocupado" | "mantenimiento"
  bus?: {
    id: string
    company: string
    plateNumber: string
    destination: string
    entryTime: Date
    estimatedDeparture?: Date
  }
}

export interface BusEntry {
  id: string
  platformId: string
  company: string
  plateNumber: string
  destination: string
  entryTime: Date
  exitTime?: Date
  duration?: number
  cost?: number
}
