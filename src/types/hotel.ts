export interface Country {
  id: number;
  name: string;
}

export interface Hotel {
  id: number;
  name: string;
  price: number;
}

export interface Meal {
  id: number;
  name: string;
  price: number;
}

export interface BoardType {
  code: "NB" | "HB" | "FB";
  name: string;
  description: string;
}

export interface DailySelection {
  hotelId: number | null;
  lunchId: number | null;
  dinnerId: number | null;
}

export interface BookingState {
  citizenship: string;
  startDate: string;
  numDays: number;
  destination: string;
  boardType: "NB" | "HB" | "FB";
  dailySelections: Record<number, DailySelection>;
  step: number;
  savedAt?: number;
}

export type Action =
  | { type: "SET_FIELD"; field: keyof BookingState; value: any }
  | { type: "SET_DAILY_SELECTION"; day: number; selection: Partial<DailySelection> }
  | { type: "SET_STEP"; step: number }
  | { type: "RESET" }
  | { type: "LOAD_STATE"; state: BookingState };

export interface BookingContextType {
  state: BookingState;
  dispatch: React.Dispatch<Action>;
  saveBooking: () => void;
  loadBooking: () => void;
  clearSavedBooking: () => void;
}