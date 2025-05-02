import { MapPin, Utensils, Shirt, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDonationPoints, type DonationPoint } from "./donation-point-context"

interface DonationPointListProps {
  points: DonationPoint[]
}

export default function DonationPointList({ points }: DonationPointListProps) {
  const { setPointClicked } = useDonationPoints();  // Pegando o contexto
  const handleCardClick = (point: DonationPoint) => {
    console.log('clicou')
    setPointClicked(point);  // Atualizando o ponto clicado
  };

  if (points.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">Nenhum ponto de doação encontrado com os filtros atuais.</div>
    )
  }

  return (
    <div className="space-y-4">
      {points.map((point) => (
        <Card key={point.id} className="cursor-pointer" onClick={() => handleCardClick(point)}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{point.name}</CardTitle>
              {point.type === "food" && <Utensils className="h-5 w-5 text-orange-500" />}
              {point.type === "clothes" && <Shirt className="h-5 w-5 text-blue-500" />}
              {point.type === "both" && (
                <div className="flex gap-1">
                  <Utensils className="h-5 w-5 text-orange-500" />
                  <Shirt className="h-5 w-5 text-blue-500" />
                </div>
              )}
            </div>
            <CardDescription className="flex items-center gap-1 text-sm">
              <MapPin className="h-3 w-3" />
              {point.address}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-2">{point.description}</p>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {point.openingHours}
            </div>
            <div className="text-xs text-gray-500 mt-1">Contato: {point.contactInfo}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
