import { BaseService } from "./BaseService"

export interface CreateOccurrenceDTO {
    titulo: string
    descricao: string
    tipo: string | null
    urgencia: string | null
    status: string | null
    usuarioId?: number
    bairroId: number
    fotoBase64: string | null
    cep?: string | null
    rua?: string | null
    bairroNome?: string | null
    lat?: number | null
    lng?: number | null
}

export class OccurrenceService extends BaseService {
    async createOccurrence(data: CreateOccurrenceDTO): Promise<CreateOccurrenceDTO> {
        return this.post<CreateOccurrenceDTO, CreateOccurrenceDTO>("/ocorrencias", data)
    }

    async updateOccurrence(id: number, data: CreateOccurrenceDTO): Promise<CreateOccurrenceDTO> {
        return this.put<CreateOccurrenceDTO, CreateOccurrenceDTO>(`/ocorrencias/${id}`, data)
    }

    async deleteOccurrence(id: number): Promise<void> {
        return this.delete(`/ocorrencias/${id}`)
    }

    async getOccurrences<T = any>(filters?: Record<string, string>): Promise<T> {
        const query = new URLSearchParams()

        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && String(value).trim() !== "") {
                    query.append("filter", `${key}=${value}`)
                }
            })
        }

        const path = query.toString() ? `/ocorrencias?${query.toString()}` : "/ocorrencias"
        return this.get<T>(path)
    }

    async toggleUrgencia(ocorrenciaId: number): Promise<any> {
        return this.post<{ ocorrencia: number }, any>("/urgencia", { ocorrencia: ocorrenciaId })
    }

    async getUrgencias<T = number[]>(): Promise<T> {
        return this.get<T>("/urgencia")
    }

    // ── T46: Atualizar status (ADM) ───────────────────────────────────────────
    async updateStatus(id: number, status: string): Promise<CreateOccurrenceDTO> {
        return this.patch<{ status: string }, CreateOccurrenceDTO>(
            `/ocorrencias/${id}/status`,
            { status }
        )
    }
}
