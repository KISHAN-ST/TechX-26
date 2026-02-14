// frontend/components/sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, TrendingUp, Target, Map, BarChart3, Sparkles } from 'lucide-react'

const navigation = [
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Market Analysis', href: '/market', icon: TrendingUp },
  { name: 'Skill Gaps', href: '/gaps', icon: Target },
  { name: '30-Day Roadmap', href: '/roadmap', icon: Map },
  { name: 'Weekly Evaluation', href: '/evaluation', icon: BarChart3 },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800/50 p-6 sticky top-0 h-screen flex flex-col shadow-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Career Navigator</h2>
        </div>
        <p className="text-xs text-slate-400 ml-12">AI-Powered Growth</p>
      </div>

      <nav className="space-y-2 flex-1">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname.includes(item.href.split('/')[1])

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <Icon size={20} className={isActive ? '' : 'group-hover:scale-110 transition-transform'} />
              <span className="font-medium">{item.name}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="pt-6 border-t border-slate-800">
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4">
          <p className="text-xs text-slate-400">Status</p>
          <p className="text-sm font-semibold text-green-400 mt-1">✓ System Active</p>
        </div>
      </div>
    </div>
  )
}