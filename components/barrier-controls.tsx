"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Barrier } from "@/types/barrier";
import { generateMockBarriers } from "@/lib/barrier-data";
import { useAuth } from "@/contexts/auth-context";
import {
  DoorOpen,
  DoorClosed,
  AlertTriangle,
  Clock,
  User,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export function BarrierControls() {
  const [barriers, setBarriers] = useState<Barrier[]>([]);
  const [selectedBarrier, setSelectedBarrier] = useState<Barrier | null>(null);
  const [actionType, setActionType] = useState<"open" | "close" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    setBarriers(generateMockBarriers());
  }, []);

  const handleBarrierAction = async (
    barrier: Barrier,
    action: "open" | "close"
  ) => {
    setSelectedBarrier(barrier);
    setActionType(action);
  };

  const confirmAction = async () => {
    if (!selectedBarrier || !actionType || !user) return;

    setIsLoading(true);

    try {
      const response = await fetch(`/api/barriers/${selectedBarrier.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: actionType, user: user.name }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setBarriers((prev) =>
          prev.map((b) =>
            b.id === selectedBarrier.id
              ? {
                  ...b,
                  status: actionType === "open" ? "abierta" : "cerrada",
                  lastAction: {
                    type: actionType,
                    timestamp: new Date(),
                    user: user.name,
                  },
                }
              : b
          )
        );

        toast({
          title: "Comando enviado",
          description: `Barrera ${
            actionType === "open" ? "abierta" : "cerrada"
          } exitosamente`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo controlar la barrera",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setSelectedBarrier(null);
      setActionType(null);
    }
  };

  const statusConfig = {
    abierta: {
      icon: DoorOpen,
      color: "text-green-400",
      bg: "bg-card border-green-700",
      badge: "bg-green-700 text-green-100",
      label: "Abierta",
    },
    cerrada: {
      icon: DoorClosed,
      color: "text-gray-300",
      bg: "bg-card border-gray-600",
      badge: "bg-gray-600 text-gray-100",
      label: "Cerrada",
    },
    error: {
      icon: AlertTriangle,
      color: "text-red-400",
      bg: "bg-card border-red-700",
      badge: "bg-red-700 text-red-100",
      label: "Error",
    },
  };

  return (
    <>
      <Card className="animate-slide-in-up">
        <CardHeader>
          <CardTitle className="text-primary">
            Control Manual de Barreras
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Gestión de accesos del terminal
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {barriers.map((barrier) => {
              const config = statusConfig[barrier.status];
              const StatusIcon = config.icon;

              return (
                <div
                  key={barrier.id}
                  className={cn(
                    "border-2 rounded-lg p-4 hover-lift transition-smooth",
                    config.bg
                  )}
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm mb-1">
                          {barrier.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {barrier.location}
                        </div>
                      </div>
                      <StatusIcon
                        className={cn("w-6 h-6 hover-scale", config.color)}
                      />
                    </div>

                    {/* Status Badge */}
                    <Badge
                      variant="secondary"
                      className={cn("w-full justify-center", config.badge)}
                    >
                      {config.label}
                    </Badge>

                    {/* Last Action */}
                    {barrier.lastAction && (
                      <div className="text-xs space-y-1 pt-2 border-t">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>
                            {new Date(
                              barrier.lastAction.timestamp
                            ).toLocaleTimeString("es-PE", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <User className="w-3 h-3" />
                          <span>{barrier.lastAction.user}</span>
                        </div>
                      </div>
                    )}

                    {/* Control Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 hover:bg-primary hover:text-primary-foreground transition-smooth bg-transparent cursor-pointer"
                        onClick={() => handleBarrierAction(barrier, "open")}
                        disabled={
                          barrier.status === "abierta" ||
                          barrier.status === "error"
                        }
                      >
                        <DoorOpen className="w-4 h-4 mr-1" />
                        Abrir
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 hover:bg-secondary hover:text-secondary-foreground transition-smooth bg-transparent cursor-pointer"
                        onClick={() => handleBarrierAction(barrier, "close")}
                        disabled={
                          barrier.status === "cerrada" ||
                          barrier.status === "error"
                        }
                      >
                        <DoorClosed className="w-4 h-4 mr-1" />
                        Cerrar
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        open={!!selectedBarrier}
        onOpenChange={(open) => {
          if (isLoading) return;
          if (!open) setSelectedBarrier(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Acción</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro que desea{" "}
              {actionType === "open" ? "abrir" : "cerrar"} la barrera{" "}
              <strong>{selectedBarrier?.name}</strong>?
              <br />
              <br />
              Esta acción se registrará en el historial del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isLoading}
              className="cursor-pointer disabled:cursor-not-allowed"
            >
              Cancelar
            </AlertDialogCancel>
            <Button
              onClick={confirmAction}
              disabled={isLoading}
              className="cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? "Enviando comando..." : "Confirmar"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
