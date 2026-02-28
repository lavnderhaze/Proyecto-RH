"use client"

import { useEffect, useState, useMemo } from "react"
import { Search, RefreshCw, AlertCircle, Users } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { getColaboradores } from "@/lib/api"
import type { Colaborador } from "@/lib/types"

function TableLoading() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Users className="size-12 text-muted-foreground/40 mb-4" />
      <h3 className="text-lg font-medium text-foreground">
        Sin resultados
      </h3>
      <p className="text-sm text-muted-foreground mt-1">
        No se encontraron colaboradores con ese criterio de busqueda.
      </p>
    </div>
  )
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  } catch {
    return dateStr
  }
}

export default function ColaboradoresPage() {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  async function fetchData() {
    setLoading(true)
    setError(null)
    try {
      const data = await getColaboradores()
      setColaboradores(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo conectar con la API"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return colaboradores
    const term = search.toLowerCase()
    return colaboradores.filter(
      (c) =>
        c.codigo.toLowerCase().includes(term) ||
        c.nombre.toLowerCase().includes(term) ||
        c.apellidoPaterno.toLowerCase().includes(term) ||
        c.apellidoMaterno.toLowerCase().includes(term) ||
        c.departamento.toLowerCase().includes(term) ||
        c.puesto.toLowerCase().includes(term)
    )
  }, [colaboradores, search])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Colaboradores
          </h1>
          <p className="text-muted-foreground mt-1">
            Directorio de colaboradores registrados en el sistema.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchData}
          disabled={loading}
        >
          <RefreshCw
            className={`size-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Actualizar
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <div>
            <p className="font-medium">No se pudo conectar con la API</p>
            <p className="text-destructive/80">{error}</p>
          </div>
        </div>
      )}

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-base shrink-0">
              {loading
                ? "Cargando..."
                : `${filtered.length} de ${colaboradores.length} colaboradores`}
            </CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por codigo, nombre, depto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <TableLoading />
          ) : filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="rounded-md border overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-28">Codigo</TableHead>
                    <TableHead>Nombre completo</TableHead>
                    <TableHead>Fecha ingreso</TableHead>
                    <TableHead>Departamento</TableHead>
                    <TableHead>Puesto</TableHead>
                    <TableHead className="text-center w-24">
                      Estatus
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-mono text-sm">
                        {c.codigo}
                      </TableCell>
                      <TableCell className="font-medium">
                        {`${c.nombre} ${c.apellidoPaterno} ${c.apellidoMaterno}`}
                      </TableCell>
                      <TableCell>{formatDate(c.fechaIngreso)}</TableCell>
                      <TableCell>{c.departamento}</TableCell>
                      <TableCell>{c.puesto}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={c.activo ? "default" : "secondary"}
                          className={
                            c.activo
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                              : "bg-red-100 text-red-700 hover:bg-red-100"
                          }
                        >
                          {c.activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
