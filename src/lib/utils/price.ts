import { meals } from '../../data/meals';
import { hotels } from '../../data/hotels';
import { BookingState } from '@/types/hotel';

export function calculateTotal(state: BookingState) {
  let total = 0;
  const availableHotels = (hotels as any)[state.destination] || [];
  const availableMeals = (meals as any)[state.destination];

  for (let i = 0; i < state.numDays; i++) {
    const sel = state.dailySelections[i];
    if (!sel) continue;
    if (sel.hotelId) {
      const hotel = availableHotels.find((h: any) => h.id === sel.hotelId);
      total += hotel?.price || 0;
    }
    if (sel.lunchId) {
      const lunch = availableMeals?.lunch.find((m: any) => m.id === sel.lunchId);
      total += lunch?.price || 0;
    }
    if (sel.dinnerId) {
      const dinner = availableMeals?.dinner.find((m: any) => m.id === sel.dinnerId);
      total += dinner?.price || 0;
    }
  }

  return total;
}
