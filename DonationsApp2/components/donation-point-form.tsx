"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useDonationPoints, type DonationType } from "./donation-point-context"
import { Info, Loader2, MapPin } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface DonationPointFormProps {
  onComplete: () => void
}

export default function DonationPointForm({ onComplete }: DonationPointFormProps) {
  const { addDonationPoint } = useDonationPoints()
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    type: "food" as DonationType,
    description: "",
    contactInfo: "",
    latitude: 0,
    longitude: 0,
    openingHours: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value as DonationType }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Se a localização não foi definida, use coordenadas aleatórias
    if (formData.latitude === 0 && formData.longitude === 0) {
      // Random coordinates near São Paulo
      const randomLat = -23.55 + (Math.random() - 0.5) * 0.1
      const randomLng = -46.63 + (Math.random() - 0.5) * 0.1

      addDonationPoint({
        ...formData,
        latitude: randomLat,
        longitude: randomLng,
      })
    } else {
      // Use as coordenadas obtidas
      addDonationPoint(formData)
    }

    onComplete()
    toast({
      title: "Ponto de doação adicionado",
      description: "O novo ponto de doação foi adicionado com sucesso!",
      duration: 3000,
    })
  }

  // Função para simular obtenção de localização
  const simulateLocation = (label: string) => {
    setIsGettingLocation(true)

    // Simular um pequeno atraso para parecer que está obtendo a localização
    setTimeout(() => {
      // Gerar coordenadas aleatórias próximas a São Paulo
      const simulatedLat = -23.55 + (Math.random() - 0.5) * 0.05
      const simulatedLng = -46.63 + (Math.random() - 0.5) * 0.05

      setFormData((prev) => ({ ...prev, latitude: simulatedLat, longitude: simulatedLng }))
      setIsGettingLocation(false)

      toast({
        title: "Localização simulada",
        description: `Uma ${label.toLowerCase()} simulada em São Paulo foi adicionada ao formulário.`,
        duration: 3000,
      })
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Local</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Endereço</Label>
        <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
      </div>

      <div className="space-y-2">
        <Label>Tipo de Doação</Label>
        <RadioGroup value={formData.type} onValueChange={handleTypeChange} className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="food" id="food" />
            <Label htmlFor="food">Comida</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="clothes" id="clothes" />
            <Label htmlFor="clothes">Roupas</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="both" id="both" />
            <Label htmlFor="both">Ambos</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactInfo">Informações de Contato</Label>
        <Input id="contactInfo" name="contactInfo" value={formData.contactInfo} onChange={handleChange} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="openingHours">Horário de Funcionamento</Label>
        <Input id="openingHours" name="openingHours" value={formData.openingHours} onChange={handleChange} required />
      </div>

      <div className="space-y-2">
        <Label>Localização</Label>

        <Alert className="mb-2">
          <Info className="h-4 w-4" />
          <AlertTitle>Modo de Simulação</AlertTitle>
          <AlertDescription>
            A geolocalização real está desativada neste ambiente. Use os botões abaixo para simular uma localização.
          </AlertDescription>
        </Alert>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            onClick={() => simulateLocation("sua localização")}
            variant="outline"
            className="flex items-center gap-2"
            disabled={isGettingLocation}
          >
            {isGettingLocation ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Simulando...
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4" />
                Simular minha localização
              </>
            )}
          </Button>

          <Button
            type="button"
            onClick={() => simulateLocation("localização aleatória")}
            variant="outline"
            className="flex items-center gap-2 bg-purple-100 hover:bg-purple-200 border-purple-300"
            disabled={isGettingLocation}
          >
            <MapPin className="h-4 w-4 text-purple-600" />
            Simular outro local
          </Button>

          {formData.latitude !== 0 && formData.longitude !== 0 && (
            <span className="text-xs text-green-600">Localização definida!</span>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onComplete}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-green-600 hover:bg-green-700">
          Salvar
        </Button>
      </div>
    </form>
  )
}
