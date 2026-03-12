'use client'

import GlassPanel from '@/components/ui/glass-panel'
import ConfusionMatrix from '@/components/visualizations/confusion-matrix'
import { mockConfusionMatrix, mockClassificationMetrics, mockOverallAccuracy } from '@/lib/mock-data'
import { Award } from 'lucide-react'

export default function PerformancePanel() {
    return (
        <GlassPanel className="h-full flex flex-col p-4" intensity="medium">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                <h2 className="text-sm text-gray-300 uppercase tracking-widest flex items-center gap-2">
                    <Award size={14} className="text-green-400" />
                    Performance Evaluation
                </h2>
                <div className="px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-full">
                    <span className="text-xs font-mono text-green-400">
                        {(mockOverallAccuracy * 100).toFixed(1)}% Accuracy
                    </span>
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-auto">
                {/* Confusion Matrix */}
                <div className="flex-1 min-h-[300px]">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Confusion Matrix</div>
                    <div className="bg-black/20 rounded-lg p-2 h-[calc(100%-2rem)]">
                        <ConfusionMatrix
                            matrix={mockConfusionMatrix.matrix}
                            labels={mockConfusionMatrix.labels}
                        />
                    </div>
                </div>

                {/* Classification Report */}
                <div className="flex-1 min-h-[300px]">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Classification Report</div>
                    <div className="bg-black/20 rounded-lg p-3 overflow-auto h-[calc(100%-2rem)]">
                        <table className="w-full text-xs font-mono">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-2 text-gray-400 font-normal">Emotion</th>
                                    <th className="text-right py-2 text-gray-400 font-normal">Precision</th>
                                    <th className="text-right py-2 text-gray-400 font-normal">Recall</th>
                                    <th className="text-right py-2 text-gray-400 font-normal">F1-Score</th>
                                    <th className="text-right py-2 text-gray-400 font-normal">Support</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockClassificationMetrics.map((metric) => (
                                    <tr key={metric.emotion} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-2 text-gray-300">{metric.emotion}</td>
                                        <td className="text-right py-2 text-neon-cyan">{metric.precision.toFixed(2)}</td>
                                        <td className="text-right py-2 text-neon-cyan">{metric.recall.toFixed(2)}</td>
                                        <td className="text-right py-2 text-neon-cyan">{metric.f1Score.toFixed(2)}</td>
                                        <td className="text-right py-2 text-gray-400">{metric.support}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="border-t-2 border-white/20 font-bold">
                                    <td className="py-2 text-gray-200">Weighted Avg</td>
                                    <td className="text-right py-2 text-green-400">
                                        {(mockClassificationMetrics.reduce((sum, m) => sum + m.precision * m.support, 0) /
                                            mockClassificationMetrics.reduce((sum, m) => sum + m.support, 0)).toFixed(2)}
                                    </td>
                                    <td className="text-right py-2 text-green-400">
                                        {(mockClassificationMetrics.reduce((sum, m) => sum + m.recall * m.support, 0) /
                                            mockClassificationMetrics.reduce((sum, m) => sum + m.support, 0)).toFixed(2)}
                                    </td>
                                    <td className="text-right py-2 text-green-400">
                                        {(mockClassificationMetrics.reduce((sum, m) => sum + m.f1Score * m.support, 0) /
                                            mockClassificationMetrics.reduce((sum, m) => sum + m.support, 0)).toFixed(2)}
                                    </td>
                                    <td className="text-right py-2 text-gray-300">
                                        {mockClassificationMetrics.reduce((sum, m) => sum + m.support, 0)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </GlassPanel>
    )
}
