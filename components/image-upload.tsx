"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface ImageUploadProps {
  value?: string
  onChange: (val: string) => void
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState(value || "")

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      setPreview(base64)
      onChange(base64) 
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-2">
      <Label>Imagem do Produto</Label>

      {preview && (
        <div className="relative w-32 h-32 rounded-md overflow-hidden border border-border">
          <Image src={preview} alt="Preview" fill className="object-cover" />
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <Button type="button" variant="outline" onClick={handleFileSelect}>
        {preview ? "Trocar imagem" : "Selecionar imagem"}
      </Button>
    </div>
  )
}
