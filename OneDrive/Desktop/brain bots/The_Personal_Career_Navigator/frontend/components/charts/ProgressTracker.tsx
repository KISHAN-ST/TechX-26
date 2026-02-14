// frontend/components/charts/ProgressTracker.tsx
'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ProgressTrackerProps {
  data: Array<{ week: number; performance_score: number }>
}

export default function ProgressTracker({ data }: ProgressTrackerProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="week" stroke="#9CA3AF" />
        <YAxis stroke="#9CA3AF" />
        <Tooltip
          contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
          labelStyle={{ color: '#F9FAFB' }}
        />
        <Line type="monotone" dataKey="performance_score" stroke="#10B981" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}