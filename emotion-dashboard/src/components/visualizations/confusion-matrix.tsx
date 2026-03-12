'use client'

import { EMOTION_COLORS } from '@/lib/mock-data'
import type { Emotion } from '@/lib/types'

interface ConfusionMatrixProps {
    matrix: number[][]
    labels: Emotion[]
}

export default function ConfusionMatrix({ matrix, labels }: ConfusionMatrixProps) {
    // Find max value for color scaling
    const maxValue = Math.max(...matrix.flat())

    // Calculate color intensity based on value
    const getColorIntensity = (value: number) => {
        const intensity = value / maxValue
        return `rgba(0, 243, 255, ${intensity * 0.8})` // Neon cyan with varying opacity
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="grid gap-1" style={{ gridTemplateColumns: `auto repeat(${labels.length}, 1fr)` }}>
                {/* Top-left empty cell */}
                <div className="text-[10px] text-gray-500 flex items-center justify-center p-1"></div>

                {/* Column headers (Predicted) */}
                {labels.map((label, idx) => (
                    <div
                        key={`col-${idx}`}
                        className="text-[9px] text-gray-400 font-mono flex items-center justify-center p-1 text-center"
                        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                    >
                        {label}
                    </div>
                ))}

                {/* Matrix rows */}
                {matrix.map((row, rowIdx) => (
                    <div key={`row-${rowIdx}`} className="contents">
                        {/* Row header (Actual) */}
                        <div className="text-[9px] text-gray-400 font-mono flex items-center justify-end pr-2">
                            {labels[rowIdx]}
                        </div>

                        {/* Matrix cells */}
                        {row.map((value, colIdx) => {
                            const isCorrect = rowIdx === colIdx
                            return (
                                <div
                                    key={`cell-${rowIdx}-${colIdx}`}
                                    className="relative group aspect-square flex items-center justify-center rounded border border-white/5 transition-all hover:border-neon-cyan/50 cursor-pointer"
                                    style={{
                                        backgroundColor: isCorrect
                                            ? `rgba(34, 197, 94, ${(value / maxValue) * 0.6})` // Green for correct predictions
                                            : getColorIntensity(value)
                                    }}
                                >
                                    <span className="text-[10px] font-mono text-white/80 group-hover:text-white">
                                        {value}
                                    </span>

                                    {/* Tooltip on hover */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 rounded text-[9px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                        Actual: {labels[rowIdx]}<br />
                                        Predicted: {labels[colIdx]}<br />
                                        Count: {value}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center gap-4 text-[10px] text-gray-400">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border border-white/10" style={{ backgroundColor: 'rgba(34, 197, 94, 0.5)' }} />
                    <span>Correct</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border border-white/10" style={{ backgroundColor: 'rgba(0, 243, 255, 0.5)' }} />
                    <span>Misclassified</span>
                </div>
            </div>

            {/* Axis labels */}
            <div className="mt-2 text-center">
                <div className="text-[10px] text-gray-500 font-mono">
                    <span className="text-gray-400">Rows:</span> Actual | <span className="text-gray-400">Cols:</span> Predicted
                </div>
            </div>
        </div>
    )
}
