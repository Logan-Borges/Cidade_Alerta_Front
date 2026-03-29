export class User {
    id?: number
    nome: string
    email: string
    cpf?: string
    senha: string

    constructor(nome: string, email: string, senha: string, cpf?: string, id?: number) {
        this.nome = nome
        this.email = email
        this.cpf = cpf
        this.senha = senha
        this.id = id
    }
}
