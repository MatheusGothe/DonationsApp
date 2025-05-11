import { Input } from "@/components/ui/input";

interface LocationInfoProps {
  latitude: number;
  longitude: number;
}

export default function LocationInfo({ latitude, longitude }: LocationInfoProps) {
  if (latitude === 0 && longitude === 0) return null;

  return (
    <div className="space-y-2">
      <div>
        <label
          htmlFor="latitude"
          className="block text-sm font-medium text-gray-700"
        >
          Latitude
        </label>
        <Input
          id="latitude"
          name="latitude"
          value={latitude.toFixed(5)}
          disabled
          placeholder="Latitude"
          className="w-full"
        />
      </div>
      <div>
        <label
          htmlFor="longitude"
          className="block text-sm font-medium text-gray-700"
        >
          Longitude
        </label>
        <Input
          id="longitude"
          name="longitude"
          value={longitude.toFixed(5)}
          disabled
          placeholder="Longitude"
          className="w-full"
        />
      </div>
    </div>
  );
}
