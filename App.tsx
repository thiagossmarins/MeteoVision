import { ThemeProvider } from '@shopify/restyle';
import { StatusBar } from 'react-native';
import { theme } from './src/theme/theme';
import { WeatherScreen } from './src/screens/app/WeatherScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MapScreen } from './src/screens/app/MapScreen';

function App() {

  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <StatusBar barStyle={'light-content'} />
        {/* <WeatherScreen /> */}
        <MapScreen />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
export default App;
