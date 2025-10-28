export interface Barrier {
  id: string
  name: string
  location: string
  status: "abierta" | "cerrada" | "error"
  lastAction?: {
    type: "open" | "close"
    timestamp: Date
    user: string
  }
}
