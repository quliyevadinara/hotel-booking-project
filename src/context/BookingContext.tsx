"use client";

import { Action, BookingState } from "@/types/hotel";
import React, { createContext, useContext, useReducer } from "react";

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
    default:
      return state;
  }
}

const BookingContext = createContext<{
  state: BookingState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);
  return (
    <BookingContext.Provider value={{ state, dispatch }}>
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
