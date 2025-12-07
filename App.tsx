import { ThemeProvider } from '@shopify/restyle';
import { StatusBar } from 'react-native';
import { theme } from './src/theme/theme';
import { Box } from './src/components/Box/Box';
import { Text } from './src/components/Text/Text';
import { Gradient } from './src/components/Gradient/Gradient';

function App() {

  return (
    <ThemeProvider theme={theme}>
      <StatusBar barStyle={'light-content'} />
      <Gradient
        gradient='clear'
      >
        <Box flex={1} alignItems='center' justifyContent='center'>
          <Text preset='mediumFontSize' color='textColor' bold italic>Olá, MeteoVision!</Text>
        </Box>
      </Gradient>
    </ThemeProvider>
  );
}
export default App;
