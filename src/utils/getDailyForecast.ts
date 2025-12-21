import { getDayOfWeek } from "./getDayOfWeek"

type HourlyData = {
  time: string[];
  temperature_2m: number[];
  precipitation_probability: number[];
};

export function getDailyForecast(hourly: HourlyData) {
  // Aqui cria um objeto onde cada chave é uma data  ex: 2025-11-02
  const groupedByDay: Record<string, { temps: number[]; rains: number[] }> = {};

  // Aqui vai percorrer todas as horas da previsão
  hourly.time.forEach((time, index) => {
    // Extrai só a parte da data (sem o horário)
    const date = time.split("T")[0];

    // Se ainda não existe esse dia no objeto, cria
    if (!groupedByDay[date]) {
      groupedByDay[date] = { temps: [], rains: [] };
    }

    // Adiciona a temparatura e a chuva daquela hora no dia correspondente
    groupedByDay[date].temps.push(hourly.temperature_2m[index]);
    groupedByDay[date].rains.push(hourly.precipitation_probability[index]);
  });

  // Converte o objeto em uma lista com as médias por dia
  const dailyForecast = Object.entries(groupedByDay).map(([date, data]) => {
    const maxTemp = Math.max(...data.temps);
    const minTemp = Math.min(...data.temps);

    // Calcula a média de temperatura do dia
    const avgTemp = data.temps.reduce((sum, t) => sum + t, 0) / data.temps.length;

    // Calcula a média de chance de chuva do dia
    const avgRain = data.rains.reduce((sum, r) => sum + r, 0) / data.rains.length;

    // Retorna o resumo do dia, incluindo o nome do dia da semana
    return {
      date,
      weekday: getDayOfWeek(date),
      avgTemp: Number(avgTemp.toFixed(1)),
      avgRain: Math.round(avgRain),
      maxTemp: Number(maxTemp.toFixed(0)),
      minTemp: Number(minTemp.toFixed(0)),
    };
  });

  // Retorna apenas os primeiros 7 dias (hoje + 6)
  return dailyForecast.slice(0, 7);
}