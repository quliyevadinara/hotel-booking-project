import { BookingState } from "@/types/hotel";
import { getHotelById, getMealById } from "./booking";

export function calculateTotal(state: BookingState): number {
  let total = 0;

  for (let i = 0; i < state.numDays; i++) {
    const sel = state.dailySelections[i];
    if (sel) {
      const hotel = sel.hotelId
        ? getHotelById(state.destination, sel.hotelId)
        : null;
      const lunch = sel.lunchId
        ? getMealById(state.destination, sel.lunchId, "lunch")
        : null;
      const dinner = sel.dinnerId
        ? getMealById(state.destination, sel.dinnerId, "dinner")
        : null;

      total += (hotel?.price || 0) + (lunch?.price || 0) + (dinner?.price || 0);
    }
  }

  return total;
}
