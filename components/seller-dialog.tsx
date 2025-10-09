"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { api } from "@/lib/api"

interface Seller {
  id: number
  name: string
  cnpj: string
  email: string
  celular: string
}

interface SellerDialogProps {
  open: boolean
  onClose: (refresh?: boolean) => void
  seller: Seller | null
}

export function SellerDialog({ open, onClose, seller }: SellerDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    cnpj: "",
    email: "",
    celular: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (seller) {
      setFormData({
        name: seller.name,
        cnpj: seller.cnpj,
        email: seller.email,
        celular: seller.celular,
        password: "",
      })
    } else {
      setFormData({
        name: "",
        cnpj: "",
        email: "",
        celular: "",
        password: "",
      })
    }
    setError("")
  }, [seller, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!seller) {
      setError("Não é possível criar sellers por aqui")
      setIsLoading(false)
      return
    }

    const payload: any = {
      name: formData.name,
      cnpj: formData.cnpj,
      email: formData.email,
      celular: formData.celular,
    }

    if (formData.password) {
      payload.password = formData.password
    }

    const response = await api.updateSeller(seller.id, payload)

    if (response.error) {
      setError(response.error)
      setIsLoading(false)
    } else {
      setIsLoading(false)
      onClose(true)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Seller</DialogTitle>
          <DialogDescription>Atualize as informações do seller</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Loja</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Minha Loja"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input
              id="cnpj"
              value={formData.cnpj}
              onChange={(e) => handleChange("cnpj", e.target.value)}
              placeholder="00.000.000/0000-00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="seller@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="celular">Celular</Label>
            <Input
              id="celular"
              value={formData.celular}
              onChange={(e) => handleChange("celular", e.target.value)}
              placeholder="(11) 99999-9999"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Nova Senha (opcional)</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Deixe em branco para manter a atual"
            />
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg animate-in fade-in">{error}</div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onClose()} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Atualizar"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
