
"use client"

import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart, Legend } from "recharts"

interface SaleLineData {
  date: string
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

export function SalesLineChart({ data }: { data: SaleLineData[] }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
        <defs>
          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#93c5fd" strokeOpacity={0.2} vertical={false} />

        <XAxis
          dataKey="date"
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

        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#3b82f6", strokeWidth: 2, strokeDasharray: "5 5" }} />

        <Legend
          wrapperStyle={{
            paddingTop: "20px",
          }}
          iconType="line"
          formatter={(value) => <span className="text-foreground text-sm font-medium">Receita ao Longo do Tempo</span>}
        />

        <Area
          type="monotone"
          dataKey="total"
          stroke="#2563eb"
          strokeWidth={3}
          fill="url(#colorTotal)"
          animationDuration={800}
          dot={{
            fill: "#3b82f6",
            strokeWidth: 2,
            stroke: "#ffffff",
            r: 4,
          }}
          activeDot={{
            r: 6,
            fill: "#2563eb",
            stroke: "#ffffff",
            strokeWidth: 3,
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
