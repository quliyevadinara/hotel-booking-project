import { hotels } from "@/data/hotels";
import { meals } from "@/data/meals";
import { BookingState } from "@/types/hotel";

export const getBoardTypeName = (code: string): string => {
  const types: Record<string, string> = {
    NB: "No Board",
    HB: "Half Board",
    FB: "Full Board",
  };
  return types[code] || code;
};

export const getHotelById = (destination: string, id: number) => {
  const availableHotels = (hotels as any)[destination] || [];
  return availableHotels.find((h: any) => h.id === id);
};

export const getMealById = (
  destination: string,
  id: number,
  type: "lunch" | "dinner"
) => {
  const availableMeals = (meals as any)[destination];
  return availableMeals?.[type].find((m: any) => m.id === id);
};

export const calculateBookingTotal = (booking: BookingState): number => {
  let total = 0;
  
  for (let i = 0; i < booking.numDays; i++) {
    const sel = booking.dailySelections[i];
    if (sel) {
      const hotel = sel.hotelId ? getHotelById(booking.destination, sel.hotelId) : null;
      const lunch = sel.lunchId ? getMealById(booking.destination, sel.lunchId, "lunch") : null;
      const dinner = sel.dinnerId ? getMealById(booking.destination, sel.dinnerId, "dinner") : null;
      
      total += (hotel?.price || 0) + (lunch?.price || 0) + (dinner?.price || 0);
    }
  }
  
  return total;
};

export const formatSavedDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatTripDate = (dateString: string, dayOffset: number = 0): string => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + dayOffset);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
