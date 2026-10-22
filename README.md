<div align="center">

<img src="src/assets/images/sora-logo.png" alt="sora" width="160"/>

# sora

**Previsão do tempo moderna, fluida e elegante para iOS e Android.**

Clima em tempo real, mapa satélite interativo, localizações salvas e um tema que muda com o céu.

<br/>

![React Native](https://img.shields.io/badge/React_Native-0.82-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Platforms](https://img.shields.io/badge/iOS%20%7C%20Android-000000?style=for-the-badge&logo=apple&logoColor=white)
![Node](https://img.shields.io/badge/Node-%E2%89%A5%2020-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

[Funcionalidades](#-funcionalidades) •
[Demo](#-demo) •
[Tecnologias](#-tecnologias) •
[Começando](#-começando) •
[Arquitetura](#-arquitetura) •
[APIs](#-apis) •
[Testes](#-testes-automatizados)

</div>

---

## 🎬 Demo

https://github.com/user-attachments/assets/75cf8996-7105-4d73-a895-fcbe273b70a5

---

## ✨ Funcionalidades

### 🌤️ Clima

| | |
| --- | --- |
| 🌡️ **Temperatura atual** | Com sensação térmica |
| ⏱️ **Previsão horária e diária** | Detalhada, hora a hora e dia a dia |
| 🌅 **Nascer e pôr do sol** | Visualização animada da trajetória do sol |
| ☀️ **Índice UV** | Escala visual de intensidade |
| 💧 **Umidade relativa** | Do ar, em destaque |
| 📶 **Modo offline** | Indicador com ícone SVG de sem conexão |

### 🗺️ Mapa e localizações

| | |
| --- | --- |
| 🛰️ **Mapa interativo** | Satélite híbrido com pin de localização |
| 🔎 **Busca de cidades** | Com animação de voo até o destino |
| 📌 **Localizações salvas** | Navegação entre elas com swipe horizontal |
| 🍔 **Menu hambúrguer** | Lista de salvas com remoção individual |
| 📍 **Geolocalização automática** | Começa já na sua posição |

### 🎨 Interface

- **Tema dinâmico** que se adapta às condições climáticas
- **Gradientes animados** baseados no clima
- **Glassmorphism** moderno nos cards

---

## 🛠️ Tecnologias

| Camada | Stack |
| --- | --- |
| **Base** | React Native 0.82.1 · React 19.1.1 · TypeScript 5.8.3 |
| **Navegação** | React Navigation (native-stack) · react-native-screens · react-native-gesture-handler |
| **Estilo e temas** | `@shopify/restyle` · react-native-linear-gradient · `@react-native-community/blur` |
| **Animações** | react-native-reanimated 4.x · react-native-worklets |
| **Mapas e localização** | react-native-maps · react-native-geolocation-service |
| **Gráficos** | react-native-svg |
| **Estado e persistência** | zustand · react-native-mmkv |
| **Rede** | axios · `@react-native-community/netinfo` |
| **Qualidade** | ESLint · Prettier · Jest · Maestro |

---

## 🚀 Começando

### Pré-requisitos

- Node.js `>= 20`
- npm ou yarn
- Xcode e CocoaPods (iOS)
- Android Studio (Android)

> Ambiente ainda não configurado? Siga o guia oficial: [React Native — Set Up Your Environment](https://reactnative.dev/docs/set-up-your-development-environment).

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/thiagossmarins/sora.git
cd sora

# 2. Instale as dependências
npm install

# 3. (iOS) Instale os pods
cd ios && pod install && cd ..
```

### Executando

```bash
npm start          # Metro Bundler
npm run ios        # iOS
npm run android    # Android
```

### Scripts

| Comando | O que faz |
| --- | --- |
| `npm start` | Inicia o Metro Bundler |
| `npm run ios` | Executa o app no iOS |
| `npm run android` | Executa o app no Android |
| `npm run lint` | Verifica problemas de linting |
| `npm test` | Executa os testes |

---

## 🏗️ Arquitetura

```text
src/
├── api/                  # Serviços de API
│   ├── location/         #   Geocodificação e busca de cidades (Nominatim)
│   └── weather/          #   Dados de clima (Open-Meteo)
├── assets/               # Fontes, ícones SVG e imagens
├── components/           # Componentes reutilizáveis
│   ├── Box · Text · Button · Screen
│   ├── GlassBox/             # Card com efeito glassmorphism
│   ├── WeatherPage/          # Página de clima de uma localização
│   ├── HourlyForecast/       # Previsão horária
│   ├── DailyForecast/        # Previsão diária
│   ├── SolarDeclination/     # Animação nascer/pôr do sol
│   ├── UvIndexCard/          # Card de índice UV
│   └── SavedLocationsMenu/   # Menu com localizações salvas
├── hooks/                # useLocation, useWeather, useDynamicWeatherTheme,
│                         # useAppTheme, useAppSafeArea, useMapSearch, useMapPin
├── routes/               # Navegação
├── screens/app/
│   ├── WeatherScreen/        # Tela principal com pager
│   └── MapScreen/            # Mapa interativo
│       └── components/       #   MapSearchBar, MapLocationCard
├── store/                # Zustand: localização, clima, salvas
├── storage/              # Persistência com MMKV
├── theme/                # Tema Restyle
└── utils/                # Helpers de clima, UV, umidade e animação de voo
maestro/
└── demo_mapa.yaml        # Fluxo de demo automatizado
```

---

## 🌐 APIs

| Serviço | Uso |
| --- | --- |
| [**Open-Meteo**](https://open-meteo.com/) | Temperatura atual e aparente, previsão horária (24h) e diária (7 dias), índice UV, umidade relativa, nascer e pôr do sol |
| [**OpenStreetMap Nominatim**](https://nominatim.org/) | Geocodificação reversa (coordenadas → cidade) e busca de cidades por nome, com até 5 resultados |

---

## 🤖 Testes automatizados

O projeto usa [**Maestro**](https://maestro.mobile.dev/) para testes de UI e gravação de demos.

```bash
# Instalar o Maestro
curl -Ls "https://get.maestro.mobile.dev" | bash

# Terminal 1 — inicia a gravação
xcrun simctl io booted recordVideo demo_mapa.mp4

# Terminal 2 — executa o fluxo
maestro test maestro/demo_mapa.yaml
```

O fluxo cobre: **abrir mapa → buscar cidade → animação de voo → salvar → swipe para a página salva**.

---

## 📄 Licença

Distribuído sob a licença [MIT](LICENSE).

## 👨‍💻 Autor

Desenvolvido por **[Thiago Marins](https://www.linkedin.com/in/thiagossmarins/)**.

<div align="center">

⭐ Se o projeto te ajudou ou te inspirou, deixe uma estrela!

</div>
