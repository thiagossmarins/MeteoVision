import { useState, useRef } from "react";
import { Keyboard } from "react-native";
import MapView, { Region } from "react-native-maps";
import { searchCityByName } from "../api/location/searchCityByName";
import { CitySearchResult } from "../api/location/CityAPIModels";
import { getWeatherByCoords } from "../api/weather/weatherApi";
import { WeatherData } from "../api/weather/WeatherAPIModels";
import { useWeatherStore } from "../store/useWeatherStore";
import { flyToRegion, zoomToRegion } from "../utils/flyToRegion";

type SelectedLocation = {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
  weather: WeatherData | null;
};

type UseMapSearchParams = {
  mapRef: React.RefObject<MapView | null>;
  currentRegionRef: React.MutableRefObject<Region | null>;
  userLocation?: { latitude: number; longitude: number } | null;
};

export function useMapSearch({ mapRef, currentRegionRef, userLocation }: UseMapSearchParams) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CitySearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const [saved, setSaved] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveLocation = useWeatherStore((state) => state.saveLocation);

  function handleSearchChange(text: string) {
    setSearchQuery(text);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (text.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      const results = await searchCityByName(text);
      setSearchResults(results);
      setShowResults(true);
    }, 500);
  }

  function clearSearch() {
    setSearchQuery('');
    setShowResults(false);
  }

  async function handleSelectCity(result: CitySearchResult) {
    Keyboard.dismiss();
    setShowResults(false);
    setSearchQuery('');

    // Placeholder enquanto carrega
    setSelectedLocation({
      latitude: result.latitude,
      longitude: result.longitude,
      city: result.city,
      state: result.state,
      country: result.country,
      weather: null,
    });

    // Animação de voo em paralelo com o fetch do clima
    const origin = currentRegionRef.current ?? (userLocation
      ? { latitude: userLocation.latitude, longitude: userLocation.longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 }
      : null);

    if (origin) {
      flyToRegion(mapRef, origin, result);
    } else {
      zoomToRegion(mapRef, result);
    }

    const weatherData = await getWeatherByCoords(result.latitude, result.longitude);
    setSelectedLocation(prev => prev ? { ...prev, weather: weatherData } : null);
  }

  function handleSave() {
    if (!selectedLocation?.weather) return;
    saveLocation({
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      city: selectedLocation.city,
      state: selectedLocation.state,
      country: selectedLocation.country,
      weather: selectedLocation.weather,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function clearSelectedLocation() {
    setSelectedLocation(null);
  }

  return {
    searchQuery,
    searchResults,
    showResults,
    selectedLocation,
    saved,
    handleSearchChange,
    handleSelectCity,
    handleSave,
    clearSearch,
    clearSelectedLocation,
  };
}
