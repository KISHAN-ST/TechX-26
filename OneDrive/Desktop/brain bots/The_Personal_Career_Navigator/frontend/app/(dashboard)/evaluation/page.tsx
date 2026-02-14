// frontend/app/(dashboard)/evaluation/page.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function EvaluationPage() {
  const [userId, setUserId] = useState('1')
  const [weekNumber, setWeekNumber] = useState('1')
  const [evaluation, setEvaluation] = useState<any>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRunEvaluation = async () => {
    if (!userId.trim() || !weekNumber.trim()) {
      setError('Please enter both user ID and week number')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(
        `http://localhost:8000/evaluation/run/${userId}?week_number=${weekNumber}`,
        { method: 'POST' }
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setEvaluation(data)
    } catch (err) {
      setError('Failed to run evaluation. Please try again.')
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
        <h1 className="text-4xl font-bold gradient-text mb-2">Weekly Evaluation</h1>
        <p className="text-slate-400">Track your progress and get AI-powered recommendations</p>
      </div>

      <div className="card p-6 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-3 text-slate-200">User ID</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="1"
              className="w-full px-4 py-3 bg-slate-900/50 rounded-lg border border-slate-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-3 text-slate-200">Week Number</label>
            <input
              type="text"
              value={weekNumber}
              onChange={(e) => setWeekNumber(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleRunEvaluation()}
              placeholder="1"
              className="w-full px-4 py-3 bg-slate-900/50 rounded-lg border border-slate-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-white"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleRunEvaluation}
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Evaluating...' : '📈 Run Evaluation'}
            </button>
          </div>
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

      {evaluation && (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-8 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30"
          >
            <h2 className="text-2xl font-bold mb-6">📊 Week {evaluation.week_number} Results</h2>
            <div className="flex items-center gap-8">
              <div className="flex-1">
                <p className="text-sm text-slate-400 mb-4">Performance Score</p>
                <div className="w-full bg-slate-900/50 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${evaluation.performance_score * 100}%` }}
                    transition={{ duration: 0.6 }}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full shadow-lg shadow-green-500/30"
                  />
                </div>
              </div>
              <div className="text-right">
                <p className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  {(evaluation.performance_score * 100).toFixed(0)}%
                </p>
                <p className="text-xs text-slate-400 mt-2">Overall Performance</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-8"
          >
            <h3 className="text-2xl font-bold mb-6">🎯 Skills Updated</h3>
            <div className="space-y-4">
              {evaluation.skills_updated.map((skill: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="bg-gradient-to-r from-slate-800/30 to-slate-900/30 border border-slate-700/30 rounded-lg p-4 hover:border-slate-600/50 transition-all"
                >
                  <h4 className="font-semibold text-lg mb-3 text-white">{skill.skill}</h4>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm text-slate-400 mb-2">
                        <span>Previous</span>
                        <span>Current</span>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1 h-2 bg-slate-900/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-slate-600"
                            style={{ width: `${skill.old_level * 100}%` }}
                          />
                        </div>
                        <div className="flex-1 h-2 bg-slate-900/50 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.new_level * 100}%` }}
                            transition={{ duration: 0.6 }}
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-400">{(skill.old_level * 100).toFixed(0)}%</span>
                        <span className="text-green-400">→</span>
                        <span className="text-lg font-bold text-green-400">{(skill.new_level * 100).toFixed(0)}%</span>
                      </div>
                      <p className="text-xs text-green-400 mt-1">+{((skill.new_level - skill.old_level) * 100).toFixed(0)}%</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-8"
          >
            <h3 className="text-2xl font-bold mb-6">💡 Adaptations Made</h3>
            <div className="space-y-3">
              {evaluation.adaptations_made.map((adaptation: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="flex items-start gap-3 p-4 bg-slate-800/30 border border-slate-700/30 rounded-lg"
                >
                  <span className="text-purple-400 mt-1">✓</span>
                  <span className="text-slate-200">{adaptation}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}