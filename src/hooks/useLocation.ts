import { useEffect, useState } from "react";
import Geolocation from "react-native-geolocation-service";
import { PermissionsAndroid, Platform } from "react-native"
import { getCityByCoords } from "../api/location/getCityByCoords";

type Location = {
  latitude?: number;
  longitude?: number;
}

async function requestLocationPermission() {
  // se a plataforma for android, executa o código abaixo
  if (Platform.OS === "android") {
    // aqui fazemos a requisição de permissão de localização usando PermissionsAndroid
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    // se a permissão for concedida, retornamos true
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  // IOS não usa PermissionsAndroid
  return true;
}

export function useLocation() {
  // estado que armazena a localização com o type definido no inicio do código
  const [location, setLocation] = useState<Location | null>(null);
  const [city, setCity] = useState<string | null>(null);
  // aqui temos nosso loadingLocation que vai começar carregando e quando tivermos a localização ou se der erro para de carregar
  const [loadingLocation, setLoadindLocation] = useState(true);
  // aqui temos o locationError, que se der erro, vai retornar um erro pra gente
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLocation() {
      try {
        // vamos tentar pegar a permissão do usuário
        const hasPermission = await requestLocationPermission();
        // se não tivermos a permissão do usuário, seta um erro e encerra o loading
        if (!hasPermission) {
          setLocationError("Permissão foi negada");
          setLoadindLocation(false);
          return;
        }

        const mockLatitude = -22.3886;
        const mockLongitude = -44.9631; 

        if (__DEV__) {
          setLocation({ latitude: mockLatitude, longitude: mockLongitude });

          const cityName = await getCityByCoords(mockLatitude, mockLongitude);
          setCity(cityName);

          setLoadindLocation(false);
          return;
        }

        Geolocation.getCurrentPosition(
          async (pos) => {
            // quando a localizaçõ for obtida, pega a latitude e longitude e jogamos no estado location
            const latitude = pos.coords.latitude;
            const longitude = pos.coords.longitude;

            setLocation({ latitude, longitude });

            const cityName = await getCityByCoords(latitude, longitude);
            setCity(cityName);

            // aqui quando tivermos nossa localização, o loading vai parar
            setLoadindLocation(false);
          },
          async (error) => {
            // se o usuário negou permissão, ou GPS não conseguiu pegar a localização, ou deu erro de timeout, cai aqui
            console.warn("Erro ao pegar localização real, usando fallback:", error.message);
            
            // FALLBACK: usar localização mock se o GPS falhar
            setLocation({ latitude: mockLatitude, longitude: mockLongitude });
            const cityName = await getCityByCoords(mockLatitude, mockLongitude);
            setCity(cityName);
            
            setLocationError(`GPS indisponível, usando localização padrão`);
            setLoadindLocation(false);
          },
          {
            // prioriza GPS, mas pode usar outras fontes combinadas (rede, torres de celular)
            enableHighAccuracy: true,
            // tempo máximo para buscar a localização
            timeout: 15000,
            // permite usar localização cacheada, até 10s atrás
            maximumAge: 10000,
          }
        );
        // o catch captura qualquer erro inesperado que aconteça no try
      } catch (e: any) {
        setLocationError(e.message);
        setLoadindLocation(false);
      }
    }


    // chamamos a função responsável por carregar a localização
    loadLocation();
  }, [])

  // ESSENCIAL: retornar os dados
  return { location, loadingLocation, locationError, city };
}