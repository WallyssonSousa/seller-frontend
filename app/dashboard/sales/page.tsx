"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, ShoppingCart, Loader2, Package, Calendar, DollarSign } from "lucide-react"
import { api } from "@/lib/api"
import { SaleDialog } from "@/components/sale-dialog"

interface Sale {
  id: number
  product_id: number
  product_name?: string
  quantity: number
  total_price?: number
  sale_date?: string
  seller_name?: string
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [filteredSales, setFilteredSales] = useState<Sale[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    loadSales()
  }, [])

  useEffect(() => {
    const filtered = sales.filter(
      (sale) =>
        sale.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sale.seller_name?.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredSales(filtered)
  }, [searchQuery, sales])

  const loadSales = async () => {
    setIsLoading(true)
    const response = await api.getSales()
    if (response.data) {
      setSales(response.data)
      setFilteredSales(response.data)
    }
    setIsLoading(false)
  }

  const handleCreate = () => {
    setDialogOpen(true)
  }

  const handleDialogClose = (refresh?: boolean) => {
    setDialogOpen(false)
    if (refresh) {
      loadSales()
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Data não disponível"
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <h1 className="text-4xl font-semibold tracking-tight">Vendas</h1>
              <p className="text-muted-foreground">Gerencie e acompanhe todas as vendas realizadas</p>
            </div>
            <Button onClick={handleCreate} className="gap-2 transition-all hover:scale-105">
              <Plus className="h-4 w-4" />
              Nova Venda
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por produto ou seller..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Sales List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredSales.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhuma venda encontrada</h3>
                <p className="text-sm text-muted-foreground mb-4">Comece registrando sua primeira venda</p>
                <Button onClick={handleCreate} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Criar Venda
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredSales.map((sale, index) => (
                <Card
                  key={sale.id}
                  className="border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg group"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <CardHeader>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <ShoppingCart className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg line-clamp-1">
                            Venda #{sale.id.toString().padStart(4, "0")}
                          </CardTitle>
                          <CardDescription className="line-clamp-1">
                            {sale.product_name || `Produto ID: ${sale.product_id}`}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="default" className="shrink-0 w-fit">
                        Concluída
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Quantidade</p>
                          <p className="font-medium">{sale.quantity} unidades</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Valor Total</p>
                          <p className="font-medium">
                            {sale.total_price
                              ? new Intl.NumberFormat("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                }).format(sale.total_price)
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Data</p>
                          <p className="font-medium text-sm">{formatDate(sale.sale_date)}</p>
                        </div>
                      </div>
                      {sale.seller_name && (
                        <div className="flex items-center gap-3">
                          <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Seller</p>
                            <p className="font-medium text-sm truncate">{sale.seller_name}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <SaleDialog open={dialogOpen} onClose={handleDialogClose} />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
