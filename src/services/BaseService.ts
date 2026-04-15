// Se REACT_APP_API_URL estiver definido, usa-o (produção); caso contrário usa string vazia
// para permitir que o dev server (setupProxy.js) encaminhe requisições.
const API_BASE_URL = process.env.REACT_APP_API_URL ?? ""

export class BaseService {
    protected async post<TBody, TResponse>(path: string, data: TBody): Promise<TResponse> {
        const response = await fetch(`${API_BASE_URL}${path}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Erro ${response.status}: ${errorText}`)
        }

        return response.json() as Promise<TResponse>
    }
    protected async get<TResponse>(path: string): Promise<TResponse> {
        const response = await fetch(`${API_BASE_URL}${path}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Erro ${response.status}: ${errorText}`)
        }

        return response.json() as Promise<TResponse>
    }
}
