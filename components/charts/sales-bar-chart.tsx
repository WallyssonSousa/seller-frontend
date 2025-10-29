"use client"

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, Legend } from "recharts"

interface SaleChartData {
  name: string
  total: number
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-4">
        <p className="font-semibold text-foreground mb-2">{label}</p>
        <p className="text-sm text-muted-foreground">
          Receita:{" "}
          <span className="font-bold text-blue-600 dark:text-blue-400">{`R$ ${payload[0].value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}</span>
        </p>
      </div>
    )
  }
  return null
}

export function SalesBarChart({ data }: { data: SaleChartData[] }) {
  const maxValue = Math.max(...data.map((d) => d.total))

  const getBarColor = (value: number) => {
    const intensity = value / maxValue
    // Gradiente de azul claro para azul escuro
    const lightBlue = { r: 96, g: 165, b: 250 } // #60a5fa (blue-400)
    const darkBlue = { r: 30, g: 64, b: 175 } // #1e40af (blue-800)

    const r = Math.round(lightBlue.r + (darkBlue.r - lightBlue.r) * intensity)
    const g = Math.round(lightBlue.g + (darkBlue.g - lightBlue.g) * intensity)
    const b = Math.round(lightBlue.b + (darkBlue.b - lightBlue.b) * intensity)

    return `rgb(${r}, ${g}, ${b})`
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#93c5fd" strokeOpacity={0.2} vertical={false} />

        <XAxis
          dataKey="name"
          tick={{ fill: "currentColor", fontSize: 12 }}
          className="text-foreground"
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis
          tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`}
          tick={{ fill: "currentColor", fontSize: 12 }}
          className="text-foreground"
          width={80}
        />

        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(59, 130, 246, 0.1)" }} />

        <Legend
          wrapperStyle={{
            paddingTop: "20px",
          }}
          iconType="circle"
          formatter={(value) => <span className="text-foreground text-sm font-medium">Receita Total</span>}
        />

        <Bar dataKey="total" radius={[8, 8, 0, 0]} animationDuration={800} animationBegin={0}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getBarColor(entry.total)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
