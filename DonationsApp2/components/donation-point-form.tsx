"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DonationPoint, useDonationPoints, type DonationType } from "./donation-point-context";
import { Clock, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { FormMessage } from "./formMessage";
import { validateDonationPoint } from "@/lib/validators/validateDonationPoint";
import { IMaskInput } from "react-imask";
import makeAnimated from "react-select/animated";
import OpeningDaysSelect from "./openingDaysSelect";
import LocationInfo from "./locationInfo";
import lottieJson from "@/public/Animations/loadingAnimation.json";
import dynamic from "next/dynamic";

// importa Lottie de forma dinâmica (sem SSR)
const Lottie = dynamic(() => import("react-lottie-player"), { ssr: false });

interface DonationPointFormProps {
  onComplete: () => void;
  isEditing?: boolean;
}
export default function DonationPointForm({
  onComplete,isEditing, 
}: DonationPointFormProps) {
  const { addDonationPoint, setSelectingLocation,setSelectedLocation, selectedLocation, pointToEdit,editDonationPoint } =
    useDonationPoints();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
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
    openingHourStart: "", // novo campo
    openingHourEnd: "", // novo campo
    errors: null,
  });

  useEffect(() => {

    if (isEditing && pointToEdit) {
      setFormData({
        name: pointToEdit.name,
        address: pointToEdit.address,
        type: pointToEdit.type,
        description: pointToEdit.description,
        contactInfo: pointToEdit.contactInfo,
        latitude: pointToEdit.latitude,
        longitude: pointToEdit.longitude,
        openingDays: pointToEdit.openingDays || [],
        openingHourStart: pointToEdit.openingHourStart || "",
        openingHourEnd: pointToEdit.openingHourEnd || "",
        period: pointToEdit.period || "",
        errors: null,
      });
      setSelectedLocation({lat: pointToEdit?.latitude,lng: pointToEdit?.longitude});
    }
  }, [isEditing, pointToEdit]);  



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
    setLoading(true);
    const success = isEditing
    ? await editDonationPoint(pointToEdit.id, pointData) // <- importante: passar o id corretamente
    : await addDonationPoint(pointData);
    setLoading(false);
    if (success) {
      isEditing ? toast({ title: "Ponto atualizdo com sucesso!" }) : toast({ title: "Ponto adicionado com sucesso!" });
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

     toast({
      title: "Por favor clique em algum local do mapa",
      variant: "default",
      duration: 3000,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-4 ">
      {" "}
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
        mask={[
          {
            mask: "(00) 0000-0000", // fixo
          },
          {
            mask: "(00) 00000-0000", // celular
          },
        ]}     
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
      <label className="text-sm font-medium text-gray-700">
        Horário de Funcionamento
      </label>
      <div className="flex flex-row justify-between">
        <Input
          type="time"
          name="openingHourStart"
          value={formData.openingHourStart}
          onChange={handleChange}
          required
          className="w-[40%] ml-0"
        />
        <div className="flex align-center justify-center">
          <span className="self-center">até</span>
        </div>
        <Input
          type="time"
          name="openingHourEnd"
          value={formData.openingHourEnd}
          onChange={handleChange}
          required
          className="w-[40%]"
        />
      </div>
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
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex h-full items-center justify-center z-[9999]">
          <Lottie
            loop
            animationData={lottieJson}
            play
            style={{ width: 150, height: 150 }}
          />
        </div>
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
