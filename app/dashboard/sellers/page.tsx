"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Edit, UsersIcon, Loader2, Mail, Phone, Building2 } from "lucide-react"
import { api } from "@/lib/api"
import { SellerDialog } from "@/components/seller-dialog"
import { maskCNPJ, maskPhone } from "@/utils/masks"

interface Seller {
  id: number
  name: string
  cnpj: string
  email: string
  celular: string
  status?: string
}

export default function SellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([])
  const [filteredSellers, setFilteredSellers] = useState<Seller[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null)

  useEffect(() => {
    loadSellers()
  }, [])

  useEffect(() => {
    const filtered = sellers.filter(
      (seller) =>
        seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seller.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seller.cnpj.includes(searchQuery),
    )
    setFilteredSellers(filtered)
  }, [searchQuery, sellers])

  const loadSellers = async () => {
    setIsLoading(true)
    const response = await api.getSellers()
    if (response.data?.users) {
      setSellers(response.data.users)
      setFilteredSellers(response.data.users)
    } else {
      setSellers([])
      setFilteredSellers([])
    }
    setIsLoading(false)
  }

  const handleEdit = (seller: Seller) => {
    setSelectedSeller(seller)
    setDialogOpen(true)
  }

  const handleDialogClose = (refresh?: boolean) => {
    setDialogOpen(false)
    setSelectedSeller(null)
    if (refresh) {
      loadSellers()
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <h1 className="text-4xl font-semibold tracking-tight">Sellers</h1>
              <p className="text-muted-foreground">Gerencie os sellers cadastrados no sistema</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email ou CNPJ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Sellers Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredSellers.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <UsersIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum seller encontrado</h3>
                <p className="text-sm text-muted-foreground">Aguarde novos cadastros de sellers</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredSellers.map((seller, index) => (
                <Card
                  key={seller.id}
                  className="border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg group"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <UsersIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg line-clamp-1">{seller.name}</CardTitle>
                          <CardDescription className="line-clamp-1">{maskCNPJ(seller.cnpj)}</CardDescription>
                        </div>
                      </div>
                      <Badge
                        className={`shrink-0 ${seller.status
                            ? "bg-green-500 text-white hover:bg-green-600"   
                            : "bg-gray-400 text-white hover:bg-gray-500"     
                          }`}
                      >
                        {seller.status ? "Ativo" : "Inativo"}
                      </Badge>

                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4 shrink-0" />
                        <span className="truncate">{seller.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4 shrink-0" />
                        <span>{maskPhone(seller.celular)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="h-4 w-4 shrink-0" />
                        <span className="truncate">{maskCNPJ(seller.cnpj)}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full gap-2 hover:bg-accent transition-colors bg-transparent"
                      onClick={() => handleEdit(seller)}
                    >
                      <Edit className="h-4 w-4" />
                      Editar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <SellerDialog open={dialogOpen} onClose={handleDialogClose} seller={selectedSeller} />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
