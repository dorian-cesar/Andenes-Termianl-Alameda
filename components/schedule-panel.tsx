"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BusSchedule } from "@/types/schedule";
import { generateMockSchedule } from "@/lib/schedule-data";
import {
  ArrowRight,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function SchedulePanel() {
  const [schedules, setSchedules] = useState<BusSchedule[]>([]);

  useEffect(() => {
    // Initial load - simulates Kupos API call
    setSchedules(generateMockSchedule());

    // Simulate real-time updates every 30 seconds
    const interval = setInterval(() => {
      setSchedules(generateMockSchedule());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const departures = schedules.filter(
    (s) => s.type === "salida" && s.status !== "completado"
  );
  const arrivals = schedules.filter(
    (s) => s.type === "llegada" && s.status !== "completado"
  );

  return (
    <Card className="animate-scale-in">
      <CardHeader>
        <CardTitle className="text-primary">
          Próximas Salidas y Llegadas
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Datos sincronizados con Kupos API
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="salidas" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="salidas"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Salidas ({departures.length})
            </TabsTrigger>
            <TabsTrigger
              value="llegadas"
              className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
            >
              Llegadas ({arrivals.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="salidas" className="space-y-3 mt-4">
            {departures.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No hay salidas programadas
              </p>
            ) : (
              departures.map((schedule) => (
                <ScheduleCard key={schedule.id} schedule={schedule} />
              ))
            )}
          </TabsContent>

          <TabsContent value="llegadas" className="space-y-3 mt-4">
            {arrivals.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No hay llegadas programadas
              </p>
            ) : (
              arrivals.map((schedule) => (
                <ScheduleCard key={schedule.id} schedule={schedule} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function ScheduleCard({ schedule }: { schedule: BusSchedule }) {
  const statusConfig = {
    "a-tiempo": {
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50 text-black",
      badge: "bg-green-100 text-green-700",
      label: "A Tiempo",
    },
    retrasado: {
      icon: AlertCircle,
      color: "text-amber-600",
      bg: "bg-amber-50 text-black",
      badge: "bg-amber-100 text-amber-700",
      label: "Retrasado",
    },
    cancelado: {
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50 text-black",
      badge: "bg-red-100 text-red-700",
      label: "Cancelado",
    },
    completado: {
      icon: CheckCircle,
      color: "text-gray-600",
      bg: "bg-gray-50 text-black",
      badge: "bg-gray-100 text-gray-700",
      label: "Completado",
    },
  };

  const config = statusConfig[schedule.status];
  const StatusIcon = config.icon;

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeUntil = (date: Date) => {
    const now = new Date();
    const diff = new Date(date).getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) return `En ${hours}h ${minutes}m`;
    if (minutes > 0) return `En ${minutes}m`;
    return "Ahora";
  };

  return (
    <div
      className={cn(
        "border rounded-lg p-4 hover-lift transition-smooth",
        config.bg
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="font-semibold border-primary text-primary"
              >
                {schedule.company}
              </Badge>
              <Badge variant="secondary" className={config.badge}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {config.label}
              </Badge>
            </div>
            <span className="text-sm text-muted-foreground">
              {schedule.plateNumber}
            </span>
          </div>

          {/* Route */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
            <div className="flex items-center gap-2 flex-1">
              <span className="font-medium">
                {schedule.origin || schedule.route.split(" - ")[0]}
              </span>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">
                {schedule.destination || schedule.route.split(" - ")[1]}
              </span>
            </div>
          </div>

          {/* Time Info */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Programado:</span>
              <span className="font-semibold">
                {formatTime(schedule.scheduledTime)}
              </span>
            </div>

            {schedule.actualTime && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Real:</span>
                <span className={cn("font-semibold", config.color)}>
                  {formatTime(schedule.actualTime)}
                </span>
              </div>
            )}

            {schedule.status === "a-tiempo" && (
              <Badge variant="secondary" className="text-xs">
                {getTimeUntil(schedule.scheduledTime)}
              </Badge>
            )}
          </div>

          {/* Platform/Gate Info */}
          <div className="flex items-center gap-4 text-sm">
            {schedule.platformNumber && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Andén:</span>
                <Badge
                  variant="outline"
                  className="font-bold bg-primary text-primary-foreground"
                >
                  A{schedule.platformNumber}
                </Badge>
              </div>
            )}
            {schedule.gate && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{schedule.gate}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
