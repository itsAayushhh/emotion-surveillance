'use client'

import { useEffect, useRef } from 'react'

export default function Waveform({ color = '#00f3ff' }: { color?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationId: number
        let offset = 0

        const draw = () => {
            const width = canvas.width
            const height = canvas.height

            ctx.clearRect(0, 0, width, height)
            ctx.beginPath()

            const gradient = ctx.createLinearGradient(0, 0, width, 0)
            gradient.addColorStop(0, `${color}00`) // Transparent start
            gradient.addColorStop(0.5, color)       // Solid center
            gradient.addColorStop(1, `${color}00`)  // Transparent end

            ctx.strokeStyle = gradient
            ctx.lineWidth = 2
            ctx.shadowBlur = 10
            ctx.shadowColor = color

            for (let x = 0; x < width; x++) {
                // Superpose sine waves for "voice" look
                const y = height / 2 +
                    Math.sin((x + offset) * 0.05) * 15 * Math.sin(x * 0.01) +
                    Math.sin((x + offset * 2) * 0.03) * 5

                if (x === 0) ctx.moveTo(x, y)
                else ctx.lineTo(x, y)
            }

            ctx.stroke()
            offset += 2
            animationId = requestAnimationFrame(draw)
        }

        const resize = () => {
            canvas.width = canvas.parentElement?.clientWidth || 300
            canvas.height = canvas.parentElement?.clientHeight || 100
        }

        window.addEventListener('resize', resize)
        resize()
        draw()

        return () => {
            window.removeEventListener('resize', resize)
            cancelAnimationFrame(animationId)
        }
    }, [color])

    return <canvas ref={canvasRef} className="w-full h-full" />
}
