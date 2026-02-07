import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Box } from "../../components/Box/Box";
import { Button } from "../../components/Button/Button";
import { NavitveStackParamList } from "../../routes/Routes";
import { ArrowBack } from "../../assets/icons/ArrowBack";
import { Dimensions } from "react-native";
import MapView from "react-native-maps";
import { useAppSafeArea } from "../../hooks/useAppSafeArea";

type MapScreenProps = NativeStackScreenProps<NavitveStackParamList, 'MapScreen'>

export function MapScreen({ navigation }: MapScreenProps) {
  const { top } = useAppSafeArea();

  return (
    <Box flex={1}>

      <Button
        style={{ top: top, left: 24, zIndex: 10 }}
        onPress={() => navigation.goBack()}
      >
        <ArrowBack />
      </Button>

      <MapView
        style={{ flex: 1, zIndex: 5 }}
      />

    </Box>
  )
}