# ☁️ MeteoVision

Um aplicativo de previsão do tempo moderno e elegante para iOS e Android, desenvolvido com React Native.

## 📸 Screenshots / demo

<img src="https://github.com/user-attachments/assets/697e959e-d0ec-4d5b-a56d-c681c0aa7a92" alt="MeteoVision Screenshot" width="300"/>


https://github.com/user-attachments/assets/75cf8996-7105-4d73-a895-fcbe273b70a5



## ✨ Funcionalidades

- **Temperatura atual** com sensação térmica
- **Previsão horária** e diária detalhada
- **Nascer e pôr do sol** com visualização animada
- **Índice UV** com escala visual
- **Umidade relativa** do ar
- **Tema dinâmico** que se adapta às condições climáticas
- **Geolocalização automática**
- **Gradientes animados** baseados no clima
- **Interface glassmorphism** moderna

## 🚧 Próximas Funcionalidades

- **Mapa interativo** com visualização de clima por região (em desenvolvimento na branch `feat/MapScreen`)

## 🛠️ Tecnologias

- **React Native** 0.82.1
- **TypeScript** 5.8.3
- **React** 19.1.1
- **@shopify/restyle** - Sistema de temas e estilos
- **react-native-linear-gradient** - Gradientes animados
- **react-native-geolocation-service** - Serviços de localização
- **react-native-svg** - Ícones e gráficos vetoriais
- **axios** - Requisições HTTP para API de clima

## 📂 Estrutura do Projeto

```
src/
├── api/              # Serviços de API
│   ├── location/     # API de geolocalização
│   └── weather/      # API de clima
├── assets/           # Recursos estáticos
│   ├── fonts/        # Fontes customizadas
│   └── icons/        # Ícones SVG
├── components/       # Componentes reutilizáveis
│   ├── Box/          # Container com Restyle
│   ├── Text/         # Componente de texto
│   ├── GlassBox/     # Card com efeito glassmorphism
│   ├── GradientScreen/  # Tela com gradiente
│   ├── HourlyForecast/  # Previsão horária
│   ├── DailyForecast/   # Previsão diária
│   ├── SolarDeclination/ # Animação nascer/pôr do sol
│   └── UvIndexCard/     # Card de índice UV
├── hooks/            # Hooks customizados
│   ├── useLocation.ts   # Hook de geolocalização
│   ├── useWeather.ts    # Hook de dados climáticos
│   ├── useDynamicWeatherTheme.ts  # Tema dinâmico
│   ├── useAppTheme.ts   # Tema da aplicação
│   └── useAppSafeArea.ts # Safe area
├── screens/          # Telas da aplicação
│   └── app/
│       └── WeatherScreen.tsx
├── theme/            # Configuração de temas
│   └── theme.ts
└── utils/            # Funções utilitárias
    ├── getDailyForecast.ts
    ├── getDayOfWeek.ts
    ├── getWeatherTheme.ts
    ├── weatherCodeToText.ts
    ├── weatherCodeToEmoji.ts
    ├── uvText.ts
    └── humidityText.ts
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js >= 20
- npm ou yarn
- Xcode (para iOS)
- Android Studio (para Android)
- CocoaPods (para iOS)

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/MeteoVision.git
cd MeteoVision
```

2. Instale as dependências:
```bash
npm install
```

3. Para iOS, instale os pods:
```bash
cd ios && pod install && cd ..
```

### Executando

**iOS:**
```bash
npm run ios
```

**Android:**
```bash
npm run android
```

**Iniciar Metro Bundler:**
```bash
npm start
```

## 📝 Scripts Disponíveis

- `npm start` - Inicia o Metro Bundler
- `npm run ios` - Executa o app no iOS
- `npm run android` - Executa o app no Android
- `npm run lint` - Verifica problemas de linting
- `npm test` - Executa os testes

## 🌐 APIs Utilizadas

### API de Clima
Obtém dados meteorológicos em tempo real:
- Temperatura atual e aparente
- Previsão horária (24h)
- Previsão diária (7 dias)
- Índice UV
- Umidade relativa
- Horários de nascer e pôr do sol

### OpenStreetMap Nominatim API
Realiza geocodificação reversa para converter coordenadas (latitude/longitude) em nome de cidade, vila ou estado

## 📄 Licença

Este projeto está sob a licença privada.

## 👨‍💻 Autor

Desenvolvido por [Thiago Marins](https://www.linkedin.com/in/thiagossmarins/)

---

⭐ Se você gostou deste projeto, considere dar uma estrela!
