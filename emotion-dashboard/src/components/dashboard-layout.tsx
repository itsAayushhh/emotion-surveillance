'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const pathname = usePathname()
    const { user, logout } = useAuth()

    const navItems = [
        { name: 'Dashboard', href: '/', icon: '📊' },
        { name: 'Live Feed', href: '/feed', icon: '📹' },
        { name: 'Analytics', href: '/analytics', icon: '📈' },
        { name: 'Settings', href: '/settings', icon: '⚙️' },
    ]

    return (
        <div className="flex h-screen overflow-hidden text-white font-sans">
            {/* Sidebar */}
            <aside
                className={`relative z-20 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'
                    } bg-black/20 backdrop-blur-md border-r border-white/10`}
            >
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h1 className={`font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 ${!isSidebarOpen && 'hidden'}`}>
                        SURVI
                    </h1>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        {isSidebarOpen ? '◀' : '▶'}
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-2 px-2">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${pathname === item.href
                                        ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-white/10 text-cyan-300'
                                        : 'hover:bg-white/5 text-gray-400 hover:text-white'
                                        }`}
                                >
                                    <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
                                    {isSidebarOpen && (
                                        <span className="ml-3 font-medium tracking-wide">{item.name}</span>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <div className={`flex items-center ${!isSidebarOpen ? 'justify-center' : 'space-x-3'}`}>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 shadow-lg shadow-cyan-500/50 flex items-center justify-center text-xs font-bold text-white shrink-0">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        {isSidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">{user?.name || 'User'}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                            </div>
                        )}
                        {isSidebarOpen && (
                            <button
                                onClick={logout}
                                className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors shrink-0"
                                title="Sign out"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                            </button>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 relative z-10 flex flex-col h-full overflow-hidden">
                {/* Header */}
                <header className="h-16 flex items-center justify-between px-6 bg-black/10 backdrop-blur-sm border-b border-white/5">
                    <h2 className="text-lg font-medium text-gray-200">
                        {navItems.find(i => i.href === pathname)?.name || 'Dashboard'}
                    </h2>
                    <div className="flex items-center space-x-4">
                        <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30 animate-pulse">
                            LIVE RECORDING
                        </span>
                        <button className="p-2 rounded-full hover:bg-white/10">🔔</button>
                    </div>
                </header>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                    {children}
                </div>
            </main>
        </div>
    )
}
