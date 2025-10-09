"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { api } from "./api"
import { useRouter } from "next/navigation"

interface User {
  id: number
  name: string
  email: string
  cnpj: string
  celular: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  register: (data: {
    name: string
    cnpj: string
    email: string
    celular: string
    password: string
  }) => Promise<{ success: boolean; error?: string }>
  verify: (celular: string, code: string) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = api.getToken()
    if (token) {
      // In a real app, you'd validate the token and fetch user data
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const response = await api.login({ email, password })

    if (response.error) {
      return { success: false, error: response.error }
    }

    // In a real app, fetch user data after login
    setUser({
      id: 1,
      name: "User",
      email,
      cnpj: "",
      celular: "",
    })

    return { success: true }
  }

  const logout = () => {
    api.logout()
    setUser(null)
    router.push("/login")
  }

  const register = async (data: {
    name: string
    cnpj: string
    email: string
    celular: string
    password: string
  }) => {
    const response = await api.register(data)

    if (response.error) {
      return { success: false, error: response.error }
    }

    return { success: true }
  }

  const verify = async (celular: string, code: string) => {
    const response = await api.verify({ celular, code })

    if (response.error) {
      return { success: false, error: response.error }
    }

    return { success: true }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register, verify }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
