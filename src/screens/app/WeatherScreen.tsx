import React, { useRef, useState } from "react";
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, ScrollView } from "react-native";
import { Screen } from "../../components/Screen/Screen";
import { Box } from "../../components/Box/Box";
import { useWeatherStore } from "../../store/useWeatherStore";
import { useDynamicWeatherTheme } from "../../hooks/useDynamicWeatherTheme";
import { useAppSafeArea } from "../../hooks/useAppSafeArea";
import { SearchIcon } from "../../assets/icons/SearchIcon";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { NavitveStackParamList } from "../../routes/Routes";
import { Button } from "../../components/Button/Button";
import { WeatherPage } from "../../components/WeatherPage/WeatherPage";

const SCREEN_WIDTH = Dimensions.get("window").width;

type WeatherScreenProps = NativeStackScreenProps<NavitveStackParamList, 'WeatherScreen'>

export function WeatherScreen({ navigation }: WeatherScreenProps) {
  const { top, bottom } = useAppSafeArea();
  const [activePage, setActivePage] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  // Dados da localização GPS — página 0
  const gpsWeather = useWeatherStore((state) => state.weather);
  const gpsCity = useWeatherStore((state) => state.city);

  // Localizações salvas pelo usuário — páginas 1+
  const savedLocations = useWeatherStore((state) => state.savedLocations);

  // Todas as páginas: GPS na frente, salvas em seguida
  const pages = [
    { weather: gpsWeather, city: gpsCity },
    ...savedLocations.map((loc) => ({ weather: loc.weather, city: loc.city })),
  ];

  // O tema do gradiente segue a página ativa para refletir o clima local
  const activeWeather = pages[activePage]?.weather ?? null;
  const currentTheme = useDynamicWeatherTheme(activeWeather);

  // Detecta qual página está visível após o scroll parar
  function handleScrollEnd(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const page = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActivePage(page);
  }

  return (
    <Screen gradient={currentTheme.gradient}>

      {/* Pager horizontal usando ScrollView nativo — sem dependência externa */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        style={{ flex: 1 }}
        scrollEventThrottle={16}
      >
        {pages.map((page, index) => (
          <WeatherPage
            key={String(index)}
            weather={page.weather}
            city={page.city}
            top={top}
            bottom={bottom}
          />
        ))}
      </ScrollView>

      {/* Indicador de páginas: só aparece quando há localizações salvas */}
      {pages.length > 1 && (
        <Box
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          gap="s8"
          style={{ paddingVertical: 8 }}
        >
          {pages.map((_, i) => (
            <Box
              key={i}
              width={8}
              height={8}
              style={
                i === activePage
                  ? { backgroundColor: 'white', borderRadius: 100 }
                  : { borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.6)', borderRadius: 100 }
              }
            />
          ))}
        </Box>
      )}

      {/* Botão do mapa — posicionado no canto inferior direito */}
      <Box
        position="relative"
        bottom={bottom}
        right={0}
        width={"100%"}
        height={45}
        paddingHorizontal="s24"
        paddingTop="s8"
      >
        <Button
          onPress={() => navigation.navigate('MapScreen')}
          style={{ right: 24, top: 15 }}
        >
          <SearchIcon />
        </Button>
      </Box>

    </Screen>
  );
}