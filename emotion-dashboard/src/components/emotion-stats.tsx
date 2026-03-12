'use client'

import { useEffect, useState } from 'react'

const emotions = [
    { label: 'Happy', color: 'bg-green-500', value: 10 },
    { label: 'Surprised', color: 'bg-yellow-400', value: 5 },
    { label: 'Neutral', color: 'bg-gray-400', value: 60 },
    { label: 'Sad', color: 'bg-blue-500', value: 10 },
    { label: 'Angry', color: 'bg-red-500', value: 15 },
]

export default function EmotionStats() {
    const [stats, setStats] = useState(emotions)

    // Simulate dynamic data
    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => prev.map(e => ({
                ...e,
                value: Math.max(0, Math.min(100, e.value + (Math.random() * 10 - 5)))
            })))
        }, 2000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="w-full h-full">
            <div className="space-y-4">
                {stats.map((emotion) => (
                    <div key={emotion.label} className="group">
                        <div className="flex justify-between text-[10px] mb-1 font-mono uppercase tracking-wider">
                            <span className="text-gray-400">{emotion.label}</span>
                            <span className="text-white">{Math.round(emotion.value)}%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${emotion.color} shadow-[0_0_8px_${emotion.color}] transition-all duration-1000 ease-out relative`}
                                style={{ width: `${emotion.value}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
