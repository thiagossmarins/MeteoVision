import { create } from "zustand";
import Geolocation from "react-native-geolocation-service";
import { PermissionsAndroid, Platform } from "react-native";
import { getCityByCoords } from "../api/location/getCityByCoords";
import { getWeatherByCoords } from "../api/weather/weatherApi";
import { WeatherData } from "../api/weather/WeatherAPIModels";
import { getDailyForecast } from "../utils/getDailyForecast";

// -------------------------------------------------------------------
// Tipos
// -------------------------------------------------------------------

type Location = {
  latitude: number;
  longitude: number;
};

// Esse é o formato completo do estado global da store.
// Tudo que qualquer tela precisar sobre clima e localização está aqui.
type WeatherState = {
  // --- Dados ---
  location: Location | null;
  city: string | null;
  weather: WeatherData | null;
  dailyForecast: any[];

  // --- Status ---
  isLoading: boolean;
  error: string | null;

  // --- Ações ---
  // "Ação" no Zustand é uma função guardada dentro do próprio estado.
  // Qualquer componente pode chamá-la para disparar lógica e atualizar o estado.
  loadWeather: () => Promise<void>;
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

export const useWeatherStore = create<WeatherState>((set) => ({
  // Valores iniciais
  location: null,
  city: null,
  weather: null,
  dailyForecast: [],
  isLoading: false,
  error: null,

  // loadWeather é a única ação da store.
  // Ela centraliza tudo que antes estava espalhado em useLocation + useWeather.
  loadWeather: async () => {
    set({ isLoading: true, error: null });

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

      // set() faz merge: só atualiza as chaves passadas,
      // o resto do estado permanece intacto
      set({
        location,
        city,
        weather: weatherData,
        dailyForecast,
        isLoading: false,
      });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },
}));
