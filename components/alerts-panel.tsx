"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWebSocket } from "@/contexts/websocket-context";
import {
  AlertCircle,
  CheckCircle,
  Info,
  XCircle,
  X,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AlertsPanel() {
  const { alerts, markAlertAsRead, clearAlert, clearAllAlerts } =
    useWebSocket();

  const unreadCount = alerts.filter((a) => !a.read).length;

  const alertConfig = {
    warning: {
      icon: AlertCircle,
      color: "text-amber-600",
      bg: "bg-amber-50 border-amber-200",
      badge: "bg-amber-100 text-amber-700",
    },
    error: {
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50 border-red-200",
      badge: "bg-red-100 text-red-700",
    },
    info: {
      icon: Info,
      color: "text-blue-600",
      bg: "bg-blue-50 border-blue-200",
      badge: "bg-blue-100 text-blue-700",
    },
    success: {
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50 border-green-200",
      badge: "bg-green-100 text-green-700",
    },
  };

  return (
    <Card className="animate-bounce-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-primary">Alertas del Sistema</CardTitle>
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="rounded-full animate-pulse"
              >
                {unreadCount}
              </Badge>
            )}
          </div>
          {alerts.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAllAlerts}>
              <Trash2 className="w-4 h-4 mr-2" />
              Limpiar todo
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <CheckCircle className="w-12 h-12 mb-3 text-green-500 animate-scale-in" />
              <p className="text-sm">No hay alertas activas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => {
                const config = alertConfig[alert.type];
                const AlertIcon = config.icon;

                return (
                  <div
                    key={alert.id}
                    className={cn(
                      "border-2 rounded-lg p-4 hover-lift transition-smooth cursor-pointer",
                      config.bg,
                      !alert.read && "shadow-md animate-slide-in-right",
                      alert.read && "opacity-60"
                    )}
                    onClick={() => !alert.read && markAlertAsRead(alert.id)}
                  >
                    <div className="flex items-start gap-3">
                      <AlertIcon
                        className={cn(
                          "w-5 h-5 shrink-0 mt-0.5 hover-scale",
                          config.color
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-sm">
                            {alert.title}
                          </h4>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0 hover-scale"
                            onClick={(e) => {
                              e.stopPropagation();
                              clearAlert(alert.id);
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {alert.message}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {new Date(alert.timestamp).toLocaleTimeString(
                              "es-PE",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                          {!alert.read && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-primary text-primary-foreground"
                            >
                              Nueva
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
