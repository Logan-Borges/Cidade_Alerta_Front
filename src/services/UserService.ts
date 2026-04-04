import { BaseService } from "./BaseService"
import { User, LoginResponse } from "../models/User"

export interface LoginDTO {
    email: string
    senha: string
}

export class UserService extends BaseService {
    async createUser(user: User): Promise<User> {
        return this.post<User, User>("/usuarios", user)
    }

    async login(dados: LoginDTO): Promise<LoginResponse> {
        return this.post<LoginDTO, LoginResponse>("/usuarios/login", dados)
    }
}