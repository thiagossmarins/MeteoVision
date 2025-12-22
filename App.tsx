import { ThemeProvider } from '@shopify/restyle';
import { StatusBar } from 'react-native';
import { theme } from './src/theme/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Routes } from './src/routes/Routes';
import { NavigationContainer } from '@react-navigation/native';

function App() {

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
