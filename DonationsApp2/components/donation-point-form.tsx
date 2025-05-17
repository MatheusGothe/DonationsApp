"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useDonationPoints, type DonationType } from "./donation-point-context";
import { MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { FormMessage } from "./formMessage";
import { validateDonationPoint } from "@/lib/validators/validateDonationPoint";
import { IMaskInput } from "react-imask";
import makeAnimated from "react-select/animated";
import OpeningDaysSelect from "./openingDaysSelect";
import LocationInfo from "./locationInfo";

interface DonationPointFormProps {
  onComplete: () => void;
}

export default function DonationPointForm({
  onComplete,
}: DonationPointFormProps) {
  const { addDonationPoint, setSelectingLocation, selectedLocation } =
    useDonationPoints();
  const { toast } = useToast();
  const animatedComponents = makeAnimated();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    type: "food" as DonationType,
    description: "",
    contactInfo: "",
    latitude: 0,
    longitude: 0,
    openingDays: [],
    period: "", // Novo campo para o período
    errors: null,
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateDonationPoint(formData);
    if (validationError) {
      setFormData({ ...formData, errors: validationError });
      setTimeout(() => setFormData({ ...formData, errors: null }), 3000);
      return;
    }
   
    const { errors, ...pointData } = formData;
    const success = await addDonationPoint(pointData);
    if (success) {
      toast({ title: "Ponto adicionado com sucesso!" });
      onComplete();
    } else {
      setFormData({
        ...formData,
        errors: "Erro ao salvar ponto. Tente novamente.",
      });
    }
    // toast({ title: "Ponto adicionado com sucesso!" });
    //  onComplete();
  };

  const handleSelectLocation = () => {
    setSelectingLocation(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="name"
        placeholder="Nome do local"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <Input
        name="address"
        placeholder="Endereço"
        value={formData.address}
        onChange={handleChange}
        required
      />

      <RadioGroup
        value={formData.type}
        onValueChange={(val) =>
          setFormData({ ...formData, type: val as DonationType })
        }
      >
        {["food", "clothes", "both"].map((type) => (
          <div key={type} className="flex items-center space-x-2">
            <RadioGroupItem value={type} id={type} />
            <label htmlFor={type}>
              {type === "food"
                ? "Comida"
                : type === "clothes"
                ? "Roupas"
                : "Ambos"}
            </label>
          </div>
        ))}
      </RadioGroup>

      <Textarea
        name="description"
        placeholder="Descrição"
        value={formData.description}
        onChange={handleChange}
        required
      />
      <IMaskInput
        mask="(00) 00000-0000"
        name="contactInfo"
        placeholder="Contato"
        value={formData.contactInfo}
        onChange={handleChange}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        required
      />
      <OpeningDaysSelect
        value={formData.openingDays}
        onChange={(values) => setFormData({ ...formData, openingDays: values })}
      />

      {/* Novo campo para o período de funcionamento */}
      <RadioGroup
        value={formData.period}
        onValueChange={(val) => setFormData({ ...formData, period: val })}
      >
        {["matutino", "vespertino", "ambos"].map((period) => (
          <div key={period} className="flex items-center space-x-2">
            <RadioGroupItem value={period} id={period} />
            <label htmlFor={period}>
              {period === "matutino"
                ? "Matutino"
                : period === "vespertino"
                ? "Vespertino"
                : "Ambos"}
            </label>
          </div>
        ))}
      </RadioGroup>

      <Button
        type="button"
        onClick={handleSelectLocation}
        className="flex text-xs w-full p-2 items-center gap-2"
      >
        <MapPin className="h-4 w-4" />
        Selecionar Localização no Mapa
      </Button>

      {formData.latitude !== 0 && formData.longitude !== 0 && (
        <LocationInfo
          latitude={formData.latitude}
          longitude={formData.longitude}
        />
      )}

      {formData.errors && (
        <FormMessage message={formData.errors} error={true} />
      )}

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onComplete}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-green-600 hover:bg-green-700">
          Salvar
        </Button>
      </div>
    </form>
  );
}
