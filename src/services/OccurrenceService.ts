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
}

export class OccurrenceService extends BaseService {
    async createOccurrence(data: CreateOccurrenceDTO): Promise<CreateOccurrenceDTO> {
        return this.post<CreateOccurrenceDTO, CreateOccurrenceDTO>("/ocorrencias", data)
    }

    async getOccurrences<T = any>(): Promise<T> {
        return this.get<T>("/ocorrencias")
    }

    async toggleUrgencia(ocorrenciaId: number): Promise<any> {
        return this.post<{ ocorrencia: number }, any>("/urgencia", { ocorrencia: ocorrenciaId })
    }
}
