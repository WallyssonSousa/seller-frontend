"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, TrendingUp, ArrowUpRight, ArrowDownRight, DollarSign, Award } from "lucide-react"
import { api } from "@/lib/api"
import { SalesBarChart } from "@/components/charts/sales-bar-chart"
import { SalesLineChart } from "@/components/charts/sales-line-chart"

interface Sale {
  id: number
  created_at: string
  price: number
  product_id: number
  product_nome: string
  quantity: number
  seller_id: number
  seller_name: string
}

export default function DashboardPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSales() {
      setLoading(true)
      const response = await api.getSales()
      if (response.data?.sales) {
        setSales(response.data.sales)
      }
      setLoading(false)
    }
    loadSales()
  }, [])

  const totalVendas = sales.reduce((acc, s) => acc + s.quantity, 0)
  const receitaTotal = sales.reduce((acc, s) => acc + s.price * s.quantity, 0)

  const crescimentoSimulado = 12.5

  const chartData = Object.values(
    sales.reduce((acc: any, sale) => {
      if (!acc[sale.product_nome]) {
        acc[sale.product_nome] = { name: sale.product_nome, total: 0 }
      }
      acc[sale.product_nome].total += sale.price * sale.quantity
      return acc
    }, {}),
  )

  const produtoMaisVendido = chartData.sort((a: any, b: any) => b.total - a.total)[0]

  const stats = [
    {
      title: "Receita Total",
      value: `R$ ${receitaTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      description: "Receita acumulada no período",
      icon: DollarSign,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      title: "Produtos Ativos",
      value: new Set(sales.map((s) => s.product_id)).size.toString(),
      description: "Produtos com vendas",
      icon: Package,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
    },
    {
      title: "Média por Produto",
      value: `R$ ${(receitaTotal / Math.max(new Set(sales.map((s) => s.product_id)).size, 1)).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      description: "Receita média por produto",
      icon: TrendingUp,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/30",
    },
    {
      title: "Produto Mais Vendido",
      value: produtoMaisVendido?.name || "N/A",
      description: `R$ ${(produtoMaisVendido?.total || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      icon: Award,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/30",
    },
  ]

  const lineData = Object.values(
    sales.reduce((acc: any, sale) => {
      const date = new Date(sale.created_at).toLocaleDateString("pt-BR")
      if (!acc[date]) acc[date] = { date, total: 0 }
      acc[date].total += sale.price * sale.quantity
      return acc
    }, {}),
  )

  const topProdutos = chartData.sort((a: any, b: any) => b.total - a.total).slice(0, 5)

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-muted-foreground mt-2">Análise completa de vendas e performance</p>
              </div>
              <Badge variant="outline" className="text-sm px-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  Dados em tempo real
                </div>
              </Badge>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              

              return (
                <Card
                  key={index}
                  className="border-border/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 group"
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                    <div className={`p-2 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold tracking-tight line-clamp-1">{stat.value}</div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">{stat.description}</p>
                        <div
                          className={`flex items-center gap-1 text-xs font-medium`}
                        >
                        </div>
                    </div>
                    {}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="border-border/50 shadow-md hover:shadow-xl transition-shadow duration-300 lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold">Vendas por Produto</CardTitle>
                    <CardDescription className="mt-1">Distribuição de receita por produto vendido</CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {chartData.length} produtos
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                {loading ? (
                  <div className="flex items-center justify-center h-[350px]">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
                      <p className="text-sm text-muted-foreground font-medium">Carregando dados...</p>
                    </div>
                  </div>
                ) : (
                  <SalesBarChart data={chartData} />
                )}
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-md hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Top 5 Produtos</CardTitle>
                <CardDescription className="mt-1">Produtos mais vendidos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProdutos.map((produto: any, index: number) => (
                    <div key={index} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold text-sm group-hover:scale-110 transition-transform">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-sm line-clamp-1">{produto.name}</p>
                          <p className="text-xs text-muted-foreground">
                            R$ {produto.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                      <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/50 shadow-md hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold">Evolução de Receita</CardTitle>
                  <CardDescription className="mt-1">
                    Acompanhe o crescimento da receita ao longo do tempo
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {lineData.length} dias
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {loading ? (
                <div className="flex items-center justify-center h-[350px]">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
                    <p className="text-sm text-muted-foreground font-medium">Carregando dados...</p>
                  </div>
                </div>
              ) : (
                <SalesLineChart data={lineData} />
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
