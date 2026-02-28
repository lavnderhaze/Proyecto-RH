export interface Colaborador {
  id: number
  codigo: string
  nombre: string
  apellidoPaterno: string
  apellidoMaterno: string
  fechaIngreso: string
  departamento: string
  puesto: string
  activo: boolean
}

export interface FormatoGenerado {
  id: number
  colaboradorId: number
  tipoFormato: string
  fechaEfectividad: string
  observaciones: string
}

export interface CrearFormatoRequest {
  colaboradorId: number
  tipoFormato: string
  fechaEfectividad: string
  observaciones: string
}

export const TIPOS_FORMATO = [
  { value: "ALTA", label: "Alta" },
  { value: "BAJA", label: "Baja" },
  { value: "CAMBIO", label: "Cambio" },
  { value: "REQUISICION", label: "Requisicion" },
] as const

export type TipoFormato = "ALTA" | "BAJA" | "CAMBIO" | "REQUISICION"

// Campos extra para el formulario de cada formato (para generacion de Excel)
export interface FormatoFormData {
  // Comunes
  colaboradorId: string
  tipoFormato: string
  fechaEfectividad: string
  observaciones: string

  // Datos del empleado (auto-llenados, readonly)
  nombre: string
  apellidoPaterno: string
  apellidoMaterno: string
  codigo: string
  fechaIngreso: string
  puesto: string
  departamento: string

  // Cambio
  nuevoPuesto: string
  nuevoDepartamento: string
  nuevoSalario: string

  // Requisicion
  tipoVacante: string // "nuevaCreacion" | "reemplazo"
  duracion: string // "permanente" | "temporal"
  diasTemporal: string
  sustituyeA: string
  causa: string
  puestoRequisicion: string
  departamentoRequisicion: string

  // Alta
  departamentoAlta: string
  puestoAlta: string
}

export function createEmptyFormData(): FormatoFormData {
  return {
    colaboradorId: "",
    tipoFormato: "",
    fechaEfectividad: "",
    observaciones: "",
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    codigo: "",
    fechaIngreso: "",
    puesto: "",
    departamento: "",
    nuevoPuesto: "",
    nuevoDepartamento: "",
    nuevoSalario: "",
    tipoVacante: "",
    duracion: "",
    diasTemporal: "",
    sustituyeA: "",
    causa: "",
    puestoRequisicion: "",
    departamentoRequisicion: "",
    departamentoAlta: "",
    puestoAlta: ""
  }
}
