"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Users, ShoppingCart, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Total de Produtos",
    value: "0",
    description: "Produtos cadastrados",
    icon: Package,
    trend: "+0%",
  },
  {
    title: "Sellers Ativos",
    value: "0",
    description: "Sellers verificados",
    icon: Users,
    trend: "+0%",
  },
  {
    title: "Vendas do Mês",
    value: "0",
    description: "Vendas realizadas",
    icon: ShoppingCart,
    trend: "+0%",
  },
  {
    title: "Receita Total",
    value: "R$ 0,00",
    description: "Receita acumulada",
    icon: TrendingUp,
    trend: "+0%",
  },
]

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Visão geral do seu sistema de vendas</p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card
                  key={stat.title}
                  className="border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg group"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-semibold tracking-tight">{stat.value}</div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">{stat.description}</p>
                      <span className="text-xs font-medium text-green-600 dark:text-green-400">{stat.trend}</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Welcome Card */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Bem-vindo ao Seller</CardTitle>
              <CardDescription>
                Sistema completo de gestão de vendas, produtos e sellers com design moderno e intuitivo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Produtos</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Gerencie seu catálogo de produtos com facilidade</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Sellers</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Controle completo dos sellers cadastrados</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Vendas</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Acompanhe todas as vendas em tempo real</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
