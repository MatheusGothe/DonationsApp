// validators/donationPoint.ts

interface DonationFormData {
    name: string;
    address: string;
    type: string;
    description: string;
    contactInfo: string;
    latitude: number;
    longitude: number;
    period: string
  }
  
  export const validateDonationPoint = (data: DonationFormData): string | null => {

  
    if (data.latitude === 0 || data.longitude === 0) {
      return "Selecione um ponto no mapa.";
    }
  
    const phoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/; // Ex: (27) 99999-0000
    if (!phoneRegex.test(data.contactInfo)) {
      return "Contato inválido. Use o formato (XX) XXXXX-XXXX.";
    }
    
    if(data.period == null || data.period == ""){
      return "Por favor, informe um turno de funcionamento.";
    }
  
    return null;
  };
  