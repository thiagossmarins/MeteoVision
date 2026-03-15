import axios from "axios";
import { CitySearchResult } from "./CityAPIModels";

export async function searchCityByName(query: string): Promise<CitySearchResult[]> {
  const response = await axios.get(
    `https://nominatim.openstreetmap.org/search`,
    {
      params: {
        q: query,
        format: "json",
        limit: 5,
        addressdetails: 1,
      },
      headers: {
        "User-Agent": "weather-app-react-native",
      },
    }
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return response.data.map((item: any) => ({
    displayName: item.display_name as string,
    city:
      (item.address?.city as string) ||
      (item.address?.town as string) ||
      (item.address?.village as string) ||
      (item.name as string) ||
      "Cidade não encontrada",
    state: (item.address?.state as string) || "",
    country: (item.address?.country as string) || "",
    latitude: parseFloat(item.lat),
    longitude: parseFloat(item.lon),
  }));
}
