import { ThemeProvider } from '@shopify/restyle';
import { StatusBar } from 'react-native';
import { theme } from './src/theme/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Routes } from './src/routes/Routes';
import { useEffect } from 'react';
import { useWeatherStore } from './src/store/useWeatherStore';

function App() {
  // Dispara o carregamento de localização + clima assim que o app abre.
  // Como a store é global, os dados ficam prontos para qualquer tela consumir.
  const loadWeather = useWeatherStore((state) => state.loadWeather);

  useEffect(() => {
    loadWeather();
  }, [loadWeather]);

  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <StatusBar barStyle={'light-content'} />
        <NavigationContainer>
          <Routes />
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
export default App;
