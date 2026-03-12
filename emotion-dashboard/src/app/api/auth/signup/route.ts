import { NextRequest, NextResponse } from 'next/server'
import { getUsers, saveUsers, hashPassword, createToken } from '@/lib/auth-helpers'

export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json()

        if (!name || !email || !password) {
            return NextResponse.json(
                { success: false, error: 'Name, email, and password are required' },
                { status: 400 }
            )
        }

        const users = getUsers()

        // Check for duplicate email
        if (users.find((u) => u.email === email)) {
            return NextResponse.json(
                { success: false, error: 'Email already registered' },
                { status: 400 }
            )
        }

        // Hash password and create user
        const { hash, salt } = hashPassword(password)
        const newUser = {
            id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
            name,
            email,
            passwordHash: hash,
            salt,
            createdAt: new Date().toISOString(),
        }

        users.push(newUser)
        saveUsers(users)

        const safeUser = { id: newUser.id, name: newUser.name, email: newUser.email }
        const token = createToken(safeUser)

        return NextResponse.json({ success: true, token, user: safeUser })
    } catch (err) {
        console.error('Signup error:', err)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
