import axios from "axios";
import { NominatimResponse, LocationInfo } from "./CityAPIModels";

export async function getCityByCoords(latitude: number, longitude: number): Promise<LocationInfo> {
  const response = await axios.get<NominatimResponse>(
    `https://nominatim.openstreetmap.org/reverse`,
    {
      params: {
        format: "json",
        lat: latitude,
        lon: longitude,
      },
      headers: {
        // recomendado pelo Nominatim
        "User-Agent": "weather-app-react-native",
      },
    }
  );

  const address = response.data.address;

  return {
    city: address?.city || address?.town || address?.village || "Cidade não encontrada",
    state: address?.state || "",
    country: address?.country || "",
  };
}