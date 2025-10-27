"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Package, Loader2 } from "lucide-react"
import { api } from "@/lib/api"
import { ProductDialog } from "@/components/product-dialog"

interface Product {
  id: number
  nome: string
  preco: number
  quantidade: number
  status: string
  image?: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    const filtered = products.filter((product) => product.nome.toLowerCase().includes(searchQuery.toLowerCase()))
    setFilteredProducts(filtered)
  }, [searchQuery, products])

  const loadProducts = async () => {
    setIsLoading(true)
    const response = await api.getProducts()

    const data = response.data 

    const productsArray = Array.isArray(data) ? data : Array.isArray(data?.products) ? data.products : []

    setProducts(productsArray)
    setFilteredProducts(productsArray)
    setIsLoading(false)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja inativar este produto?")) {
      await api.inactivateProduct(id)
      loadProducts()
    }
  }

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setDialogOpen(true)
  }

  const handleCreate = () => {
    setSelectedProduct(null)
    setDialogOpen(true)
  }

  const handleDialogClose = (refresh?: boolean) => {
    setDialogOpen(false)
    setSelectedProduct(null)
    if (refresh) {
      loadProducts()
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <h1 className="text-4xl font-semibold tracking-tight">Produtos</h1>
              <p className="text-muted-foreground">Gerencie seu catálogo de produtos</p>
            </div>
            <Button onClick={handleCreate} className="gap-2 transition-all hover:scale-105">
              <Plus className="h-4 w-4" />
              Novo Produto
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produtos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum produto encontrado</h3>
                <p className="text-sm text-muted-foreground mb-4">Comece criando seu primeiro produto</p>
                <Button onClick={handleCreate} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Criar Produto
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product, index) => (
                <Card
                  key={product.id}
                  className="border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg group overflow-hidden"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {product.image && (
                    <div className="aspect-video w-full overflow-hidden bg-muted">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.nome}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg line-clamp-1">{product.nome}</CardTitle>
                      <Badge variant={product.status === "Active" ? "default" : "secondary"} className="shrink-0">
                        {product.status === "Active" ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <CardDescription>Estoque: {product.quantidade} unidades</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-semibold">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(product.preco)}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(product)}
                          className="hover:bg-accent transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(product.id)}
                          className="hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <ProductDialog open={dialogOpen} onClose={handleDialogClose} product={selectedProduct} />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
