// frontend/app/(dashboard)/gaps/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import GapBarChart from '@/components/charts/GapBarChart'

export default function GapsPage() {
  const [userId, setUserId] = useState('1')
  const [gaps, setGaps] = useState<any>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchGaps = async () => {
    if (!userId.trim()) {
      setError('Please enter a user ID')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`http://localhost:8000/gaps/${userId}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setGaps(data)
    } catch (err) {
      setError('Failed to load skill gaps. Please try again.')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl"
    >
      <div className="mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">Skill Gap Analysis</h1>
        <p className="text-slate-400">Identify the gaps between your current and desired skill level</p>
      </div>

      <div className="card p-6 mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && fetchGaps()}
            placeholder="Enter User ID"
            className="flex-1 px-4 py-3 bg-slate-900/50 rounded-lg border border-slate-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-white"
          />
          <button
            onClick={fetchGaps}
            disabled={loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Loading...' : '📊 Load Gaps'}
          </button>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6"
        >
          <p className="text-red-400 text-sm">{error}</p>
        </motion.div>
      )}

      {gaps && (
        <div className="space-y-6">
          <div className="card p-6">
            <GapBarChart data={gaps.gaps.slice(0, 10)} />
          </div>

          <div className="card p-6">
            <h2 className="text-2xl font-bold mb-6">Detailed Skill Gaps</h2>
            <div className="space-y-3">
              {gaps.gaps.map((gap: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/30 hover:border-slate-600/50 rounded-lg p-4 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-white">{gap.skill}</h3>
                      <div className="flex gap-4 text-sm text-slate-400 mt-2">
                        <span>📈 Your Level: <span className="text-blue-400 font-semibold">{(gap.user_level * 100).toFixed(0)}%</span></span>
                        <span>🎯 Importance: <span className="text-purple-400 font-semibold">{(gap.importance * 100).toFixed(0)}%</span></span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                        {(gap.gap_score * 100).toFixed(0)}%
                      </p>
                      <p className="text-xs text-slate-400">Gap to Close</p>
                    </div>
                  </div>
                  <div className="w-full bg-slate-900/50 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${gap.user_level * 100}%` }}
                      transition={{ duration: 0.6, delay: index * 0.05 }}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}