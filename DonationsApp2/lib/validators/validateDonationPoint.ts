// validators/donationPoint.ts

interface DonationFormData {
    name: string;
    address: string;
    type: string;
    description: string;
    contactInfo: string;
    latitude: number;
    longitude: number;
    openingHours: string;
  }
  
  export const validateDonationPoint = (data: DonationFormData): string | null => {

  
    if (data.latitude === 0 || data.longitude === 0) {
      return "Selecione um ponto no mapa.";
    }
  
    const phoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/; // Ex: (27) 99999-0000
    if (!phoneRegex.test(data.contactInfo)) {
      return "Contato inválido. Use o formato (XX) XXXXX-XXXX.";
    }
  
    const openingHoursRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s?-\s?([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!openingHoursRegex.test(data.openingHours)) {
      return "Horário inválido. Use o formato HH:MM - HH:MM.";
    }
  
    return null;
  };
  