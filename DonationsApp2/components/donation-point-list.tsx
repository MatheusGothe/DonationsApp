"use client";

import { useState } from "react";
import { MapPin, Utensils, Shirt, Clock, Trash2, Pencil } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatOpeningHours } from "@/lib/formatOpeningHours";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  useDonationPoints,
  type DonationPoint,
} from "./donation-point-context";

interface DonationPointListProps {
  points: DonationPoint[];
  openEditForm: (msg: boolean) => void
}

export default function DonationPointList({ points, openEditForm }: DonationPointListProps ) {
  const { setPointClicked, removeDonationPoint,setPointToEdit } = useDonationPoints();
  const [selectedPointToDelete, setSelectedPointToDelete] =
    useState<DonationPoint | null>(null);

  const handleCardClick = (point: DonationPoint) => {
    setPointClicked({
      id: point.id,
      latitude: point.latitude,
      longitude: point.longitude,
      timestamp: Date.now(),
    });
  };

  const handleDelete = () => {
    if (selectedPointToDelete) {
      removeDonationPoint(selectedPointToDelete.id);
      setSelectedPointToDelete(null);
    }
  };

  const handleShowEditForm = (point) => {
    openEditForm(true)
    setPointToEdit(point)
  }

  if (points.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum ponto de doação encontrado com os filtros atuais.
      </div>
    );

  }

  return (
    <>
      <div className="space-y-4">
        {points.map((point) => (
          <Card
            key={point.id}
            className="cursor-pointer"
            onClick={() => handleCardClick(point)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{point.name}</CardTitle>
                <div className="flex justify-between gap-2">
                  {point.type === "food" && (
                    <Utensils className="h-5 w-5 text-orange-500" />
                  )}
                  {point.type === "clothes" && (
                    <Shirt className="h-5 w-5 text-blue-500" />
                  )}
                  {point.type === "both" && (
                    <div className="flex gap-1">
                      <Utensils className="h-5 w-5 text-orange-500" />
                      <Shirt className="h-5 w-5 text-blue-500" />
                    </div>
                  )}
                 {/* <Trash2
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPointToDelete(point);
                    }}
                    className="h-5 w-5 text-red-500 cursor-pointer z-50"
                  /> */}
                  <Pencil
                    onClick={() => handleShowEditForm(point)}
                    className="h-5 w-5 text-blue-500 cursor-pointer z-50"
                  />
                </div>
              </div>
              <CardDescription className="flex items-center gap-1 text-sm">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                {point.address}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-2">{point.description}</p>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="h-3 w-3 flex-shrink-0" />
                {formatOpeningHours(
                  point.openingDays,
                  point.openingHourStart,
                  point.openingHourEnd
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Contato: {point.contactInfo}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Um único AlertDialog condicional fora do .map */}
      {selectedPointToDelete && (
        // <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-xl">
            <h2 className="text-lg font-semibold mb-2">
              Deseja excluir este ponto?
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Esta ação não poderá ser desfeita. O ponto será removido
              permanentemente.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100"
                onClick={() => setSelectedPointToDelete(null)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
                onClick={handleDelete}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
