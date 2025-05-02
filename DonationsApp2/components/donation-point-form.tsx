"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useDonationPoints, type DonationType } from "./donation-point-context";
import { MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface DonationPointFormProps {
  onComplete: () => void;
}

export default function DonationPointForm({ onComplete }: DonationPointFormProps) {
  const { addDonationPoint, setSelectingLocation, selectedLocation } = useDonationPoints();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    type: "food" as DonationType,
    description: "",
    contactInfo: "",
    latitude: 0,
    longitude: 0,
    openingHours: "",
  });

  useEffect(() => {
    if (selectedLocation) {
      setFormData((prev) => ({
        ...prev,
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
      }));
    }
  }, [selectedLocation]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDonationPoint(formData);
    toast({ title: "Ponto adicionado com sucesso!" });
    onComplete();
  };

  const handleSelectLocation = () => {
    toast({ title: "Clique no mapa para selecionar a localização." });
    setSelectingLocation(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="name" placeholder="Nome do local" value={formData.name} onChange={handleChange} required />
      <Input name="address" placeholder="Endereço" value={formData.address} onChange={handleChange} required />
      
      <RadioGroup value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val as DonationType })}>
        {["food", "clothes", "both"].map((type) => (
          <div key={type} className="flex items-center space-x-2">
            <RadioGroupItem value={type} id={type} />
            <label htmlFor={type}>{type === "food" ? "Comida" : type === "clothes" ? "Roupas" : "Ambos"}</label>
          </div>
        ))}
      </RadioGroup>

      <Textarea name="description" placeholder="Descrição" value={formData.description} onChange={handleChange} required />
      <Input name="contactInfo" placeholder="Contato" value={formData.contactInfo} onChange={handleChange} required />
      <Input name="openingHours" placeholder="Horário de funcionamento" value={formData.openingHours} onChange={handleChange} required />

      <Button type="button" onClick={handleSelectLocation} className="flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Selecionar Localização no Mapa
      </Button>

      {formData.latitude !== 0 && formData.longitude !== 0 && (
        <p className="text-xs text-green-600">Localização selecionada: {formData.latitude.toFixed(5)}, {formData.longitude.toFixed(5)}</p>
      )}

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onComplete}>Cancelar</Button>
        <Button type="submit" className="bg-green-600 hover:bg-green-700">Salvar</Button>
      </div>
    </form>
  );
}
