export interface SystemAlert {
  id: string
  type: "warning" | "error" | "info" | "success"
  title: string
  message: string
  timestamp: Date
  platformId?: string
  barrierId?: string
  read: boolean
}

export interface WebSocketMessage {
  type: "platform_update" | "barrier_update" | "new_entry" | "new_exit" | "alert" | "schedule_update"
  data: any
  timestamp: Date
}
