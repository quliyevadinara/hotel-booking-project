import { useState, useEffect } from "react";
import { BookingState } from "@/types/hotel";

interface SavedBooking extends BookingState {
  id: string;
  savedAt: number;
}

export function useReservations() {
  const [reservations, setReservations] = useState<SavedBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = () => {
    setIsLoading(true);
    try {
      const saved = localStorage.getItem("hotel-bookings");
      if (saved) {
        const bookings = JSON.parse(saved);
        setReservations(bookings);
      }
    } catch (error) {
      console.error("Error loading reservations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteReservation = (id: string): boolean => {
    try {
      const updated = reservations.filter((r) => r.id !== id);
      localStorage.setItem("hotel-bookings", JSON.stringify(updated));
      setReservations(updated);
      return true;
    } catch (error) {
      console.error("Error deleting reservation:", error);
      return false;
    }
  };

  const saveReservation = (booking: BookingState): boolean => {
    try {
      const newBooking: SavedBooking = {
        ...booking,
        id: `booking-${Date.now()}`,
        savedAt: Date.now(),
      };
      
      const updated = [...reservations, newBooking];
      localStorage.setItem("hotel-bookings", JSON.stringify(updated));
      setReservations(updated);
      return true;
    } catch (error) {
      console.error("Error saving reservation:", error);
      return false;
    }
  };

  return {
    reservations,
    isLoading,
    loadReservations,
    deleteReservation,
    saveReservation,
  };
}