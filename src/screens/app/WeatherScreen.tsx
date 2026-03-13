import React, { useRef, useState } from "react";
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, ScrollView } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
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
import { SavedLocationsMenu } from "../../components/SavedLocationsMenu/SavedLocationsMenu";

const SCREEN_WIDTH = Dimensions.get("window").width;

type WeatherScreenProps = NativeStackScreenProps<NavitveStackParamList, 'WeatherScreen'>

export function WeatherScreen({ navigation }: WeatherScreenProps) {
  const { top, bottom } = useAppSafeArea();
  const [activePage, setActivePage] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const barVisible = useSharedValue(1);
  const [menuOpen, setMenuOpen] = useState(false);

  const barStyle = useAnimatedStyle(() => ({
    maxHeight: barVisible.value * 70,
    opacity: barVisible.value,
  }));

  // Dados da localização GPS — página 0
  const gpsWeather = useWeatherStore((state) => state.weather);
  const gpsCity = useWeatherStore((state) => state.city);

  // Localizações salvas pelo usuário — páginas 1+
  const savedLocations = useWeatherStore((state) => state.savedLocations);
  const removeLocation = useWeatherStore((state) => state.removeLocation);

  function handleRemove(id: string) {
    removeLocation(id);
  }

  // Todas as páginas: GPS na frente, salvas em seguida
  const pages = [
    { weather: gpsWeather, city: gpsCity },
    ...savedLocations.map((loc) => ({ weather: loc.weather, city: loc.city })),
  ];

  // O tema do gradiente segue a página ativa para refletir o clima local
  const activeWeather = pages[activePage]?.weather ?? null;
  const currentTheme = useDynamicWeatherTheme(activeWeather);

  // Detecta qual página está visível após o scroll parar
  function hideBar() {
    barVisible.value = withTiming(0, { duration: 180 });
  }

  function showBar() {
    barVisible.value = withTiming(1, { duration: 250, easing: Easing.out(Easing.quad) });
  }

  function handleScrollEnd(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const page = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActivePage(page);
    showBar();
  }

  function handleScrollBegin() {
    hideBar();
  }

  return (
    <Screen gradient={currentTheme.gradient}>

      {/* Pager horizontal usando ScrollView nativo — sem dependência externa */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={handleScrollBegin}
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
            onVerticalScrollBegin={hideBar}
            onVerticalScrollEnd={showBar}
            onHamburgerPress={() => setMenuOpen(true)}
          />
        ))}
      </ScrollView>

      {/* Barra inferior: indicador de páginas + lupa */}
      <Animated.View style={[{ overflow: 'hidden' }, barStyle]}>
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          width={"100%"}
          paddingHorizontal="s24"
          style={{ paddingBottom: bottom, paddingTop: 8 }}
        >
          {/* Placeholder para manter lupa à direita */}
          <Box width={50} height={50} />

          {/* Indicador de páginas centralizado */}
          <Box flexDirection="row" alignItems="center" gap="s8">
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

          {/* Lupa */}
          <Button
            testID="btn-abrir-mapa"
            onPress={() => navigation.navigate('MapScreen')}
            style={{ position: 'relative', top: 0, right: 0 }}
          >
            <SearchIcon />
          </Button>
        </Box>
      </Animated.View>

      {/* Menu de localizações salvas */}
      <SavedLocationsMenu
        visible={menuOpen}
        locations={savedLocations}
        onClose={() => setMenuOpen(false)}
        onRemove={handleRemove}
      />

    </Screen>
  );
}