"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { SystemAlert, WebSocketMessage } from "@/types/alert";
import { useToast } from "@/hooks/use-toast";

interface WebSocketContextType {
  isConnected: boolean;
  alerts: SystemAlert[];
  markAlertAsRead: (id: string) => void;
  clearAlert: (id: string) => void;
  clearAllAlerts: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate WebSocket connection
    // In production, this would be a real WebSocket connection
    console.log("WebSocket: Connecting to real-time server...");
    setIsConnected(true);

    // Simulate receiving real-time messages
    const interval = setInterval(() => {
      simulateWebSocketMessage();
    }, 15000); // Every 15 seconds

    return () => {
      clearInterval(interval);
      setIsConnected(false);
    };
  }, []);

  const simulateWebSocketMessage = () => {
    const messageTypes: WebSocketMessage["type"][] = [
      "new_entry",
      "new_exit",
      "alert",
      "platform_update",
      "barrier_update",
    ];

    const randomType =
      messageTypes[Math.floor(Math.random() * messageTypes.length)];

    switch (randomType) {
      case "new_entry":
        handleNewEntry();
        break;
      case "new_exit":
        handleNewExit();
        break;
      case "alert":
        handleAlert();
        break;
      case "platform_update":
        handlePlatformUpdate();
        break;
      case "barrier_update":
        handleBarrierUpdate();
        break;
    }
  };

  const handleNewEntry = () => {
    const companies = ["Cruz del Sur", "Oltursa", "Movil Tours", "Tepsa"];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const platformNumber = Math.floor(Math.random() * 20) + 1;

    const alert: SystemAlert = {
      id: `alert-${Date.now()}`,
      type: "info",
      title: "Nuevo Ingreso",
      message: `Bus de ${company} ingresó al andén ${platformNumber}`,
      timestamp: new Date(),
      platformId: `platform-${platformNumber}`,
      read: false,
    };

    setAlerts((prev) => [alert, ...prev]);
    toast({
      title: alert.title,
      description: alert.message,
    });
  };

  const handleNewExit = () => {
    const companies = ["Cruz del Sur", "Oltursa", "Movil Tours", "Tepsa"];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const platformNumber = Math.floor(Math.random() * 20) + 1;

    const alert: SystemAlert = {
      id: `alert-${Date.now()}`,
      type: "success",
      title: "Salida Registrada",
      message: `Bus de ${company} salió del andén ${platformNumber}`,
      timestamp: new Date(),
      platformId: `platform-${platformNumber}`,
      read: false,
    };

    setAlerts((prev) => [alert, ...prev]);
  };

  const handleAlert = () => {
    const alertTypes = [
      {
        type: "warning" as const,
        title: "Exceso de Permanencia",
        message: "Bus en andén 7 supera las 3 horas de estadía",
      },
      {
        type: "error" as const,
        title: "Falla en Barrera",
        message: "Barrera Principal - Entrada no responde",
      },
      {
        type: "warning" as const,
        title: "Capacidad Alta",
        message: "Terminal al 85% de capacidad",
      },
    ];

    const randomAlert =
      alertTypes[Math.floor(Math.random() * alertTypes.length)];

    const alert: SystemAlert = {
      id: `alert-${Date.now()}`,
      ...randomAlert,
      timestamp: new Date(),
      read: false,
    };

    setAlerts((prev) => [alert, ...prev]);
    toast({
      title: alert.title,
      description: alert.message,
      variant: alert.type === "error" ? "destructive" : "default",
    });
  };

  const handlePlatformUpdate = () => {
    console.log("WebSocket: Platform status updated");
  };

  const handleBarrierUpdate = () => {
    console.log("WebSocket: Barrier status updated");
  };

  const markAlertAsRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === id ? { ...alert, read: true } : alert))
    );
  };

  const clearAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        alerts,
        markAlertAsRead,
        clearAlert,
        clearAllAlerts,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
}
