const alerts = [
    { id: 1, type: 'Angry', time: '10:42 AM', location: 'Main Hall', severity: 'high' },
    { id: 2, type: 'Sad', time: '10:38 AM', location: 'Entrance', severity: 'low' },
    { id: 3, type: 'Surprised', time: '10:15 AM', location: 'Corridor A', severity: 'medium' },
]

export default function RecentAlerts() {
    return (
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg shadow-red-500/5">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <span className="mr-2">⚠️</span> Recent Alerts
            </h3>
            <div className="space-y-3">
                {alerts.map((alert) => (
                    <div key={alert.id} className="flex items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors cursor-pointer">
                        <div className={`w-2 h-2 rounded-full mr-3 ${alert.severity === 'high' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' :
                                alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                            }`} />
                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-200">{alert.type} Detection</span>
                                <span className="text-xs text-gray-500">{alert.time}</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Location: {alert.location}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
