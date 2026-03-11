import { TouchableOpacity, TextInput, ScrollView } from "react-native";
import { Box } from "../Box/Box";
import { Text } from "../Text/Text";
import { CitySearchResult } from "../../api/location/CityAPIModels";

type MapSearchBarProps = {
  query: string;
  results: CitySearchResult[];
  showResults: boolean;
  onChangeText: (text: string) => void;
  onSelectCity: (result: CitySearchResult) => void;
  onClear: () => void;
};

export function MapSearchBar({
  query,
  results,
  showResults,
  onChangeText,
  onSelectCity,
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

      {showResults && results.length > 0 && (
        <Box
          backgroundColor="backgroundBlack"
          borderRadius="s16"
          mt="s4"
          style={{ maxHeight: 220, overflow: 'hidden' }}
        >
          <ScrollView keyboardShouldPersistTaps="handled">
            {results.map((result, index) => (
              <TouchableOpacity key={index} onPress={() => onSelectCity(result)}>
                <Box
                  paddingHorizontal="s16"
                  paddingVertical="s12"
                  style={{
                    borderBottomWidth: index < results.length - 1 ? 0.5 : 0,
                    borderBottomColor: 'rgba(255,255,255,0.1)',
                  }}
                >
                  <Text preset="smallFontSize" bold>{result.city}</Text>
                  <Text preset="titleBoxFontSize">
                    {[result.state, result.country].filter(Boolean).join(', ')}
                  </Text>
                </Box>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Box>
      )}
    </Box>
  );
}
