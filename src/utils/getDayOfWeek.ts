export function getDayOfWeek(dateString: string): string {
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const date = new Date(dateString);

  const dayIndex = date.getDay();

  return days[dayIndex];
}