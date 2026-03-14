"use client"

import axios from "axios"
import { useRouter } from "next/navigation"
import { createContext, useContext, useState, type ReactNode } from "react"
import jwt from "jsonwebtoken"

interface AuthContextType {
  token: string | null
  isLoading: boolean
  signIn: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>
  signOut: () => void
  user: { email?: string }
}

const AuthContext = createContext<AuthContextType | null>(null)

const API_URL = process.env.NEXT_PUBLIC_API_URL

function decodeToken(token: string): { email?: string } {
  try {
    return (jwt.decode(token) as { email?: string }) || {}
  } catch {
    return {}
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null
  )
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const user = token ? decodeToken(token) : {}

  const signIn = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true)
      const response = await axios.post(`${API_URL}/signin`, {
        email,
        password,
      })

      if (!response) return { success: false, error: "No response from server" }

      const newToken = response.data.token
      setToken(newToken)
      localStorage.setItem("token", newToken)

      return { success: true }
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message
        : undefined
      return { success: false, error: message || "Sign in failed" }
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = () => {
    setToken(null)
    localStorage.removeItem("token")
    router.push("/signin")
  }

  return (
    <AuthContext.Provider value={{ token, isLoading, signIn, signOut, user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
