export function humidityToText(humidity: number): string {
  if (humidity <= 30) return "Seco";
  if (humidity <= 50) return "Confortável";
  if (humidity <= 70) return "Úmido";
  return "Muito úmido";
}
