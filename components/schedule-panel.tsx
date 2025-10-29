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
      color: "text-green-400",
      bg: "bg-green-900/30 text-white border border-green-800",
      badge: "bg-green-800/60 text-green-200 border border-green-700",
      label: "A Tiempo",
    },
    retrasado: {
      icon: AlertCircle,
      color: "text-amber-400",
      bg: "bg-amber-900/30 text-white border border-amber-800",
      badge: "bg-amber-800/60 text-amber-200 border border-amber-700",
      label: "Retrasado",
    },
    cancelado: {
      icon: XCircle,
      color: "text-red-400",
      bg: "bg-red-900/30 text-white border border-red-800",
      badge: "bg-red-800/60 text-red-200 border border-red-700",
      label: "Cancelado",
    },
    completado: {
      icon: CheckCircle,
      color: "text-gray-400",
      bg: "bg-gray-800/40 text-gray-200 border border-gray-700",
      badge: "bg-gray-700/60 text-gray-300 border border-gray-600",
      label: "Completado",
    },
  };

  const config = statusConfig[schedule.status];
  const StatusIcon = config.icon;

  const formatTime = (date: Date) =>
    new Date(date).toLocaleTimeString("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
    });

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
        "rounded-lg p-4 transition-all duration-300 hover:bg-white/10",
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
                className="font-semibold border border-primary text-primary"
              >
                {schedule.company}
              </Badge>
              <Badge variant="secondary" className={config.badge}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {config.label}
              </Badge>
            </div>
            <span className="text-sm text-gray-400">
              {schedule.plateNumber}
            </span>
          </div>

          {/* Route */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
            <div className="flex items-center gap-2 flex-1">
              <span className="font-medium text-white">
                {schedule.origin || schedule.route.split(" - ")[0]}
              </span>
              <ArrowRight className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-white">
                {schedule.destination || schedule.route.split(" - ")[1]}
              </span>
            </div>
          </div>

          {/* Time Info */}
          <div className="flex items-center gap-6 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400">Programado:</span>
              <span className="font-semibold text-white">
                {formatTime(schedule.scheduledTime)}
              </span>
            </div>

            {schedule.actualTime && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Real:</span>
                <span className={cn("font-semibold", config.color)}>
                  {formatTime(schedule.actualTime)}
                </span>
              </div>
            )}

            {schedule.status === "a-tiempo" && (
              <Badge
                variant="secondary"
                className="text-xs bg-primary/30 text-white"
              >
                {getTimeUntil(schedule.scheduledTime)}
              </Badge>
            )}
          </div>

          {/* Platform/Gate Info */}
          <div className="flex items-center gap-4 text-sm text-gray-300">
            {schedule.platformNumber && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Andén:</span>
                <Badge
                  variant="outline"
                  className="font-bold bg-primary text-primary-foreground border-0"
                >
                  A{schedule.platformNumber}
                </Badge>
              </div>
            )}
            {schedule.gate && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400">{schedule.gate}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
