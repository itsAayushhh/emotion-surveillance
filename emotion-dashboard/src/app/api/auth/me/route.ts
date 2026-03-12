import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth-helpers'

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get('authorization')

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { success: false, error: 'Not authenticated' },
                { status: 401 }
            )
        }

        const token = authHeader.split(' ')[1]
        const user = verifyToken(token)

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Invalid or expired token' },
                { status: 401 }
            )
        }

        return NextResponse.json({ success: true, user })
    } catch (err) {
        console.error('Auth verify error:', err)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
