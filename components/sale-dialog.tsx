"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { api } from "@/lib/api"

interface Product {
  id: number
  nome: string
  preco: number
  quantidade: number
  status: string
}

interface SaleDialogProps {
  open: boolean
  onClose: (refresh?: boolean) => void
}

export function SaleDialog({ open, onClose }: SaleDialogProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProductId, setSelectedProductId] = useState("")
  const [quantity, setQuantity] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (open) {
      loadProducts()
      setSelectedProductId("")
      setQuantity("")
      setError("")
    }
  }, [open])

  const loadProducts = async () => {
    setIsLoadingProducts(true)
    const response = await api.getProducts()
    if (response.data) {
      // Filter only active products with stock
      const activeProducts = response.data.filter((p: Product) => p.status === "Active" && p.quantidade > 0)
      setProducts(activeProducts)
    }
    setIsLoadingProducts(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const selectedProduct = products.find((p) => p.id.toString() === selectedProductId)
    if (!selectedProduct) {
      setError("Selecione um produto válido")
      return
    }

    const qty = Number.parseInt(quantity)
    if (qty > selectedProduct.quantidade) {
      setError(`Estoque insuficiente. Disponível: ${selectedProduct.quantidade} unidades`)
      return
    }

    setIsLoading(true)

    const response = await api.createSale({
      product_id: Number.parseInt(selectedProductId),
      quantity: qty,
    })

    if (response.error) {
      setError(response.error)
      setIsLoading(false)
    } else {
      setIsLoading(false)
      onClose(true)
    }
  }

  const selectedProduct = products.find((p) => p.id.toString() === selectedProductId)

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Venda</DialogTitle>
          <DialogDescription>Selecione o produto e a quantidade para registrar a venda</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product">Produto</Label>
            {isLoadingProducts ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent>
                  {products.length === 0 ? (
                    <div className="p-4 text-sm text-muted-foreground text-center">Nenhum produto disponível</div>
                  ) : (
                    products.map((product) => (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        {product.nome} - {product.quantidade} em estoque
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          </div>

          {selectedProduct && (
            <div className="p-4 rounded-lg bg-muted/50 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Preço unitário:</span>
                <span className="font-medium">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(selectedProduct.preco)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estoque disponível:</span>
                <span className="font-medium">{selectedProduct.quantidade} unidades</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={selectedProduct?.quantidade || 999}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="1"
              required
              disabled={!selectedProductId}
            />
          </div>

          {selectedProduct && quantity && Number.parseInt(quantity) > 0 && (
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex justify-between items-center">
                <span className="font-medium">Valor Total:</span>
                <span className="text-2xl font-semibold">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(selectedProduct.preco * Number.parseInt(quantity))}
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg animate-in fade-in">{error}</div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onClose()} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !selectedProductId || !quantity} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                "Confirmar Venda"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
