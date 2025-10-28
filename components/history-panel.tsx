"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { BusEntry } from "@/types/platform"
import { generateMockHistory, calculateStats } from "@/lib/history-data"
import { Clock, DollarSign, Bus, Calendar, Search, TrendingUp } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function HistoryPanel() {
  const [history, setHistory] = useState<BusEntry[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredHistory, setFilteredHistory] = useState<BusEntry[]>([])

  useEffect(() => {
    const data = generateMockHistory()
    setHistory(data)
    setFilteredHistory(data)
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = history.filter(
        (entry) =>
          entry.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.destination.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredHistory(filtered)
    } else {
      setFilteredHistory(history)
    }
  }, [searchTerm, history])

  const stats = calculateStats(history)

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bus className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.totalEntries}</div>
                <p className="text-xs text-muted-foreground">Total Registros</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">S/. {stats.totalRevenue}</div>
                <p className="text-xs text-muted-foreground">Ingresos Totales</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{formatDuration(stats.avgDuration)}</div>
                <p className="text-xs text-muted-foreground">Estadía Promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">S/. {stats.avgCost}</div>
                <p className="text-xs text-muted-foreground">Costo Promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Historial de Estadía</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Registro completo de buses en el terminal</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por empresa, placa o destino..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-80"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Placa</TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead>Andén</TableHead>
                  <TableHead>Entrada</TableHead>
                  <TableHead>Salida</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead className="text-right">Costo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No se encontraron registros
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredHistory.slice(0, 20).map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          {formatDate(entry.entryTime)}
                        </div>
                      </TableCell>
                      <TableCell>{entry.company}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{entry.plateNumber}</Badge>
                      </TableCell>
                      <TableCell>{entry.destination}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">A{entry.platformId.split("-")[1]}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{formatTime(entry.entryTime)}</TableCell>
                      <TableCell className="text-sm">{entry.exitTime ? formatTime(entry.exitTime) : "-"}</TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">
                          {entry.duration ? formatDuration(entry.duration) : "-"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-green-600">S/. {entry.cost || 0}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {filteredHistory.length > 20 && (
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm">
                Cargar más registros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
