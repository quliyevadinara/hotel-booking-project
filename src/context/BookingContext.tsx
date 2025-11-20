"use client";

import { Action, BookingState } from "@/types/hotel";
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const initialState: BookingState = {
  citizenship: "",
  startDate: "",
  numDays: 1,
  destination: "",
  boardType: "NB",
  dailySelections: {},
  step: 1,
};

function bookingReducer(state: BookingState, action: Action): BookingState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_DAILY_SELECTION":
      return {
        ...state,
        dailySelections: {
          ...state.dailySelections,
          [action.day]: {
            ...state.dailySelections[action.day],
            ...action.selection,
          },
        },
      };
    case "SET_STEP":
      return { ...state, step: action.step };
    case "RESET":
      return initialState;
    case "LOAD_STATE":
      return action.state;
    default:
      return state;
  }
}

const BookingContext = createContext<{
  state: BookingState;
  dispatch: React.Dispatch<Action>;
  saveBooking: () => void;
  loadBooking: () => void;
  clearSavedBooking: () => void;
} | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);
  const [savedBookings, setSavedBookings] = useLocalStorage<BookingState[]>(
    "hotel-bookings",
    []
  );

  // Auto-save current state
  useEffect(() => {
    const timer = setTimeout(() => {
      if (state.step > 1) {
        localStorage.setItem("hotel-booking-draft", JSON.stringify(state));
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [state]);

  const saveBooking = () => {
    if (state.step === 3) {
      const newBookings = [...savedBookings, { ...state, savedAt: Date.now() }];
      setSavedBookings(newBookings);
      alert("Booking saved successfully!");
    }
  };

  const loadBooking = () => {
    const draft = localStorage.getItem("hotel-booking-draft");
    if (draft) {
      try {
        const loadedState = JSON.parse(draft);
        dispatch({ type: "LOAD_STATE", state: loadedState });
        alert("Draft booking loaded!");
      } catch (error) {
        console.error("Error loading booking:", error);
      }
    }
  };

  const clearSavedBooking = () => {
    localStorage.removeItem("hotel-booking-draft");
  };

  return (
    <BookingContext.Provider
      value={{ state, dispatch, saveBooking, loadBooking, clearSavedBooking }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context)
    throw new Error("useBooking must be used within BookingProvider");
  return context;
}
