'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react'

export default function AuthPage() {
    const { login, signup } = useAuth()
    const [mode, setMode] = useState<'login' | 'signup'>('login')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const cardRef = useRef<HTMLDivElement>(null)

    // 3D tilt effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY })
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    const getCardTransform = () => {
        if (!cardRef.current) return {}
        const card = cardRef.current
        const rect = card.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const rotateY = ((mousePos.x - centerX) / rect.width) * 8
        const rotateX = -((mousePos.y - centerY) / rect.height) * 8
        return {
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsSubmitting(true)

        if (mode === 'signup') {
            if (password !== confirmPassword) {
                setError('Passwords do not match')
                setIsSubmitting(false)
                return
            }
            if (password.length < 6) {
                setError('Password must be at least 6 characters')
                setIsSubmitting(false)
                return
            }
            const result = await signup(name, email, password)
            if (!result.success) setError(result.error || 'Signup failed')
        } else {
            const result = await login(email, password)
            if (!result.success) setError(result.error || 'Login failed')
        }

        setIsSubmitting(false)
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center overflow-hidden"
            style={{ background: 'radial-gradient(ellipse at 50% 50%, #0a0a20 0%, #050511 70%)' }}>

            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 40 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: Math.random() * 4 + 1,
                            height: Math.random() * 4 + 1,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            background: i % 3 === 0 ? '#00f3ff' : i % 3 === 1 ? '#bc13fe' : '#ffffff',
                            opacity: Math.random() * 0.5 + 0.1,
                            animation: `float-particle ${8 + Math.random() * 12}s linear infinite`,
                            animationDelay: `${Math.random() * 8}s`,
                        }}
                    />
                ))}
            </div>

            {/* Glowing orbs */}
            <div className="absolute w-[500px] h-[500px] rounded-full opacity-20"
                style={{
                    background: 'radial-gradient(circle, #00f3ff44, transparent 70%)',
                    left: '10%', top: '20%',
                    animation: 'pulse-glow 4s ease-in-out infinite',
                }} />
            <div className="absolute w-[400px] h-[400px] rounded-full opacity-15"
                style={{
                    background: 'radial-gradient(circle, #bc13fe44, transparent 70%)',
                    right: '10%', bottom: '20%',
                    animation: 'pulse-glow 5s ease-in-out infinite reverse',
                }} />

            {/* Grid background */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(#00f3ff 1px, transparent 1px), linear-gradient(90deg, #00f3ff 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                }} />

            {/* Main auth card */}
            <motion.div
                ref={cardRef}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-md mx-4"
                style={getCardTransform()}
            >
                {/* Card glow border */}
                <div className="absolute -inset-[1px] rounded-3xl opacity-50"
                    style={{
                        background: `linear-gradient(135deg, #00f3ff40, #bc13fe40, #00f3ff40)`,
                        filter: 'blur(1px)',
                    }} />

                <div className="relative rounded-3xl border border-white/10 overflow-hidden"
                    style={{
                        background: 'linear-gradient(145deg, rgba(10,10,30,0.9), rgba(5,5,17,0.95))',
                        backdropFilter: 'blur(40px)',
                        boxShadow: '0 0 80px rgba(0,243,255,0.08), 0 25px 50px rgba(0,0,0,0.5)',
                    }}>
                    {/* Glossy reflection */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent pointer-events-none" />

                    <div className="relative p-8">
                        {/* Logo + Title */}
                        <div className="text-center mb-8">
                            <motion.div
                                animate={{ rotateY: [0, 360] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                                style={{
                                    background: 'linear-gradient(135deg, #00f3ff20, #bc13fe20)',
                                    border: '1px solid rgba(0,243,255,0.2)',
                                    boxShadow: '0 0 30px rgba(0,243,255,0.15)',
                                }}
                            >
                                <Brain className="w-8 h-8 text-neon-cyan" />
                            </motion.div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-white to-purple-400">
                                SURVI
                            </h1>
                            <p className="text-gray-500 text-sm mt-1 font-mono tracking-wider">
                                Emotion Surveillance System
                            </p>
                        </div>

                        {/* Tab Switcher */}
                        <div className="relative flex mb-8 p-1 rounded-xl bg-white/5 border border-white/5">
                            <motion.div
                                className="absolute inset-y-1 rounded-lg"
                                animate={{ left: mode === 'login' ? '4px' : '50%', width: 'calc(50% - 4px)' }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                style={{
                                    background: 'linear-gradient(135deg, #00f3ff15, #bc13fe15)',
                                    border: '1px solid rgba(0,243,255,0.15)',
                                }}
                            />
                            <button
                                onClick={() => { setMode('login'); setError('') }}
                                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg relative z-10 transition-colors ${mode === 'login' ? 'text-cyan-300' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => { setMode('signup'); setError('') }}
                                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg relative z-10 transition-colors ${mode === 'signup' ? 'text-cyan-300' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                Sign Up
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <AnimatePresence mode="wait">
                                {mode === 'signup' && (
                                    <motion.div
                                        key="name"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="relative group">
                                            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                                            <input
                                                type="text"
                                                placeholder="Full Name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required={mode === 'signup'}
                                                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-cyan-400/50 focus:bg-white/[0.07] focus:shadow-[0_0_20px_rgba(0,243,255,0.1)] transition-all text-sm"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="relative group">
                                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-cyan-400/50 focus:bg-white/[0.07] focus:shadow-[0_0_20px_rgba(0,243,255,0.1)] transition-all text-sm"
                                />
                            </div>

                            <div className="relative group">
                                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-cyan-400/50 focus:bg-white/[0.07] focus:shadow-[0_0_20px_rgba(0,243,255,0.1)] transition-all text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>

                            <AnimatePresence mode="wait">
                                {mode === 'signup' && (
                                    <motion.div
                                        key="confirm"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="relative group">
                                            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                                            <input
                                                type="password"
                                                placeholder="Confirm Password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required={mode === 'signup'}
                                                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-cyan-400/50 focus:bg-white/[0.07] focus:shadow-[0_0_20px_rgba(0,243,255,0.1)] transition-all text-sm"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Error */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className="bg-red-500/10 border border-red-400/20 rounded-xl px-4 py-3"
                                    >
                                        <p className="text-red-400 text-xs font-mono">{error}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full relative group overflow-hidden rounded-xl py-3.5 text-sm font-bold text-white transition-all disabled:opacity-50"
                                style={{
                                    background: 'linear-gradient(135deg, #00f3ff, #bc13fe)',
                                }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-white/20 to-cyan-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                <span className="relative flex items-center justify-center gap-2">
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            {mode === 'login' ? 'Sign In' : 'Create Account'}
                                            <ArrowRight size={16} />
                                        </>
                                    )}
                                </span>
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-3 my-6">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                            <Sparkles size={12} className="text-gray-600" />
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        </div>

                        {/* Footer */}
                        <p className="text-center text-xs text-gray-600 font-mono">
                            Powered by FER2013 Deep Learning Engine
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* CSS Animations */}
            <style jsx global>{`
                @keyframes float-particle {
                    0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
                    10% { opacity: 0.5; }
                    90% { opacity: 0.5; }
                    100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; }
                }
                @keyframes pulse-glow {
                    0%, 100% { transform: scale(1); opacity: 0.15; }
                    50% { transform: scale(1.1); opacity: 0.25; }
                }
            `}</style>
        </div>
    )
}
