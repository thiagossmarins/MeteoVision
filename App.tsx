import { ThemeProvider } from '@shopify/restyle';
import { StatusBar } from 'react-native';
import { theme } from './src/Theme/Theme';
import { Box } from './src/components/Box/Box';
import { Text } from './src/components/Text/Text';

function App() {

  return (
    <ThemeProvider theme={theme}>
      <StatusBar barStyle={'dark-content'} />
      <Box flex={1} alignItems='center' justifyContent='center'>
        <Text>Olá, MeteoVision!</Text>
      </Box>
    </ThemeProvider>
  );
}
export default App;
