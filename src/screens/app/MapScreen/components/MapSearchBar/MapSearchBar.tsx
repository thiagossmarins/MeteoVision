import { TouchableOpacity, TextInput } from "react-native";
import { Box } from "../../../../../components/Box/Box";
import { Text } from "../../../../../components/Text/Text";

type MapSearchBarProps = {
  query: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
};

export function MapSearchBar({
  query,
  onChangeText,
  onClear,
}: MapSearchBarProps) {
  return (
    <Box flex={1}>
      <Box
        style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
        borderRadius="s100"
        paddingHorizontal="s16"
        paddingVertical="s16"
        flexDirection="row"
        alignItems="center"
      >
        <TextInput
          testID="input-busca-cidade"
          value={query}
          onChangeText={onChangeText}
          placeholder="Buscar cidade..."
          placeholderTextColor="rgba(255,255,255,0.4)"
          returnKeyType="search"
          style={{
            flex: 1,
            color: '#fff',
            fontFamily: 'Inter_Regular',
            fontSize: 16,
            paddingVertical: 0,
          }}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={onClear}>
            <Text preset="titleBoxFontSize" style={{ color: 'rgba(255,255,255,0.5)', paddingLeft: 8 }}>✕</Text>
          </TouchableOpacity>
        )}
      </Box>
    </Box>
  );
}
