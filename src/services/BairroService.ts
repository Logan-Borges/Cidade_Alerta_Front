import { BaseService } from "./BaseService"
import { Bairro } from "../models/Bairro"

export class BairroService extends BaseService {
    async getBairros(): Promise<Bairro[]> {
        return this.get<Bairro[]>("/bairros")
    }
}