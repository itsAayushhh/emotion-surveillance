import { NextRequest, NextResponse } from 'next/server'
import { getUsers, hashPassword, createToken } from '@/lib/auth-helpers'

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: 'Email and password are required' },
                { status: 400 }
            )
        }

        const users = getUsers()
        const user = users.find((u) => u.email === email)

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Invalid email or password' },
                { status: 401 }
            )
        }

        // Verify password
        const { hash } = hashPassword(password, user.salt)
        if (hash !== user.passwordHash) {
            return NextResponse.json(
                { success: false, error: 'Invalid email or password' },
                { status: 401 }
            )
        }

        const safeUser = { id: user.id, name: user.name, email: user.email }
        const token = createToken(safeUser)

        return NextResponse.json({ success: true, token, user: safeUser })
    } catch (err) {
        console.error('Login error:', err)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
