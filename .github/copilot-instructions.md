# MeteoVision – Instruções para GitHub Copilot

Aplicativo de previsão do tempo para React Native com mapa interativo.

---

## Stack Principal

| Categoria        | Tecnologia                                    |
| ---------------- | --------------------------------------------- |
| Framework        | React Native 0.82.1 + TypeScript              |
| UI / Estilo      | `@shopify/restyle` (sistema de design tokens) |
| Estado global    | Zustand v5 (`useWeatherStore`)                |
| Navegação        | React Navigation v7 (Native Stack)            |
| Storage          | `react-native-mmkv` (via helpers em storage/) |
| HTTP             | Axios                                         |
| Animações        | `react-native-reanimated` + `react-native-gesture-handler` |
| Mapas            | `react-native-maps`                           |
| Gradientes       | `react-native-linear-gradient`                |
| Blur             | `@react-native-community/blur`                |
| API de clima     | Open-Meteo (REST, sem autenticação)           |

---

## Estrutura de Diretórios

```
src/
  api/            → chamadas HTTP (weather/, location/)
  assets/         → fontes, ícones, imagens
  components/     → componentes reutilizáveis (cada um em sua própria pasta)
  hooks/          → hooks customizados (prefixo `use`)
  routes/         → definição de rotas (React Navigation)
  screens/        → telas organizadas por app/NomeDaTela/
  storage/        → helpers MMKV (saveObject, loadObject, STORAGE_KEYS)
  store/          → Zustand store (useWeatherStore.ts)
  theme/          → tema restyle (theme.ts + Theme type)
  utils/          → funções utilitárias puras
```

---

## Componentes Base — SEMPRE usar no lugar dos nativos

### `<Box>` → substitui `<View>`

Criado com `createBox<Theme>()` do restyle. Aceita todas as props do sistema de design tokens diretamente (padding, margin, backgroundColor, borderRadius, etc.).

```tsx
import { Box } from '@/components/Box/Box';

<Box flex={1} padding="s16" backgroundColor="backgroundBlack" borderRadius="s16">
```

### `<Text>` → substitui `<RNText>`

Possui prop obrigatória `preset` e props de peso de fonte.

```tsx
import { Text } from '@/components/Text/Text';

<Text preset="smallFontSize" bold>Olá</Text>
<Text preset="mediumFontSize" light italic>Subtítulo</Text>
```

**Presets disponíveis:**

| Preset            | Tamanho |
| ----------------- | ------- |
| `bigFontSize`     | 100px   |
| `mediumFontSize`  | 24px    |
| `smallFontSize`   | 16px    |
| `titleBoxFontSize`| (menor) |

**Pesos:** `light` · `regular` · `medium` · `bold` (combináveis com `italic`).

### `<GlassBox>` → card com efeito vidro

```tsx
import { GlassBox } from '@/components/GlassBox/GlassBox';

<GlassBox padding="s16">...</GlassBox>
```

### `<Screen>` → wrapper de tela com gradiente

Obrigatório como raiz de toda tela. Recebe o gradiente pelo nome do token.

```tsx
import { Screen } from '@/components/Screen/Screen';

<Screen gradient="clear">...</Screen>
```

---

## Sistema de Tokens (Theme)

### Cores (`backgroundColor`, `color`, etc.)

| Token              | Valor                    |
| ------------------ | ------------------------ |
| `textColor`        | `#fff`                   |
| `textColorBlack`   | `#000`                   |
| `backgroundBlack`  | `#000`                   |
| `glassBackground`  | `rgba(224,224,224, 0.2)` |
| `humidity`         | `#2196F3`                |
| `humidityBox`      | `#ccc`                   |

### Gradientes (`gradient` prop no `<Screen>`)

`clear` · `clouds` · `night` · `rain` · `snow` · `storm`

### Espaçamentos (`padding`, `margin`, `gap`, etc.)

`s2` · `s4` · `s8` · `s10` · `s12` · `s16` · `s20` · `s24` · `s32` · `s48` · `s80`

### Border Radius

`s8` · `s16` · `s32` · `s48` · `s100`

---

## Hooks

| Hook                      | Uso                                                         |
| ------------------------- | ----------------------------------------------------------- |
| `useAppTheme()`           | Acessa o objeto do tema restyle (`theme.colors`, etc.)      |
| `useAppSafeArea()`        | Retorna insets de safe area                                 |
| `useDynamicWeatherTheme(weather)` | Retorna `{ gradient, name }` com base no weatherCode e is_day |
| `useLocation()`           | Gerencia permissão e obtenção de geolocalização             |
| `useMapSearch()`          | Busca endereços pelo mapa                                   |
| `useMapPin()`             | Gerencia o pin selecionado no mapa                          |
| `useWeather()`            | Busca clima para coords específicas (fora da store global)  |

---

## Estado Global — `useWeatherStore`

Store Zustand que centraliza **todo** o estado de clima e localização.

```ts
import { useWeatherStore } from '@/store/useWeatherStore';

const { weather, city, state, country, isLoading, savedLocations } = useWeatherStore();
const { loadWeather, saveLocation, removeLocation } = useWeatherStore();
```

**Tipo `SavedLocation`:**
```ts
type SavedLocation = {
  id: string;
  latitude: number; longitude: number;
  city: string; state: string; country: string;
  weather: WeatherData;
};
```

---

## Storage (MMKV)

Nunca use MMKV diretamente. Use os helpers:

```ts
import { saveObject, loadObject, STORAGE_KEYS } from '@/storage/storage';

saveObject(STORAGE_KEYS.SAVED_LOCATIONS, lista);
const lista = loadObject<SavedLocation[]>(STORAGE_KEYS.SAVED_LOCATIONS);
```

---

## API

### Clima — Open-Meteo

```ts
import { getWeatherByCoords } from '@/api/weather/weatherApi';
const data: WeatherData = await getWeatherByCoords(lat, lon);
```

### Localização reversa

```ts
import { getCityByCoords } from '@/api/location/getCityByCoords';
```

---

## Rotas

```ts
export type NavitveStackParamList = {
  WeatherScreen: undefined;
  MapScreen: undefined;
};
```

Navegação com `useNavigation<NativeStackNavigationProp<NavitveStackParamList>>()`.

---

## Convenções de Código

- **Componentes**: PascalCase, cada um em sua própria pasta com o mesmo nome
  - Ex: `src/components/MeuCard/MeuCard.tsx`
- **Hooks**: prefixo `use`, arquivo único em `src/hooks/`
- **Props**: interface com sufixo `Props` (ex: `MapLocationCardProps`)
- **Exportações**: nomeadas (`export function`) — sem `export default`
- **Tipagem**: sempre tipar props, retornos de hooks e dados da API
- **Sem `<View>` ou `<Text>` nativos**: sempre usar `<Box>` e o `<Text>` customizado
- **Sem `StyleSheet.create`**: toda estilização via props de restyle nos componentes
- **Gradiente dinâmico**: usar `useDynamicWeatherTheme(weather)` para obter o gradiente correto para a condição climática atual
- **Comentários**: em português, explicando o "porquê" e não o "o quê"
