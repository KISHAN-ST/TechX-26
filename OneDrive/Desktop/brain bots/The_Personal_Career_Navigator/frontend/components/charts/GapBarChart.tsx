// frontend/components/charts/GapBarChart.tsx
'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface GapBarChartProps {
  data: Array<{ skill: string; gap_score: number }>
}

export default function GapBarChart({ data }: GapBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="skill" stroke="#9CA3AF" angle={-45} textAnchor="end" height={100} />
        <YAxis stroke="#9CA3AF" />
        <Tooltip
          contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
          labelStyle={{ color: '#F9FAFB' }}
        />
        <Bar dataKey="gap_score" fill="#EF4444" />
      </BarChart>
    </ResponsiveContainer>
  )
}