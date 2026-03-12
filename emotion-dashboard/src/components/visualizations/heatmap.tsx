'use client'

import { useEffect, useState } from 'react'

export default function Heatmap() {
    const [grid, setGrid] = useState<number[]>(Array(64).fill(0))

    useEffect(() => {
        const interval = setInterval(() => {
            setGrid(prev => prev.map(() => Math.random()))
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="grid grid-cols-8 gap-1 w-full h-full p-2">
            {grid.map((value, i) => (
                <div
                    key={i}
                    className="rounded-sm transition-colors duration-1000"
                    style={{
                        backgroundColor: `rgba(188, 19, 254, ${value * 0.8})`, // Neon purple base
                        boxShadow: value > 0.8 ? '0 0 8px #bc13fe' : 'none'
                    }}
                />
            ))}
        </div>
    )
}
