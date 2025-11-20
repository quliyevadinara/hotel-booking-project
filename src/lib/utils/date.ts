export function getDateForDay(startDate: string, dayIndex: number, options?: Intl.DateTimeFormatOptions) {
  const date = new Date(startDate);
  date.setDate(date.getDate() + dayIndex);
  return date.toLocaleDateString('en-US', options || { weekday: 'short', month: 'short', day: 'numeric' });
}
