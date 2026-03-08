import { create } from "zustand";
import Geolocation from "react-native-geolocation-service";
import { PermissionsAndroid, Platform } from "react-native";
import { getCityByCoords } from "../api/location/getCityByCoords";
import { getWeatherByCoords } from "../api/weather/weatherApi";
import { WeatherData } from "../api/weather/WeatherAPIModels";
import { getDailyForecast } from "../utils/getDailyForecast";
import { loadObject, saveObject, STORAGE_KEYS } from "../storage/storage";

// -------------------------------------------------------------------
// Tipos
// -------------------------------------------------------------------

type Location = {
  latitude: number;
  longitude: number;
};

// Localização salva manualmente pelo usuário pelo MapScreen.
// Inclui um snapshot do clima no momento em que foi salva.
export type SavedLocation = {
  id: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
  weather: WeatherData;
};

// Esse é o formato completo do estado global da store.
// Tudo que qualquer tela precisar sobre clima e localização está aqui.
type WeatherState = {
  // --- Dados ---
  location: Location | null;
  city: string | null;
  state: string | null;
  country: string | null;
  weather: WeatherData | null;
  dailyForecast: any[];
  savedLocations: SavedLocation[];

  // --- Status ---
  isLoading: boolean;
  error: string | null;

  // --- Ações ---
  // "Ação" no Zustand é uma função guardada dentro do próprio estado.
  // Qualquer componente pode chamá-la para disparar lógica e atualizar o estado.
  loadWeather: () => Promise<void>;
  saveLocation: (data: Omit<SavedLocation, 'id'>) => void;
  removeLocation: (id: string) => void;
};

// -------------------------------------------------------------------
// Função auxiliar de permissão (mesma lógica do useLocation anterior)
// -------------------------------------------------------------------

async function requestLocationPermission(): Promise<boolean> {
  if (Platform.OS === "android") {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
}

// -------------------------------------------------------------------
// A store
//
// create<WeatherState>() recebe uma função que tem acesso a dois
// parâmetros fundamentais:
//
//   set  → atualiza parcialmente o estado (faz merge automático)
//   get  → lê o estado atual de dentro da própria store
//
// O objeto retornado é o estado inicial + as ações.
// -------------------------------------------------------------------

export const useWeatherStore = create<WeatherState>((set, get) => ({
  // Valores iniciais
  location: null,
  city: null,
  state: null,
  country: null,
  weather: null,
  dailyForecast: [],
  savedLocations: [],
  isLoading: false,
  error: null,

  // loadWeather é a única ação da store.
  // Ela centraliza tudo que antes estava espalhado em useLocation + useWeather.
  loadWeather: async () => {
    // -------------------------------------------------------------------
    // PASSO 1 — Carrega o cache SINCRONAMENTE antes de qualquer await.
    // Como o MMKV é síncrono, isso acontece antes do primeiro render
    // da tela. O usuário vê os dados antigos imediatamente enquanto
    // a nova request acontece em background.
    // -------------------------------------------------------------------
    const cachedWeather = loadObject<WeatherData>(STORAGE_KEYS.WEATHER);
    const cachedLocation = loadObject<Location>(STORAGE_KEYS.LOCATION);
    const cachedSavedLocations = loadObject<SavedLocation[]>(STORAGE_KEYS.SAVED_LOCATIONS) ?? [];

    if (cachedWeather && cachedLocation) {
      set({
        weather: cachedWeather,
        dailyForecast: getDailyForecast(cachedWeather.hourly),
        location: cachedLocation,
        city: loadObject<string>(STORAGE_KEYS.CITY),
        state: loadObject<string>(STORAGE_KEYS.STATE),
        country: loadObject<string>(STORAGE_KEYS.COUNTRY),
        savedLocations: cachedSavedLocations,
        // isLoading continua true: vai atualizar em background logo abaixo
        isLoading: true,
      });
    } else {
      set({ isLoading: true, error: null, savedLocations: cachedSavedLocations });
    }

    const mockLatitude = -22.3886;
    const mockLongitude = -44.9631;

    try {
      // 1. Permissão
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        set({ error: "Permissão de localização negada", isLoading: false });
        return;
      }

      // 2. Localização
      // Em __DEV__ pula o GPS e usa coordenadas fixas para não depender
      // de dispositivo físico no emulador
      const getLocation = (): Promise<Location> =>
        new Promise((resolve) => {
          if (__DEV__) {
            resolve({ latitude: mockLatitude, longitude: mockLongitude });
            return;
          }

          Geolocation.getCurrentPosition(
            (pos) =>
              resolve({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
              }),
            () =>
              // Fallback para mock se o GPS falhar
              resolve({ latitude: mockLatitude, longitude: mockLongitude }),
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );
        });

      const location = await getLocation();

      // 3. Cidade e clima em paralelo com Promise.all
      // Em vez de esperar a cidade para depois buscar o clima,
      // as duas chamadas disparam ao mesmo tempo — reduz o tempo total de carregamento
      const [city, weatherData] = await Promise.all([
        getCityByCoords(location.latitude, location.longitude),
        getWeatherByCoords(location.latitude, location.longitude),
      ]);

      const dailyForecast = getDailyForecast(weatherData.hourly);

      // -------------------------------------------------------------------
      // PASSO 2 — Salva os dados frescos no cache MMKV.
      // Na próxima abertura do app, esses valores serão lidos
      // sincronamente no Passo 1 antes de qualquer request.
      // -------------------------------------------------------------------
      saveObject(STORAGE_KEYS.WEATHER, weatherData);
      saveObject(STORAGE_KEYS.LOCATION, location);
      saveObject(STORAGE_KEYS.CITY, city.city);
      saveObject(STORAGE_KEYS.STATE, city.state);
      saveObject(STORAGE_KEYS.COUNTRY, city.country);

      // set() faz merge: só atualiza as chaves passadas,
      // o resto do estado permanece intacto
      set({
        location,
        city: city.city,
        state: city.state,
        country: city.country,
        weather: weatherData,
        dailyForecast,
        isLoading: false,
      });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },

  // Salva uma nova localização no estado e persiste no MMKV.
  // O id é gerado com timestamp para garantir unicidade.
  saveLocation: (data) => {
    const newLocation: SavedLocation = { id: Date.now().toString(), ...data };
    const updated = [...get().savedLocations, newLocation];
    saveObject(STORAGE_KEYS.SAVED_LOCATIONS, updated);
    set({ savedLocations: updated });
  },

  // Remove uma localização pelo id e persiste a lista atualizada.
  removeLocation: (id) => {
    const updated = get().savedLocations.filter((l) => l.id !== id);
    saveObject(STORAGE_KEYS.SAVED_LOCATIONS, updated);
    set({ savedLocations: updated });
  },
}));
