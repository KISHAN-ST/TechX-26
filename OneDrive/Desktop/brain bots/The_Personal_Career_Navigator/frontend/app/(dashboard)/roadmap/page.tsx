// frontend/app/(dashboard)/roadmap/page.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function RoadmapPage() {
  const [userId, setUserId] = useState('1')
  const [dreamRole, setDreamRole] = useState('')
  const [roadmap, setRoadmap] = useState<any>(null)
  const [error, setError] = useState('')
  const [generating, setGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!dreamRole.trim()) {
      setError('Please enter a dream role')
      return
    }

    setGenerating(true)
    setError('')
    
    try {
      const response = await fetch(
        `http://localhost:8000/roadmap/generate/${userId}?dream_role=${encodeURIComponent(dreamRole)}`,
        { method: 'POST' }
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const roadmapResponse = await fetch(`http://localhost:8000/roadmap/${userId}`)
      if (!roadmapResponse.ok) {
        throw new Error('Failed to fetch roadmap')
      }
      
      const data = await roadmapResponse.json()
      setRoadmap(data)
    } catch (err) {
      setError('Failed to generate roadmap. Please try again.')
      console.error('Error:', err)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl"
    >
      <div className="mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">30-Day Learning Roadmap</h1>
        <p className="text-slate-400">Your personalized path to mastering new skills</p>
      </div>

      <div className="card p-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
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
            <label className="block text-sm font-semibold mb-3 text-slate-200">Dream Role</label>
            <input
              type="text"
              value={dreamRole}
              onChange={(e) => setDreamRole(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="e.g., Machine Learning Engineer"
              className="w-full px-4 py-3 bg-slate-900/50 rounded-lg border border-slate-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-white"
            />
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="btn-primary w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generating ? '⏳ Generating Roadmap...' : '🗺️ Generate Roadmap'}
        </button>
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

      {roadmap && roadmap.days_data && (
        <div className="space-y-4">
          {roadmap.days_data.map((day: any, index: number) => {
            const difficultyColors = {
              'Beginner': 'from-green-500/20 to-emerald-500/20 border-green-500/30',
              'Intermediate': 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30',
              'Advanced': 'from-red-500/20 to-orange-500/20 border-red-500/30',
            }
            const difficultyText = {
              'Beginner': 'text-green-400',
              'Intermediate': 'text-yellow-400',
              'Advanced': 'text-red-400',
            }
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                className={`card p-6 border bg-gradient-to-r ${difficultyColors[day.difficulty as keyof typeof difficultyColors] || 'border-slate-700/50'}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">Day {day.day}</h3>
                    <p className="text-lg font-semibold gradient-text">{day.focus_skill}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 bg-slate-900/50 rounded-full text-sm font-medium ${difficultyText[day.difficulty as keyof typeof difficultyText]}`}>
                      {day.difficulty}
                    </span>
                    <p className="text-sm text-slate-400 mt-2">
                      ⏱️ {day.estimated_hours}hours
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-3 text-slate-200">📋 Tasks:</h4>
                    <ul className="space-y-2">
                      {day.tasks.map((task: string, i: number) => (
                        <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                          <span className="text-blue-400 mt-0.5">→</span>
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-slate-200">📚 Resources:</h4>
                    <ul className="space-y-2">
                      {day.resources.map((resource: string, i: number) => (
                        <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                          <span className="text-purple-400 mt-0.5">▸</span>
                          <span>{resource}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}