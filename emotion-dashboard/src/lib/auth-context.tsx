'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const API_URL = ''

interface User {
    id: number
    name: string
    email: string
}

interface AuthContextType {
    user: User | null
    token: string | null
    isLoading: boolean
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
    signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Check for existing token on mount
    useEffect(() => {
        const savedToken = localStorage.getItem('auth_token')
        if (savedToken) {
            // Verify token
            fetch(`${API_URL}/api/auth/me`, {
                headers: { Authorization: `Bearer ${savedToken}` }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.user) {
                        setUser(data.user)
                        setToken(savedToken)
                    } else {
                        localStorage.removeItem('auth_token')
                    }
                })
                .catch(() => localStorage.removeItem('auth_token'))
                .finally(() => setIsLoading(false))
        } else {
            setIsLoading(false)
        }
    }, [])

    const login = useCallback(async (email: string, password: string) => {
        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })
            const data = await res.json()
            if (data.success) {
                setUser(data.user)
                setToken(data.token)
                localStorage.setItem('auth_token', data.token)
                return { success: true }
            }
            return { success: false, error: data.error || 'Login failed' }
        } catch {
            return { success: false, error: 'Cannot connect to server' }
        }
    }, [])

    const signup = useCallback(async (name: string, email: string, password: string) => {
        try {
            const res = await fetch(`${API_URL}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            })
            const data = await res.json()
            if (data.success) {
                setUser(data.user)
                setToken(data.token)
                localStorage.setItem('auth_token', data.token)
                return { success: true }
            }
            return { success: false, error: data.error || 'Signup failed' }
        } catch {
            return { success: false, error: 'Cannot connect to server' }
        }
    }, [])

    const logout = useCallback(() => {
        setUser(null)
        setToken(null)
        localStorage.removeItem('auth_token')
    }, [])

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}
