const API_BASE_URL = "http://localhost:8080"

export class BaseService {
    private getHeaders(): HeadersInit {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        }
        
        const token = localStorage.getItem('token')
        if (token) {
            headers["Authorization"] = `Bearer ${token}`
        }
        
        return headers
    }

    protected async post<TBody, TResponse>(path: string, data: TBody): Promise<TResponse> {
        const response = await fetch(`${API_BASE_URL}${path}`, {
            method: "POST",
            headers: this.getHeaders(),
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
            headers: this.getHeaders(),
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Erro ${response.status}: ${errorText}`)
        }

        return response.json() as Promise<TResponse>
    }

    protected async put<TBody, TResponse>(path: string, data: TBody): Promise<TResponse> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erro ${response.status}: ${errorText}`)
    }

    return response.json() as Promise<TResponse>
}
}