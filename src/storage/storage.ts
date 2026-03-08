import { createMMKV, type MMKV } from "react-native-mmkv";

// -------------------------------------------------------------------
// Lazy initialization do MMKV
//
// Não criamos a instância no nível do módulo pois o bridge nativo do
// React Native pode ainda não estar pronto quando o arquivo é importado.
// Com lazy init, a instância é criada apenas na primeira vez que
// uma das funções abaixo for chamada — garantindo que o native module
// já esteja disponível.
// -------------------------------------------------------------------
let _storage: MMKV | null = null;

function getStorage(): MMKV {
  if (!_storage) {
    _storage = createMMKV();
  }
  return _storage;
}

export const STORAGE_KEYS = {
  WEATHER: "cache:weather",
  LOCATION: "cache:location",
  CITY: "cache:city",
  STATE: "cache:state",
  COUNTRY: "cache:country",
} as const;

export function saveObject<T>(key: string, value: T): void {
  try {
    getStorage().set(key, JSON.stringify(value));
  } catch (e) {
    console.warn("[MMKV] Erro ao salvar:", key, e);
  }
}

export function loadObject<T>(key: string): T | null {
  try {
    const raw = getStorage().getString(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn("[MMKV] Erro ao carregar:", key, e);
    return null;
  }
}
