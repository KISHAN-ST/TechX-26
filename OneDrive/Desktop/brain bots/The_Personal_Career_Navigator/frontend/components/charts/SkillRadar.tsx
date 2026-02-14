// frontend/components/charts/SkillRadar.tsx
'use client'

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'

interface SkillRadarProps {
  data: Array<{ skill: string; user_level: number; importance: number }>
}

export default function SkillRadar({ data }: SkillRadarProps) {
  const chartData = data.map(item => ({
    skill: item.skill,
    userLevel: item.user_level * 100,
    importance: item.importance * 100
  }))

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart data={chartData}>
        <PolarGrid stroke="#374151" />
        <PolarAngleAxis dataKey="skill" stroke="#9CA3AF" />
        <PolarRadiusAxis stroke="#9CA3AF" />
        <Radar name="Your Level" dataKey="userLevel" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
        <Radar name="Required" dataKey="importance" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
      </RadarChart>
    </ResponsiveContainer>
  )
}