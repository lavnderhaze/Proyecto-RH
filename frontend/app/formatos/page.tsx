"use client"

import { useEffect, useState, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import {
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
  UserSearch,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { getColaboradores, crearFormato } from "@/lib/api"
import { TIPOS_FORMATO, createEmptyFormData } from "@/lib/types"
import type { Colaborador, TipoFormato, FormatoFormData } from "@/lib/types"

// ---- Helpers ----
function formatDate(dateStr: string) {
  if (!dateStr) return ""
  const d = dateStr.split("T")[0]
  const [y, m, day] = d.split("-")
  return `${day}/${m}/${y}`
}

function todayISO() {
  const d = new Date()
  return d.toISOString().split("T")[0]
}

// ---- Sub-components for each format type ----

function DatosEmpleadoReadonly({ form }: { form: FormatoFormData }) {
  if (!form.codigo) return null

  return (
    <>
      <Separator />
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Datos del colaborador
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <ReadonlyField label="Apellido paterno" value={form.apellidoPaterno} />
          <ReadonlyField label="Apellido materno" value={form.apellidoMaterno} />
          <ReadonlyField label="Nombre" value={form.nombre} />
          <ReadonlyField label="No. empleado" value={form.codigo} />
          <ReadonlyField label="Fecha de ingreso" value={formatDate(form.fechaIngreso)} />
          <ReadonlyField label="Puesto" value={form.puesto} />
          <ReadonlyField label="Departamento" value={form.departamento} />
        </div>
      </div>
    </>
  )
}

function ReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-muted-foreground text-xs">{label}</Label>
      <div className="h-10 flex items-center rounded-md border border-input bg-muted/50 px-3 text-sm">
        {value || <span className="text-muted-foreground">--</span>}
      </div>
    </div>
  )
}

function CamposCambio({
  form,
  onChange,
}: {
  form: FormatoFormData
  onChange: (field: keyof FormatoFormData, value: string) => void
}) {
  return (
    <>
      <Separator />
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Datos del cambio
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="nuevoPuesto">Nuevo puesto</Label>
            <Input
              id="nuevoPuesto"
              value={form.nuevoPuesto}
              onChange={(e) => onChange("nuevoPuesto", e.target.value)}
              placeholder="Ingresa el nuevo puesto"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="nuevoDepartamento">Nuevo departamento</Label>
            <Input
              id="nuevoDepartamento"
              value={form.nuevoDepartamento}
              onChange={(e) => onChange("nuevoDepartamento", e.target.value)}
              placeholder="Ingresa el nuevo departamento"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="nuevoSalario">Nuevo salario</Label>
            <Input
              id="nuevoSalario"
              value={form.nuevoSalario}
              onChange={(e) => onChange("nuevoSalario", e.target.value)}
              placeholder="Ej. 15000"
              type="number"
            />
          </div>
        </div>
      </div>
    </>
  )
}

function CamposRequisicion({
  form,
  onChange,
}: {
  form: FormatoFormData
  onChange: (field: keyof FormatoFormData, value: string) => void
}) {
  return (
    <>
      <Separator />
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Datos de la requisicion
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="tipoVacante">Tipo de vacante</Label>
            <Select
              value={form.tipoVacante}
              onValueChange={(v) => onChange("tipoVacante", v)}
            >
              <SelectTrigger id="tipoVacante" className="w-full">
                <SelectValue placeholder="Selecciona tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nuevaCreacion">Nueva creacion</SelectItem>
                <SelectItem value="reemplazo">Reemplazo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="duracion">Duracion</Label>
            <Select
              value={form.duracion}
              onValueChange={(v) => onChange("duracion", v)}
            >
              <SelectTrigger id="duracion" className="w-full">
                <SelectValue placeholder="Selecciona duracion" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="permanente">Permanente</SelectItem>
                <SelectItem value="temporal">Temporal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {form.duracion === "temporal" && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="diasTemporal">Dias</Label>
              <Input
                id="diasTemporal"
                type="number"
                min="1"
                value={form.diasTemporal}
                onChange={(e) => onChange("diasTemporal", e.target.value)}
                placeholder="No. de dias"
              />
            </div>
          )}

          {form.tipoVacante === "reemplazo" && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="sustituyeA">Sustituye a</Label>
              <Input
                id="sustituyeA"
                value={form.sustituyeA}
                onChange={(e) => onChange("sustituyeA", e.target.value)}
                placeholder="Nombre del empleado a sustituir"
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="puestoRequisicion">Puesto</Label>
            <Input
              id="puestoRequisicion"
              value={form.puestoRequisicion}
              onChange={(e) => onChange("puestoRequisicion", e.target.value)}
              placeholder="Puesto solicitado"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="departamentoRequisicion">Departamento</Label>
            <Input
              id="departamentoRequisicion"
              value={form.departamentoRequisicion}
              onChange={(e) =>
                onChange("departamentoRequisicion", e.target.value)
              }
              placeholder="Departamento solicitante"
            />
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="causa">Causa</Label>
            <Input
              id="causa"
              value={form.causa}
              onChange={(e) => onChange("causa", e.target.value)}
              placeholder="Causa de la requisicion"
            />
          </div>
        </div>
      </div>
    </>
  )
}

function CamposAlta({
  form,
  onChange,
}: {
  form: FormatoFormData
  onChange: (field: keyof FormatoFormData, value: string) => void
}) {
  return (
    <>
      <Separator />
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Datos de la alta
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              value={form.nombre}
              onChange={(e) => onChange("nombre", e.target.value)}
              placeholder="Ingresa el nombre"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="apellidoPaterno">Apellido paterno</Label>
            <Input
              id="apellidoPaterno"
              value={form.apellidoPaterno}
              onChange={(e) => onChange("apellidoPaterno", e.target.value)}
              placeholder="Ingresa el apellido paterno"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="apellidoMaterno">Apellido materno</Label>
            <Input
              id="apellidoMaterno"
              value={form.apellidoMaterno}
              onChange={(e) => onChange("apellidoMaterno", e.target.value)}
              placeholder="Ingresa el apellido paterno"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="puestoAlta">Puesto</Label>
            <Input
              id="puestoAlta"
              value={form.puestoAlta}
              onChange={(e) => onChange("puestoAlta", e.target.value)}
              placeholder="Ingresa el puesto"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="departamentoAlta">Departamento</Label>
            <Input
              id="departamentoAlta"
              value={form.departamentoAlta}
              onChange={(e) => onChange("departamentoAlta", e.target.value)}
              placeholder="Ingresa el departamento"
            />
          </div>
        </div>
      </div>
    </>
  )
}

// ---- Main form ----

function FormatoFormContent() {
  const searchParams = useSearchParams()
  const tipoFromUrl = searchParams.get("tipo") as TipoFormato | null

  const [colaboradores, setColaboradores] = useState<Colaborador[]>([])
  const [loadingColabs, setLoadingColabs] = useState(true)
  const [errorColabs, setErrorColabs] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState<FormatoFormData>(() => {
    const empty = createEmptyFormData()
    if (tipoFromUrl) empty.tipoFormato = tipoFromUrl
    return empty
  })

  const updateField = useCallback(
    (field: keyof FormatoFormData, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }))
    },
    []
  )

  // When the format type changes, reset the format-specific fields but keep common ones
  function handleFormatChange(value: string) {
    setForm((prev) => ({
      ...createEmptyFormData(),
      colaboradorId: prev.colaboradorId,
      tipoFormato: value,
      fechaEfectividad: prev.fechaEfectividad,
      observaciones: "",
      // Keep employee data if already selected
      nombre: prev.nombre,
      apellidoPaterno: prev.apellidoPaterno,
      apellidoMaterno: prev.apellidoMaterno,
      codigo: prev.codigo,
      fechaIngreso: prev.fechaIngreso,
      puesto: prev.puesto,
      departamento: prev.departamento,
    }))
  }

  // When a collaborator is selected, auto-fill the readonly fields
  function handleColaboradorChange(id: string) {
    const colab = colaboradores.find((c) => c.id.toString() === id)
    if (colab) {
      setForm((prev) => ({
        ...prev,
        colaboradorId: id,
        nombre: colab.nombre,
        apellidoPaterno: colab.apellidoPaterno,
        apellidoMaterno: colab.apellidoMaterno,
        codigo: colab.codigo,
        fechaIngreso: colab.fechaIngreso,
        puesto: colab.puesto,
        departamento: colab.departamento,
      }))
    } else {
      setForm((prev) => ({
        ...prev,
        colaboradorId: id,
        nombre: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        codigo: "",
        fechaIngreso: "",
        puesto: "",
        departamento: "",
      }))
    }
  }

  useEffect(() => {
    async function load() {
      setLoadingColabs(true)
      setErrorColabs(null)
      try {
        const data = await getColaboradores()
        setColaboradores(data)
      } catch (err) {
        setErrorColabs(
          err instanceof Error
            ? err.message
            : "No se pudo cargar la lista de colaboradores"
        )
      } finally {
        setLoadingColabs(false)
      }
    }
    load()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!form.tipoFormato) {
      toast.error("Selecciona un tipo de formato")
      return
    }

    // Requisicion does not require a collaborator
    if (form.tipoFormato !== "REQUISICION" && !form.colaboradorId) {
      toast.error("Selecciona un colaborador")
      return
    }

    if (!form.fechaEfectividad) {
      toast.error("Ingresa la fecha de efectividad")
      return
    }

    setSubmitting(true)
    try {
      await crearFormato({
        colaboradorId: form.colaboradorId
          ? Number(form.colaboradorId)
          : 0,
        tipoFormato: form.tipoFormato,
        fechaEfectividad: form.fechaEfectividad,
        observaciones: form.observaciones.trim(),
      })

      toast.success("Formato generado exitosamente", {
        description: `Formato de ${form.tipoFormato} creado correctamente.`,
        icon: <CheckCircle2 className="size-4" />,
      })

      setForm(createEmptyFormData())
    } catch (err) {
      toast.error("Error al generar el formato", {
        description:
          err instanceof Error ? err.message : "Intenta de nuevo.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const needsEmployee =
    form.tipoFormato === "BAJA" ||
    form.tipoFormato === "CAMBIO"

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-balance">
          Generar Formato
        </h1>
        <p className="text-muted-foreground mt-1">
          Selecciona el tipo de formato. Los campos se ajustan automaticamente.
        </p>
      </div>

      {errorColabs && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <div>
            <p className="font-medium">
              No se pudo cargar la lista de colaboradores
            </p>
            <p className="text-destructive/80">{errorColabs}</p>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="size-5" />
            Formulario de formato
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* -- Row 1: Tipo de formato + Fecha efectividad -- */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="tipo">Tipo de formato</Label>
                <Select
                  value={form.tipoFormato}
                  onValueChange={handleFormatChange}
                >
                  <SelectTrigger id="tipo" className="w-full">
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPOS_FORMATO.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="fechaEfectividad">Fecha de efectividad</Label>
                <Input
                  id="fechaEfectividad"
                  type="date"
                  value={form.fechaEfectividad}
                  onChange={(e) =>
                    updateField("fechaEfectividad", e.target.value)
                  }
                />
              </div>
            </div>

            <ReadonlyField label="Elaborado el" value={formatDate(todayISO())} />

            {/* -- Collaborator select (for ALTA, BAJA, CAMBIO) -- */}
            {form.tipoFormato && needsEmployee && (
              <>
                <Separator />
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="colaborador"
                    className="flex items-center gap-1.5"
                  >
                    <UserSearch className="size-4" />
                    Selecciona colaborador
                  </Label>
                  {loadingColabs ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Select
                      value={form.colaboradorId}
                      onValueChange={handleColaboradorChange}
                    >
                      <SelectTrigger id="colaborador" className="w-full">
                        <SelectValue placeholder="Busca un colaborador" />
                      </SelectTrigger>
                      <SelectContent>
                        {colaboradores.map((c) => (
                          <SelectItem key={c.id} value={c.id.toString()}>
                            <span className="font-mono text-xs text-muted-foreground mr-2">
                              {c.codigo}
                            </span>
                            {`${c.nombre} ${c.apellidoPaterno} ${c.apellidoMaterno}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </>
            )}

            {/* -- Employee readonly data (BAJA, CAMBIO) -- */}
            {form.tipoFormato && needsEmployee && (
              <DatosEmpleadoReadonly form={form} />
            )}

            {/* -- CAMBIO specific fields -- */}
            {form.tipoFormato === "CAMBIO" && (
              <CamposCambio form={form} onChange={updateField} />
            )}

            {/* -- REQUISICION specific fields -- */}
            {form.tipoFormato === "REQUISICION" && (
              <CamposRequisicion form={form} onChange={updateField} />
            )}

            {/* -- ALTA specific fields -- */}
            {form.tipoFormato === "ALTA" && (
              <CamposAlta form={form} onChange={updateField} />
            )}

            {/* -- Observaciones (always visible when format is selected) -- */}
            {form.tipoFormato && (
              <>
                <Separator />
                <div className="flex flex-col gap-2">
                  <Label htmlFor="observaciones">Observaciones</Label>
                  <Textarea
                    id="observaciones"
                    placeholder="Escribe las observaciones del formato (opcional)"
                    value={form.observaciones}
                    onChange={(e) =>
                      updateField("observaciones", e.target.value)
                    }
                    rows={4}
                  />
                </div>
              </>
            )}

            {/* -- Submit -- */}
            {form.tipoFormato && (
              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={submitting || loadingColabs}
                  className="w-full sm:w-auto"
                >
                  {submitting && (
                    <Loader2 className="size-4 mr-2 animate-spin" />
                  )}
                  Generar Formato
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function FormatosPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      }
    >
      <FormatoFormContent />
    </Suspense>
  )
}
