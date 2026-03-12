'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    className?: string
    intensity?: 'low' | 'medium' | 'high'
    hoverEffect?: boolean
}

export default function GlassPanel({
    children,
    className = '',
    intensity = 'medium',
    hoverEffect = true,
    ...props
}: GlassPanelProps) {
    // Map intensity to styles
    const bgOpacity = {
        low: 'bg-black/20',
        medium: 'bg-black/40',
        high: 'bg-black/60',
    }

    const blurAmount = {
        low: 'backdrop-blur-sm',
        medium: 'backdrop-blur-md',
        high: 'backdrop-blur-xl',
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`
        relative rounded-2xl border border-white/10
        ${bgOpacity[intensity]} ${blurAmount[intensity]}
        shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]
        overflow-hidden
        ${hoverEffect ? 'hover:border-neon-cyan/50 hover:shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all duration-300' : ''}
        ${className}
      `}
            {...(props as any)}
        >
            {/* Glossy reflection gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 h-full">
                {children}
            </div>
        </motion.div>
    )
}
