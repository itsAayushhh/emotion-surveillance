export default function LiveFeed() {
    return (
        <div className="relative w-full h-full bg-black/20">
            <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-neon-cyan/50 animate-pulse font-mono text-sm tracking-widest">
                    [ ESTABLISHING UPLINK ]
                </p>
            </div>

            {/* Simulated Video Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/5 to-purple-900/5 pointer-events-none" />

            {/* Overlay UI */}
            <div className="absolute top-4 left-4 flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-[10px] font-bold text-red-500 tracking-widest uppercase">
                    Live Feed // CAM-01
                </span>
            </div>

            {/* Face Mesh Simulation Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-64 h-64 anime-spin-slow">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#00f3ff" strokeWidth="0.5" strokeDasharray="4 2" />
                    <circle cx="50" cy="50" r="30" fill="none" stroke="#bc13fe" strokeWidth="0.5" strokeDasharray="2 4" />
                </svg>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div className="flex space-x-2 font-mono text-[10px] text-cyan-500/80">
                    <span>REC ●</span>
                    <span>HD 4K</span>
                </div>
            </div>

            {/* Grid Overlay Effect */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0 mix-blend-overlay" />
        </div>
    )
}
