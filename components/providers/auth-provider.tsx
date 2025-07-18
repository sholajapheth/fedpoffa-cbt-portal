"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export type UserRole = "student" | "lecturer" | "admin" | "it_admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  studentId?: string
  staffId?: string
  department?: string
  program?: string
  level?: string
}

interface AuthContextType {
  user: User | null
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  loading: boolean
}

interface LoginCredentials {
  identifier: string // student ID or email
  password: string
  rememberMe?: boolean
}

interface RegisterData {
  fullName: string
  studentId: string
  email: string
  password: string
  confirmPassword: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem("fedpoffa_token")
    const userData = localStorage.getItem("fedpoffa_user")

    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        localStorage.removeItem("fedpoffa_token")
        localStorage.removeItem("fedpoffa_user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (credentials: LoginCredentials) => {
    setLoading(true)
    try {
      // Mock API call - replace with actual FastAPI integration
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data based on identifier
      const mockUser: User = credentials.identifier.includes("@")
        ? {
            id: "2",
            name: "Dr. Sarah Johnson",
            email: credentials.identifier,
            role: "lecturer",
            staffId: "FEDPOFFA/STAFF/001",
            department: "Petroleum Engineering",
          }
        : {
            id: "1",
            name: "John Doe",
            email: "john.doe@student.fedpoffa.edu.ng",
            role: "student",
            studentId: credentials.identifier,
            department: "Petroleum Engineering",
            program: "HND Petroleum Engineering",
            level: "200",
          }

      const token = "mock_jwt_token_" + Date.now()

      localStorage.setItem("fedpoffa_token", token)
      localStorage.setItem("fedpoffa_user", JSON.stringify(mockUser))

      setUser(mockUser)

      // Redirect based on role
      if (mockUser.role === "student") {
        router.push("/dashboard/student")
      } else if (mockUser.role === "lecturer") {
        router.push("/dashboard/lecturer")
      } else {
        router.push("/dashboard/admin")
      }
    } catch (error) {
      throw new Error("Invalid credentials")
    } finally {
      setLoading(false)
    }
  }

  const register = async (data: RegisterData) => {
    setLoading(true)
    try {
      // Mock API call - replace with actual FastAPI integration
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (data.password !== data.confirmPassword) {
        throw new Error("Passwords do not match")
      }

      // Mock successful registration
      const mockUser: User = {
        id: Date.now().toString(),
        name: data.fullName,
        email: data.email,
        role: "student",
        studentId: data.studentId,
        department: "Petroleum Engineering",
        program: "HND Petroleum Engineering",
        level: "100",
      }

      const token = "mock_jwt_token_" + Date.now()

      localStorage.setItem("fedpoffa_token", token)
      localStorage.setItem("fedpoffa_user", JSON.stringify(mockUser))

      setUser(mockUser)
      router.push("/dashboard/student")
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("fedpoffa_token")
    localStorage.removeItem("fedpoffa_user")
    setUser(null)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
