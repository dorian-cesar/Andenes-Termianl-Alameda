"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Platform } from "@/types/platform"
import { generateMockPlatforms } from "@/lib/platform-data"
import { Bus, Clock, MapPin, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

export function AforoPanel() {
  const [platforms, setPlatforms] = useState<Platform[]>([])

  useEffect(() => {
    // Initial load
    setPlatforms(generateMockPlatforms())

    // Simulate real-time updates every 10 seconds
    const interval = setInterval(() => {
      setPlatforms(generateMockPlatforms())
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const stats = {
    total: platforms.length,
    occupied: platforms.filter((p) => p.status === "ocupado").length,
    free: platforms.filter((p) => p.status === "libre").length,
    maintenance: platforms.filter((p) => p.status === "mantenimiento").length,
  }

  const occupancyRate = ((stats.occupied / stats.total) * 100).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="animate-slide-in-up hover-lift" style={{ animationDelay: "0ms" }}>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total Andenes</p>
          </CardContent>
        </Card>
        <Card className="animate-slide-in-up hover-lift" style={{ animationDelay: "100ms" }}>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">{stats.occupied}</div>
            <p className="text-xs text-muted-foreground">Ocupados</p>
          </CardContent>
        </Card>
        <Card className="animate-slide-in-up hover-lift" style={{ animationDelay: "200ms" }}>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.free}</div>
            <p className="text-xs text-muted-foreground">Libres</p>
          </CardContent>
        </Card>
        <Card className="animate-slide-in-up hover-lift" style={{ animationDelay: "300ms" }}>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-secondary">{occupancyRate}%</div>
            <p className="text-xs text-muted-foreground">Ocupación</p>
          </CardContent>
        </Card>
      </div>

      {/* Platforms Grid */}
      <Card className="animate-scale-in">
        <CardHeader>
          <CardTitle className="text-primary">Estado de Andenes en Tiempo Real</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {platforms.map((platform) => (
              <PlatformCard key={platform.id} platform={platform} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Occupied Platforms Details */}
      <Card className="animate-slide-in-right">
        <CardHeader>
          <CardTitle className="text-primary">Andenes Ocupados - Detalle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {platforms
              .filter((p) => p.status === "ocupado" && p.bus)
              .map((platform) => (
                <OccupiedPlatformDetail key={platform.id} platform={platform} />
              ))}
            {stats.occupied === 0 && (
              <p className="text-center text-muted-foreground py-8">No hay andenes ocupados actualmente</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PlatformCard({ platform }: { platform: Platform }) {
  const statusConfig = {
    libre: {
      bg: "bg-green-50 border-green-200 hover:border-green-400",
      text: "text-green-700",
      badge: "bg-green-100 text-green-700",
      label: "Libre",
    },
    ocupado: {
      bg: "bg-red-50 border-red-200 hover:border-red-400",
      text: "text-red-700",
      badge: "bg-red-100 text-red-700",
      label: "Ocupado",
    },
    mantenimiento: {
      bg: "bg-amber-50 border-amber-200 hover:border-amber-400",
      text: "text-amber-700",
      badge: "bg-amber-100 text-amber-700",
      label: "Mantenimiento",
    },
  }

  const config = statusConfig[platform.status]

  return (
    <div className={cn("border-2 rounded-lg p-3 cursor-pointer hover-lift transition-smooth", config.bg)}>
      <div className="flex items-center justify-between mb-2">
        <span className={cn("text-lg font-bold", config.text)}>A{platform.number}</span>
        <Badge variant="secondary" className={cn("text-xs", config.badge)}>
          {config.label}
        </Badge>
      </div>
      {platform.bus && (
        <div className="space-y-1">
          <p className="text-xs font-medium truncate">{platform.bus.company}</p>
          <p className="text-xs text-muted-foreground truncate">{platform.bus.destination}</p>
        </div>
      )}
    </div>
  )
}

function OccupiedPlatformDetail({ platform }: { platform: Platform }) {
  if (!platform.bus) return null

  const now = new Date()
  const entryTime = new Date(platform.bus.entryTime)
  const hoursParked = Math.floor((now.getTime() - entryTime.getTime()) / (1000 * 60 * 60))
  const minutesParked = Math.floor(((now.getTime() - entryTime.getTime()) % (1000 * 60 * 60)) / (1000 * 60))

  const isOverstay = hoursParked >= 3

  return (
    <div
      className={cn(
        "border rounded-lg p-4 transition-smooth hover-lift",
        isOverstay && "border-red-300 bg-red-50 animate-pulse-glow",
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="font-bold bg-primary text-primary-foreground">
              Andén {platform.number}
            </Badge>
            <span className="text-sm font-semibold">{platform.bus.company}</span>
            {isOverstay && (
              <Badge variant="destructive" className="text-xs animate-bounce-in">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Exceso de tiempo
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Bus className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Placa:</span>
              <span className="font-medium">{platform.bus.plateNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Destino:</span>
              <span className="font-medium">{platform.bus.destination}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Estadía:</span>
              <span className={cn("font-medium", isOverstay && "text-red-600")}>
                {hoursParked}h {minutesParked}m
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
