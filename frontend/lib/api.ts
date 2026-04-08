import type {
  Colaborador,
  CrearFormatoRequest,
  FormatoGenerado,
} from "./types"

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:7076"

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Error desconocido")
    throw new Error(
      `Error ${res.status}: ${errorText || res.statusText}`
    )
  }

  return res.json() as Promise<T>
}

export async function getColaboradores(): Promise<Colaborador[]> {
  return fetchApi<Colaborador[]>("/api/colaboradores")
}

export async function crearFormato(
  data: CrearFormatoRequest
): Promise<FormatoGenerado> {
  return fetchApi<FormatoGenerado>("/api/formatos", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function eliminarColaborador(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/colaboradores/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Error desconocido")
    throw new Error(
      `Error ${res.status}: ${errorText || res.statusText}`
    )
  }
}