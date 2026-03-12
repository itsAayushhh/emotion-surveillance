/**
 * Auth helpers for Next.js API routes.
 * Uses a JSON file for user storage and simple token-based auth.
 */

import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const DB_PATH = path.join(process.cwd(), 'data', 'users.json')
const SECRET_KEY = 'fer2013-emotion-dashboard-secret-key-2024'
const TOKEN_EXPIRY_HOURS = 24

export interface StoredUser {
    id: number
    name: string
    email: string
    passwordHash: string
    salt: string
    createdAt: string
}

export interface SafeUser {
    id: number
    name: string
    email: string
}

// ============ User Storage ============

function ensureDataDir() {
    const dir = path.dirname(DB_PATH)
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify([]))
    }
}

export function getUsers(): StoredUser[] {
    ensureDataDir()
    const raw = fs.readFileSync(DB_PATH, 'utf-8')
    return JSON.parse(raw)
}

export function saveUsers(users: StoredUser[]) {
    ensureDataDir()
    fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2))
}

// ============ Password Hashing ============

export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
    const s = salt || crypto.randomBytes(16).toString('hex')
    const hash = crypto.pbkdf2Sync(password, s, 100000, 32, 'sha256').toString('hex')
    return { hash, salt: s }
}

// ============ Token Management ============

export function createToken(user: SafeUser): string {
    const payload = {
        user_id: user.id,
        email: user.email,
        name: user.name,
        exp: Date.now() + TOKEN_EXPIRY_HOURS * 3600 * 1000,
    }
    const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url')
    const signature = crypto
        .createHash('sha256')
        .update(SECRET_KEY + payloadB64)
        .digest('hex')
    return `${payloadB64}.${signature}`
}

export function verifyToken(token: string): SafeUser | null {
    try {
        const parts = token.split('.')
        if (parts.length !== 2) return null

        const [payloadB64, signature] = parts
        const expectedSig = crypto
            .createHash('sha256')
            .update(SECRET_KEY + payloadB64)
            .digest('hex')

        if (signature !== expectedSig) return null

        const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString())

        if (payload.exp < Date.now()) return null

        return {
            id: payload.user_id,
            name: payload.name,
            email: payload.email,
        }
    } catch {
        return null
    }
}
