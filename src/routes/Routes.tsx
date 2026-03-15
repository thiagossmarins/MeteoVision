import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { WeatherScreen } from "../screens/app/WeatherScreen/WeatherScreen";
import { MapScreen } from "../screens/app/MapScreen/MapScreen";

export type NavitveStackParamList = {
  WeatherScreen: undefined,
  MapScreen: undefined,
}

const Stack = createNativeStackNavigator<NavitveStackParamList>();

export function Routes() {
  return (
    <Stack.Navigator
      initialRouteName="WeatherScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="WeatherScreen" component={WeatherScreen} />
      <Stack.Screen name="MapScreen" component={MapScreen} />
    </Stack.Navigator>
  )
}