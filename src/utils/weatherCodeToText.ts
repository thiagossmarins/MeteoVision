export function weatherCodeToText(code: number): string {
  switch (code) {
    case 0: return "Céu limpo";
    case 1: return "Parcialmente limpo";
    case 2: return "Parcialmente nublado";
    case 3: return "Nublado";
    case 45: return "Névoa";
    case 48: return "Névoa com geada";
    case 51: return "Garoa leve";
    case 53: return "Garoa moderada";
    case 55: return "Garoa densa";
    case 61: return "Chuva leve";
    case 63: return "Chuva moderada";
    case 65: return "Chuva forte";
    case 71: return "Neve leve";
    case 73: return "Neve moderada";
    case 75: return "Neve forte";
    case 80: return "Aguaceiros leves";
    case 81: return "Aguaceiros moderados";
    case 82: return "Aguaceiros violentos";
    case 95: return "Trovoada";
    case 96: return "Trovoada com granizo leve";
    case 99: return "Trovoada com granizo forte";
    default: return "Tempo desconhecido";
  }
}