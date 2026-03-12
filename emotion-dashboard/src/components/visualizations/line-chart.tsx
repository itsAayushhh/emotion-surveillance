'use client'

import { useMemo } from 'react'

interface DataPoint {
    x: number
    y: number
}

interface DataSeries {
    label: string
    data: DataPoint[]
    color: string
}

interface LineChartProps {
    series: DataSeries[]
    width?: number
    height?: number
    xLabel?: string
    yLabel?: string
    showGrid?: boolean
    showLegend?: boolean
}

export default function LineChart({
    series,
    width = 400,
    height = 200,
    xLabel = '',
    yLabel = '',
    showGrid = true,
    showLegend = true
}: LineChartProps) {
    const { xMin, xMax, yMin, yMax, xScale, yScale } = useMemo(() => {
        const allPoints = series.flatMap(s => s.data)
        const xValues = allPoints.map(p => p.x)
        const yValues = allPoints.map(p => p.y)

        const xMin = Math.min(...xValues)
        const xMax = Math.max(...xValues)
        const yMin = 0 // Start from 0 for better visualization
        const yMax = Math.max(...yValues)

        const padding = 40
        const chartWidth = width - padding * 2
        const chartHeight = height - padding * 2

        const xScale = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * chartWidth
        const yScale = (y: number) => height - padding - ((y - yMin) / (yMax - yMin)) * chartHeight

        return { xMin, xMax, yMin, yMax, xScale, yScale }
    }, [series, width, height])

    // Generate path for a data series
    const generatePath = (data: DataPoint[]) => {
        if (data.length === 0) return ''

        const sortedData = [...data].sort((a, b) => a.x - b.x)
        const path = sortedData.map((point, idx) => {
            const x = xScale(point.x)
            const y = yScale(point.y)
            return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`
        }).join(' ')

        return path
    }

    // Generate grid lines
    const gridLines = useMemo(() => {
        const lines = []
        const numYLines = 5
        const numXLines = 5

        // Horizontal grid lines
        for (let i = 0; i <= numYLines; i++) {
            const y = height - 40 - (i * (height - 80) / numYLines)
            lines.push(
                <line
                    key={`h-${i}`}
                    x1={40}
                    y1={y}
                    x2={width - 40}
                    y2={y}
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="1"
                />
            )
        }

        // Vertical grid lines
        for (let i = 0; i <= numXLines; i++) {
            const x = 40 + (i * (width - 80) / numXLines)
            lines.push(
                <line
                    key={`v-${i}`}
                    x1={x}
                    y1={40}
                    x2={x}
                    y2={height - 40}
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="1"
                />
            )
        }

        return lines
    }, [width, height])

    return (
        <div className="w-full h-full flex flex-col">
            <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
                {/* Grid */}
                {showGrid && gridLines}

                {/* Axes */}
                <line x1={40} y1={height - 40} x2={width - 40} y2={height - 40} stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                <line x1={40} y1={40} x2={40} y2={height - 40} stroke="rgba(255,255,255,0.2)" strokeWidth="2" />

                {/* Y-axis labels */}
                {[0, 0.25, 0.5, 0.75, 1].map((val, idx) => {
                    const y = yScale(val * yMax)
                    return (
                        <text
                            key={`y-label-${idx}`}
                            x={30}
                            y={y + 4}
                            fontSize="10"
                            fill="rgba(255,255,255,0.5)"
                            textAnchor="end"
                            fontFamily="monospace"
                        >
                            {(val * yMax).toFixed(2)}
                        </text>
                    )
                })}

                {/* X-axis labels */}
                {series[0]?.data.filter((_, idx) => idx % Math.ceil(series[0].data.length / 5) === 0).map((point) => {
                    const x = xScale(point.x)
                    return (
                        <text
                            key={`x-label-${point.x}`}
                            x={x}
                            y={height - 25}
                            fontSize="10"
                            fill="rgba(255,255,255,0.5)"
                            textAnchor="middle"
                            fontFamily="monospace"
                        >
                            {point.x}
                        </text>
                    )
                })}

                {/* Data series */}
                {series.map((s, idx) => (
                    <g key={idx}>
                        {/* Line */}
                        <path
                            d={generatePath(s.data)}
                            fill="none"
                            stroke={s.color}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="transition-all duration-300"
                        />

                        {/* Data points */}
                        {s.data.map((point, pointIdx) => (
                            <g key={pointIdx} className="group">
                                <circle
                                    cx={xScale(point.x)}
                                    cy={yScale(point.y)}
                                    r="3"
                                    fill={s.color}
                                    className="transition-all group-hover:r-5"
                                />

                                {/* Tooltip */}
                                <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <rect
                                        x={xScale(point.x) - 30}
                                        y={yScale(point.y) - 30}
                                        width="60"
                                        height="20"
                                        fill="rgba(0,0,0,0.9)"
                                        rx="4"
                                    />
                                    <text
                                        x={xScale(point.x)}
                                        y={yScale(point.y) - 16}
                                        fontSize="10"
                                        fill="white"
                                        textAnchor="middle"
                                        fontFamily="monospace"
                                    >
                                        {point.y.toFixed(3)}
                                    </text>
                                </g>
                            </g>
                        ))}
                    </g>
                ))}

                {/* Axis labels */}
                {xLabel && (
                    <text
                        x={width / 2}
                        y={height - 5}
                        fontSize="11"
                        fill="rgba(255,255,255,0.6)"
                        textAnchor="middle"
                        fontFamily="monospace"
                    >
                        {xLabel}
                    </text>
                )}

                {yLabel && (
                    <text
                        x={15}
                        y={height / 2}
                        fontSize="11"
                        fill="rgba(255,255,255,0.6)"
                        textAnchor="middle"
                        fontFamily="monospace"
                        transform={`rotate(-90, 15, ${height / 2})`}
                    >
                        {yLabel}
                    </text>
                )}
            </svg>

            {/* Legend */}
            {showLegend && (
                <div className="flex items-center justify-center gap-4 mt-2">
                    {series.map((s, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <div className="w-4 h-0.5 rounded" style={{ backgroundColor: s.color }} />
                            <span className="text-[10px] text-gray-400 font-mono">{s.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
