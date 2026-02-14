// frontend/app/page.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, TrendingUp, Target, Map, BarChart3 } from 'lucide-react'

export default function Home() {
  const features = [
    { icon: Sparkles, title: 'Smart Profile', desc: 'Create your unique career profile' },
    { icon: TrendingUp, title: 'Market Intelligence', desc: 'Discover in-demand skills' },
    { icon: Target, title: 'Skill Gaps', desc: 'Identify what you need to learn' },
    { icon: Map, title: 'Learning Roadmap', desc: '30-day personalized learning path' },
    { icon: BarChart3, title: 'Weekly Evaluation', desc: 'Track progress & get recommendations' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-4xl px-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
            <Sparkles size={32} className="text-white" />
          </div>
        </motion.div>

        <h1 className="text-6xl font-bold gradient-text mb-4">
          Personal Career Navigator
        </h1>
        
        <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
          AI-powered career development system that creates personalized learning paths, analyzes skill gaps, and tracks your progress to your dream role.
        </p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <Link
            href="/profile"
            className="btn-primary inline-block px-8 py-4 text-lg font-semibold"
          >
            🚀 Get Started
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-20"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="card p-6"
              >
                <div className="mb-4">
                  <Icon className="w-8 h-8 text-blue-400 mx-auto" />
                </div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.desc}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </motion.div>
    </div>
  )
}