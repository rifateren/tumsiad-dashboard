"use client"

import { Radar, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface RadarChartProps {
  title: string
  description?: string
  data: any[]
}

export function RadarChart({ title, description, data }: RadarChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <RechartsRadarChart data={data}>
            <PolarGrid stroke="hsl(var(--muted-foreground))" opacity={0.3} />
            <PolarAngleAxis dataKey="category" className="text-xs" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '6px',
                color: '#000',
              }}
            />
            <Legend />
            <Radar name="TÜMSİAD" dataKey="tumsiad" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
            <Radar name="MÜSİAD" dataKey="musiad" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
            <Radar name="ASKON" dataKey="askon" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
