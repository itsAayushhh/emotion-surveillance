'use client'

import { useState } from 'react'
import GlassPanel from '@/components/ui/glass-panel'
import LineChart from '@/components/visualizations/line-chart'
import { mockTrainingHistory } from '@/lib/mock-data'
import { TrendingUp } from 'lucide-react'

export default function TrainingAnalysisPanel() {
    const [showValidation, setShowValidation] = useState(true)

    // Prepare data for charts
    const accuracyData = [
        {
            label: 'Training',
            data: mockTrainingHistory.map(m => ({ x: m.epoch, y: m.trainAccuracy })),
            color: '#00f3ff'
        },
        ...(showValidation ? [{
            label: 'Validation',
            data: mockTrainingHistory.map(m => ({ x: m.epoch, y: m.valAccuracy })),
            color: '#bc13fe'
        }] : [])
    ]

    const lossData = [
        {
            label: 'Training',
            data: mockTrainingHistory.map(m => ({ x: m.epoch, y: m.trainLoss })),
            color: '#00f3ff'
        },
        ...(showValidation ? [{
            label: 'Validation',
            data: mockTrainingHistory.map(m => ({ x: m.epoch, y: m.valLoss })),
            color: '#bc13fe'
        }] : [])
    ]

    const finalMetrics = mockTrainingHistory[mockTrainingHistory.length - 1]

    return (
        <GlassPanel className="h-full flex flex-col p-4" intensity="medium">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                <h2 className="text-sm text-gray-300 uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp size={14} className="text-neon-purple" />
                    Training Analysis
                </h2>
                <button
                    onClick={() => setShowValidation(!showValidation)}
                    className="px-3 py-1 bg-white/5 border border-white/20 rounded text-xs text-white/90 hover:bg-white/10 transition-all"
                >
                    {showValidation ? 'Hide' : 'Show'} Validation
                </button>
            </div>

            <div className="flex-1 flex flex-col gap-4 overflow-auto">
                {/* Summary Stats */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-black/20 rounded-lg p-3 border border-white/10">
                        <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Final Train Acc</div>
                        <div className="text-xl font-bold text-neon-cyan font-mono">
                            {(finalMetrics.trainAccuracy * 100).toFixed(1)}%
                        </div>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3 border border-white/10">
                        <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Final Val Acc</div>
                        <div className="text-xl font-bold text-neon-purple font-mono">
                            {(finalMetrics.valAccuracy * 100).toFixed(1)}%
                        </div>
                    </div>
                </div>

                {/* Accuracy Chart */}
                <div className="flex-1 min-h-[200px]">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Accuracy vs Epochs</div>
                    <div className="bg-black/20 rounded-lg p-4 h-[calc(100%-2rem)]">
                        <LineChart
                            series={accuracyData}
                            xLabel="Epoch"
                            yLabel="Accuracy"
                            showGrid={true}
                            showLegend={true}
                        />
                    </div>
                </div>

                {/* Loss Chart */}
                <div className="flex-1 min-h-[200px]">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Loss vs Epochs</div>
                    <div className="bg-black/20 rounded-lg p-4 h-[calc(100%-2rem)]">
                        <LineChart
                            series={lossData}
                            xLabel="Epoch"
                            yLabel="Loss"
                            showGrid={true}
                            showLegend={true}
                        />
                    </div>
                </div>

                {/* Training Info */}
                <div className="bg-black/20 rounded-lg p-3 border border-white/10">
                    <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                        <div>
                            <span className="text-gray-400">Total Epochs:</span>
                            <span className="text-white ml-2">{mockTrainingHistory.length}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">Final Loss:</span>
                            <span className="text-white ml-2">{finalMetrics.trainLoss.toFixed(3)}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">Val Loss:</span>
                            <span className="text-white ml-2">{finalMetrics.valLoss.toFixed(3)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </GlassPanel>
    )
}
