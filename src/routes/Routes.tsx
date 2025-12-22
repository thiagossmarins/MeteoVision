import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WeatherScreen } from '../screens/app/WeatherScreen';
import { MapScreen } from '../screens/app/MapScreen';

const Stack = createNativeStackNavigator();

export function Routes() {
  return (
    <Stack.Navigator initialRouteName='Weather' screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Weather" component={WeatherScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
    </Stack.Navigator>
  )
}