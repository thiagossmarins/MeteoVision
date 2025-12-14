import axios from "axios";
import { NominatimResponse } from "./CityAPIModels";

export async function getCityByCoords(latitude: number, longitude: number): Promise<string> {
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

  return (
    address?.city ||
    address?.town ||
    address?.village ||
    address?.state ||
    "Cidade não foi encontrada"
  )
}