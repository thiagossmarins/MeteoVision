import { useState } from "react";
import MapView, { MapPressEvent } from "react-native-maps";
import { getCityByCoords } from "../api/location/getCityByCoords";
import { getWeatherByCoords } from "../api/weather/weatherApi";
import { WeatherData } from "../api/weather/WeatherAPIModels";
import { useWeatherStore } from "../store/useWeatherStore";
import { zoomToRegion } from "../utils/flyToRegion";

type PinnedLocation = {
  latitude: number;
  longitude: number;
  city: string | null;
  state: string | null;
  country: string | null;
  weather: WeatherData | null;
};

type UseMapPinParams = {
  mapRef: React.RefObject<MapView | null>;
};

export function useMapPin({ mapRef }: UseMapPinParams) {
  const [pinnedLocation, setPinnedLocation] = useState<PinnedLocation | null>(null);
  const [saved, setSaved] = useState(false);
  const saveLocation = useWeatherStore((state) => state.saveLocation);

  async function handleMapPress(event: MapPressEvent) {
    const { latitude, longitude } = event.nativeEvent.coordinate;

    // Placeholder imediato enquanto carrega os dados
    setPinnedLocation({ latitude, longitude, city: null, state: null, country: null, weather: null });
    setSaved(false);

    const [city, weatherData] = await Promise.all([
      getCityByCoords(latitude, longitude),
      getWeatherByCoords(latitude, longitude),
    ]);

    setPinnedLocation({
      latitude,
      longitude,
      city: city.city,
      state: city.state,
      country: city.country,
      weather: weatherData,
    });

    zoomToRegion(mapRef, { latitude, longitude });
  }

  function handleSave() {
    if (!pinnedLocation?.city || !pinnedLocation?.weather) return;

    saveLocation({
      latitude: pinnedLocation.latitude,
      longitude: pinnedLocation.longitude,
      city: pinnedLocation.city,
      state: pinnedLocation.state ?? '',
      country: pinnedLocation.country ?? '',
      weather: pinnedLocation.weather,
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function clearPin() {
    setPinnedLocation(null);
  }

  return {
    pinnedLocation,
    saved,
    handleMapPress,
    handleSave,
    clearPin,
  };
}
