export class User {
    id?: number
    nome: string
    email: string
    cpf?: string
    senha: string
    bairroId?: number

    constructor(nome: string, email: string, senha: string, cpf?: string, id?: number, bairroId?: number) {
        this.nome = nome
        this.email = email
        this.cpf = cpf
        this.senha = senha
        this.id = id
        this.bairroId = bairroId    
    }
}

export interface LoginResponse {
    mensagem: string
    usuario: User
}