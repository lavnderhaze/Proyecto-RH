"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Users,
  FileText,
  UserPlus,
  UserMinus,
  RefreshCw,
  ArrowRight,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getColaboradores } from "@/lib/api"
import type { Colaborador } from "@/lib/types"

const formatTypes = [
  {
    type: "ALTA",
    label: "Alta de empleado",
    description: "Registrar el ingreso de un nuevo colaborador a la empresa.",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    type: "BAJA",
    label: "Baja de empleado",
    description: "Documentar la salida de un colaborador de la empresa.",
    color: "bg-red-100 text-red-700",
  },
  {
    type: "CAMBIO",
    label: "Cambio",
    description:
      "Registrar cambios de puesto, departamento o salario de un colaborador.",
    color: "bg-amber-100 text-amber-700",
  },
  {
    type: "REQUISICION",
    label: "Requisicion de personal",
    description: "Solicitar la contratacion de personal para una vacante.",
    color: "bg-blue-100 text-blue-700",
  },
]

function StatsLoading() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="size-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-12 mb-1" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function HomePage() {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const activos = colaboradores.filter((c) => c.activo).length
  const inactivos = colaboradores.filter((c) => !c.activo).length

  const stats = [
    {
      title: "Colaboradores",
      description: "Total registrados",
      icon: Users,
      value: colaboradores.length,
    },
    {
      title: "Activos",
      description: "Colaboradores activos",
      icon: UserPlus,
      value: activos,
    },
    {
      title: "Inactivos",
      description: "Colaboradores inactivos",
      icon: UserMinus,
      value: inactivos,
    },
    {
      title: "Formatos",
      description: "Tipos disponibles",
      icon: FileText,
      value: 4,
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            Sistema de Formatos RH
          </h1>
          <p className="text-muted-foreground mt-1">
            Genera y administra formatos de Recursos Humanos para los
            colaboradores de la empresa.
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

      {loading ? (
        <StatsLoading />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold mb-4">Generar formato</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {formatTypes.map((fmt) => (
            <Link key={fmt.type} href={`/formatos?tipo=${fmt.type}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer group h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ${fmt.color}`}
                      >
                        {fmt.type}
                      </span>
                      <CardTitle className="text-base">{fmt.label}</CardTitle>
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {fmt.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
