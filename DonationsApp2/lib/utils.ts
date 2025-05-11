import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const diasDaSemana = [
  { label: "Segunda-feira", value: "Segunda-feira" },
  { label: "Terça-feira", value: "Terça-feira" },
  { label: "Quarta-feira", value: "Quarta-feira" },
  { label: "Quinta-feira", value: "Quinta-feira" },
  { label: "Sexta-feira", value: "Sexta-feira" },
  { label: "Sábado", value: "Sábado" },
  { label: "Domingo", value: "Domingo" },
];
