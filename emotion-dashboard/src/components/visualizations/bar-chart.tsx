'use client'

import type { Emotion } from '@/lib/types'
import { EMOTION_COLORS } from '@/lib/mock-data'

interface BarChartProps {
    data: {
        label: string
        value: number
        color?: string
    }[]
    maxValue?: number
    showValues?: boolean
    orientation?: 'horizontal' | 'vertical'
}

export default function BarChart({
    data,
    maxValue,
    showValues = true,
    orientation = 'vertical'
}: BarChartProps) {
    const max = maxValue || Math.max(...data.map(d => d.value))

    if (orientation === 'horizontal') {
        return (
            <div className="w-full h-full flex flex-col justify-center gap-3 p-4">
                {data.map((item, idx) => {
                    const percentage = (item.value / max) * 100
                    return (
                        <div key={idx} className="flex items-center gap-3">
                            <div className="w-16 text-[11px] text-gray-400 font-mono text-right truncate">
                                {item.label}
                            </div>
                            <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden relative group">
                                <div
                                    className="h-full rounded-full transition-all duration-500 ease-out"
                                    style={{
                                        width: `${percentage}%`,
                                        backgroundColor: item.color || '#00f3ff'
                                    }}
                                />
                                {showValues && (
                                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-white/80">
                                        {item.value.toLocaleString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    // Vertical orientation
    return (
        <div className="w-full h-full flex items-end justify-around gap-2 p-4">
            {data.map((item, idx) => {
                const percentage = (item.value / max) * 100
                return (
                    <div key={idx} className="flex flex-col items-center gap-2 flex-1 max-w-[80px]">
                        <div className="relative w-full flex-1 flex items-end group">
                            <div className="w-full bg-white/5 rounded-t-lg overflow-hidden relative" style={{ height: '100%' }}>
                                <div
                                    className="absolute bottom-0 w-full rounded-t-lg transition-all duration-500 ease-out flex items-end justify-center pb-1"
                                    style={{
                                        height: `${percentage}%`,
                                        backgroundColor: item.color || '#00f3ff'
                                    }}
                                >
                                    {showValues && (
                                        <span className="text-[9px] font-mono text-white/90">
                                            {item.value.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 rounded text-[9px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                {item.label}: {item.value.toLocaleString()}
                            </div>
                        </div>

                        <div className="text-[10px] text-gray-400 font-mono text-center truncate w-full">
                            {item.label}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
