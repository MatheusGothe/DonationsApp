// validators/donationPoint.ts

interface DonationFormData {
  name: string;
  address: string;
  type: string;
  description: string;
  contactInfo: string;
  openingHourStart: string;
  openingHourEnd: string;
  openingDays: string[];
  latitude: number;
  longitude: number;
  period: string;
}

export const validateDonationPoint = (
  data: DonationFormData
): string | null => {
  const [startHour, startMinute] = data.openingHourStart.split(":").map(Number);
  const [endHour, endMinute] = data.openingHourEnd.split(":").map(Number);

  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;

  if (!data.openingDays || data.openingDays.length === 0) {
    return "Informe pelo menos um dia de funcionamento.";
  }

  if (data.latitude === 0 || data.longitude === 0) {
    return "Selecione um ponto no mapa.";
  }

  const phoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/; // Ex: (27) 99999-0000
  if (!phoneRegex.test(data.contactInfo)) {
    return "Contato inválido. Use o formato (XX) XXXXX-XXXX.";
  }

  if (startTotalMinutes >= endTotalMinutes) {
    return "O horário inicial deve ser anterior ao horário final.";
  }

  return null;
};
