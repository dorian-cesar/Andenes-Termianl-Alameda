import type { Barrier } from "@/types/barrier"

export function generateMockBarriers(): Barrier[] {
  return [
    {
      id: "barrier-1",
      name: "Barrera Principal - Entrada",
      location: "Acceso Norte",
      status: "cerrada",
      lastAction: {
        type: "close",
        timestamp: new Date(Date.now() - 15 * 60000),
        user: "Operador Juan",
      },
    },
    {
      id: "barrier-2",
      name: "Barrera Principal - Salida",
      location: "Acceso Norte",
      status: "cerrada",
      lastAction: {
        type: "close",
        timestamp: new Date(Date.now() - 8 * 60000),
        user: "Operador María",
      },
    },
    {
      id: "barrier-3",
      name: "Barrera Secundaria - Entrada",
      location: "Acceso Sur",
      status: "cerrada",
      lastAction: {
        type: "close",
        timestamp: new Date(Date.now() - 45 * 60000),
        user: "Admin Carlos",
      },
    },
    {
      id: "barrier-4",
      name: "Barrera Secundaria - Salida",
      location: "Acceso Sur",
      status: "cerrada",
      lastAction: {
        type: "close",
        timestamp: new Date(Date.now() - 30 * 60000),
        user: "Operador Ana",
      },
    },
    {
      id: "barrier-5",
      name: "Barrera Emergencia",
      location: "Acceso Este",
      status: "cerrada",
    },
    {
      id: "barrier-6",
      name: "Barrera Mantenimiento",
      location: "Zona Talleres",
      status: "cerrada",
    },
  ]
}
