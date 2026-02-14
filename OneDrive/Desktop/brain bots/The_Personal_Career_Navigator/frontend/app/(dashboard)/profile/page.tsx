// frontend/app/(dashboard)/profile/page.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function ProfilePage() {
  const [userId, setUserId] = useState('')
  const [email, setEmail] = useState('')
  const [githubUsername, setGithubUsername] = useState('')
  const [dreamRole, setDreamRole] = useState('')

  const handleCreateProfile = async () => {
    try {
      const response = await fetch('http://localhost:8000/profile/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email, 
          github_username: githubUsername, 
          dream_role: dreamRole 
        }),
      })
      const data = await response.json()
      if (data.id) {
        setUserId(data.id.toString())
      }
    } catch (error) {
      console.error('Error creating profile:', error)
    }
  }

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !userId) return
    
    try {
      const formData = new FormData()
      formData.append('file', e.target.files[0])
      
      const response = await fetch(`http://localhost:8000/profile/upload-resume/${userId}`, {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      alert(data.message || 'Resume uploaded successfully')
    } catch (error) {
      console.error('Error uploading resume:', error)
    }
  }

  const handleLinkedInUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !userId) return
    
    try {
      const formData = new FormData()
      formData.append('file', e.target.files[0])
      
      const response = await fetch(`http://localhost:8000/profile/upload-linkedin/${userId}`, {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      alert(data.message || 'LinkedIn data uploaded successfully')
    } catch (error) {
      console.error('Error uploading LinkedIn data:', error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl"
    >
      <div className="mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">Profile Setup</h1>
        <p className="text-slate-400">Create your profile and unlock AI-powered career insights</p>
      </div>
      
      <div className="card p-8 space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-3 text-slate-200">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-slate-900/50 rounded-lg border border-slate-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-3 text-slate-200">GitHub Username</label>
          <input
            type="text"
            value={githubUsername}
            onChange={(e) => setGithubUsername(e.target.value)}
            className="w-full px-4 py-3 bg-slate-900/50 rounded-lg border border-slate-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
            placeholder="your-github-username"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-3 text-slate-200">Dream Role</label>
          <input
            type="text"
            value={dreamRole}
            onChange={(e) => setDreamRole(e.target.value)}
            className="w-full px-4 py-3 bg-slate-900/50 rounded-lg border border-slate-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
            placeholder="e.g., Machine Learning Engineer"
          />
        </div>

        <button
          onClick={handleCreateProfile}
          className="btn-primary w-full py-3 font-semibold text-lg"
        >
          🚀 Create Profile
        </button>

        {userId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pt-6 border-t border-slate-700/50 space-y-4"
          >
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-4">
              <p className="text-sm text-green-400">✓ Profile created successfully!</p>
              <p className="text-xs text-slate-400 mt-2">User ID: <span className="font-mono text-green-400">{userId}</span></p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3 text-slate-200">📄 Upload Resume (PDF)</label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleResumeUpload}
                className="w-full px-4 py-3 bg-slate-900/50 rounded-lg border border-slate-700/50 border-dashed file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer file:font-medium transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3 text-slate-200">🔗 Upload LinkedIn Data (JSON)</label>
              <input
                type="file"
                accept=".json"
                onChange={handleLinkedInUpload}
                className="w-full px-4 py-3 bg-slate-900/50 rounded-lg border border-slate-700/50 border-dashed file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer file:font-medium transition-all"
              />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}