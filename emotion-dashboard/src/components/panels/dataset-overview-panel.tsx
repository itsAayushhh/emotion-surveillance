'use client'

import GlassPanel from '@/components/ui/glass-panel'
import BarChart from '@/components/visualizations/bar-chart'
import { mockDatasetStats, EMOTION_COLORS, EMOTIONS } from '@/lib/mock-data'
import { Database } from 'lucide-react'

export default function DatasetOverviewPanel() {
    // Prepare data for bar chart
    const chartData = mockDatasetStats.classDistribution.map(item => ({
        label: item.emotion,
        value: item.count,
        color: EMOTION_COLORS[item.emotion]
    }))

    // Sample images (using placeholder colors for demonstration)
    const sampleImages = EMOTIONS.map(emotion => ({
        emotion,
        color: EMOTION_COLORS[emotion]
    }))

    return (
        <GlassPanel className="h-full flex flex-col p-4" intensity="medium">
            <h2 className="text-sm text-gray-300 uppercase tracking-widest mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
                <Database size={14} className="text-yellow-400" />
                Dataset Overview
            </h2>

            <div className="flex-1 flex flex-col gap-4 overflow-auto">
                {/* Dataset Stats */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-black/20 rounded-lg p-3 border border-white/10">
                        <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Images</div>
                        <div className="text-lg font-bold text-white font-mono">
                            {mockDatasetStats.totalImages.toLocaleString()}
                        </div>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3 border border-white/10">
                        <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Training Set</div>
                        <div className="text-lg font-bold text-neon-cyan font-mono">
                            {mockDatasetStats.trainImages.toLocaleString()}
                        </div>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3 border border-white/10">
                        <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Test Set</div>
                        <div className="text-lg font-bold text-neon-purple font-mono">
                            {mockDatasetStats.testImages.toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* Class Distribution Chart */}
                <div className="flex-1 min-h-[200px]">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Class Distribution</div>
                    <div className="bg-black/20 rounded-lg p-4 h-[calc(100%-2rem)]">
                        <BarChart data={chartData} showValues={true} orientation="vertical" />
                    </div>
                </div>

                {/* Sample Images Grid */}
                <div className="flex-1 min-h-[150px]">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Sample Images by Class</div>
                    <div className="bg-black/20 rounded-lg p-3 h-[calc(100%-2rem)] overflow-auto">
                        <div className="grid grid-cols-7 gap-2">
                            {sampleImages.map((sample) => (
                                <div key={sample.emotion} className="group relative">
                                    <div
                                        className="aspect-square rounded border border-white/20 flex items-center justify-center text-xs font-mono transition-all group-hover:border-white/50 group-hover:scale-105 cursor-pointer"
                                        style={{ backgroundColor: `${sample.color}20` }}
                                    >
                                        <span className="opacity-50 group-hover:opacity-100" style={{ color: sample.color }}>
                                            {sample.emotion.slice(0, 3)}
                                        </span>
                                    </div>

                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 rounded text-[9px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                        {sample.emotion}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-3 text-center italic">
                            Sample images placeholder - connect to backend for actual FER2013 images
                        </p>
                    </div>
                </div>

                {/* Dataset Info */}
                <div className="bg-black/20 rounded-lg p-3 border border-white/10">
                    <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Dataset:</span>
                            <span className="text-white font-mono">FER2013</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Image Size:</span>
                            <span className="text-white font-mono">48x48 grayscale</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Classes:</span>
                            <span className="text-white font-mono">7 emotions</span>
                        </div>
                    </div>
                </div>
            </div>
        </GlassPanel>
    )
}
