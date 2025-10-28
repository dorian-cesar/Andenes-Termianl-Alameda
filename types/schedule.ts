export interface BusSchedule {
  id: string
  type: "salida" | "llegada"
  company: string
  plateNumber: string
  route: string
  origin?: string
  destination?: string
  scheduledTime: Date
  actualTime?: Date
  status: "a-tiempo" | "retrasado" | "cancelado" | "completado"
  platformNumber?: number
  gate?: string
}
