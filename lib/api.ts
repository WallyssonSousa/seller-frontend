const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token")
    }
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("auth_token", token)
      } else {
        localStorage.removeItem("auth_token")
      }
    }
  }

  getToken() {
    return this.token
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          error: data.message || data.error || "An error occurred",
        }
      }

      return { data }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Network error",
      }
    }
  }


  async register(payload: {
    name: string
    cnpj: string
    email: string
    celular: string
    password: string
  }) {
    return this.request("/auth/users", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  async verify(payload: { celular: string; code: string }) {
    return this.request("/auth/users/verificar", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  async login(payload: { email: string; password: string }) {
    const response = await this.request<{ token?: string; access_token?: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    const token = response.data?.token ?? response.data?.access_token
    if (token) {
      this.setToken(token)
    }

    return response
  }


  async logout() {
    this.setToken(null)
  }


  async getSellers() {
    return this.request("/auth/users", { method: "GET" })
  }

  async getSeller(id: number) {
    return this.request(`/auth/users/${id}/`, { method: "GET" })
  }

  async updateSeller(
    id: number,
    payload: {
      name?: string
      cnpj?: string
      email?: string
      celular?: string
      password?: string
    },
  ) {
    return this.request(`/auth/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    })
  }


  async getProducts() {
    return this.request("/product/", { method: "GET" })
  }

  async getProduct(id: number) {
    return this.request(`/product/${id}/`, { method: "GET" })
  }

  async createProduct(payload: {
    nome: string
    preco: number
    quantidade: number
    status: string
    image?: string
  }) {
    return this.request("/product/", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  async updateProduct(
    id: number,
    payload: {
      nome?: string
      preco?: number
      quantidade?: number
      status?: string
      image?: string
    },
  ) {
    return this.request(`/product/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    })
  }

  async inactivateProduct(id: number) {
    return this.request(`/product/${id}/inactivate/`, {
      method: "PATCH",
    })
  }


  async getSales() {
    return this.request("/sale/", { method: "GET" })
  }

  async getSale(id: number) {
    return this.request(`/sale/${id}/`, { method: "GET" })
  }

  async createSale(payload: { product_id: number; quantity: number }) {
    return this.request("/sale/", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  async inactivateSale(id: number){
    return this.request(`/sale/${id}/inactivate`, {
      method: "PATCH"
    })
  }
}

export const api = new ApiClient(API_BASE_URL)
