// frontend/app/(dashboard)/market/page.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function MarketPage() {
  const [role, setRole] = useState('')
  const [analysis, setAnalysis] = useState<any>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async () => {
    if (!role.trim()) {
      setError('Please enter a role to analyze')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`http://localhost:8000/market/analyze/${encodeURIComponent(role)}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setAnalysis(data)
    } catch (err) {
      setError('Failed to fetch market analysis. Please try again.')
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
        <h1 className="text-4xl font-bold gradient-text mb-2">Market Intelligence</h1>
        <p className="text-slate-400">Discover what skills the market is looking for in your dream role</p>
      </div>

      <div className="card p-6 mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
            placeholder="e.g., Machine Learning Engineer, Data Scientist..."
            className="flex-1 px-4 py-3 bg-slate-900/50 rounded-lg border border-slate-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-white placeholder-slate-500"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Analyzing...' : '🔍 Analyze'}
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

      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-8"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">
              Market Demand for <span className="gradient-text">{analysis.role}</span>
            </h2>
            <p className="text-slate-400">
              📊 Analyzed {analysis.total_jobs_analyzed} job postings
            </p>
            {analysis.note && (
              <p className="text-yellow-400 text-sm mt-3">ℹ️ {analysis.note}</p>
            )}
          </div>

          <div className="space-y-3">
            {analysis.market_skills.map((skill: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/30 hover:border-slate-600/50 rounded-lg p-4 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-white">{skill.skill}</span>
                  <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                    {skill.frequency} mentions
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-slate-900/50 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.avg_importance * 100}%` }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full"
                    />
                  </div>
                  <span className="text-sm font-bold text-blue-400 min-w-fit">
                    {(skill.avg_importance * 100).toFixed(0)}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}