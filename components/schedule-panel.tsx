"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, MapPin, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type KuposService = {
  id: number;
  number: string;
  name: string;
  origin_id: number;
  destination_id: number;
  dep_time: string;
  arr_time: string;
  duration: string;
  available_seats: number;
  total_seats: number;
  travel_name: string;
  [key: string]: any;
};

export function SchedulePanel() {
  const [schedules, setSchedules] = useState<KuposService[]>([]);
  const [loading, setLoading] = useState(true);

  const ciudadMap: Record<number, string> = {
    2070: "Viña del Mar",
    2058: "Valparaíso",
    1760: "El Tabo",
    1757: "El Quisco",
    1652: "Algarrobo",
    2007: "San Antonio",
    1643: "Quillota",
    1641: "Limache",
    2063: "Villa Alemana",
    1981: "Quilpué",
    2013: "San Felipe",
    1856: "Los Andes",
    1688: "Cartagena",
    1725: "Concón",
    1904: "Olmué",
    1986: "Rancagua",
    1646: "Santiago",
    1642: "Llay Llay",
  };

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/schedules");
      if (!res.ok) throw new Error("Error en la respuesta");
      const data = await res.json();

      if (data.schedules) {
        setSchedules(data.schedules);
      }
    } catch (err) {
      console.error("Error cargando servicios:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const departures = schedules
    .filter((s) => s.origin_id === 1646)
    .sort((a, b) => a.dep_time.localeCompare(b.dep_time));

  return (
    <Card className="animate-scale-in">
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle className="text-primary">
            Próximas Salidas ({departures.length})
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Datos en tiempo real desde Kupos API
          </p>
        </div>

        <Button
          onClick={fetchSchedules}
          disabled={loading}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          {loading ? "Actualizando..." : "Actualizar"}
        </Button>
      </CardHeader>

      <CardContent>
        {loading ? (
          <p className="text-center text-muted-foreground py-8">
            Cargando servicios de Pullman...
          </p>
        ) : departures.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No hay salidas programadas
          </p>
        ) : (
          <div className="space-y-3 mt-4">
            {departures.map((schedule) => (
              <ScheduleCard
                key={schedule.id}
                schedule={schedule}
                ciudadMap={ciudadMap}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ScheduleCard({
  schedule,
  ciudadMap,
}: {
  schedule: KuposService;
  ciudadMap: Record<number, string>;
}) {
  return (
    <div
      className={cn(
        "rounded-lg p-4 transition-all duration-300 hover:bg-white/10",
        "bg-gray-800/30 border border-orange-500 hover:border-orange-400"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          {/* Cabecera */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="font-semibold border border-primary text-primary"
              >
                {schedule.travel_name}
              </Badge>
            </div>
            <span className="text-sm text-gray-400">{schedule.number}</span>
          </div>

          {/* Origen y destino */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
            <div className="flex items-center gap-2 flex-1">
              <span className="font-medium text-white">
                {ciudadMap[schedule.origin_id]}
              </span>
              <ArrowRight className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-white">
                {ciudadMap[schedule.destination_id]}
              </span>
            </div>
          </div>

          {/* Horarios */}
          <div className="flex items-center gap-6 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400">Salida:</span>
              <span className="font-semibold text-white">
                {schedule.dep_time}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Llegada:</span>
              <span className="font-semibold text-white">
                {schedule.arr_time}
              </span>
            </div>
          </div>

          {/* Duración y asientos */}
          <div className="text-sm text-gray-400">
            Duración: <span className="text-white">{schedule.duration}</span> |{" "}
            Asientos disponibles:{" "}
            <span className="text-white">{schedule.available_seats}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
