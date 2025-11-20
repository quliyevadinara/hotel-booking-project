export type BoardType = 'FB' | 'HB' | 'NB';

export type DaySelection = {
  hotelId: number | null;
  lunchId: number | null;
  dinnerId: number | null;
};

export type BookingState = {
  citizenship: string;
  startDate: string;
  numDays: number;
  destination: string;
  boardType: BoardType;
  dailySelections: Record<number, DaySelection>;
  step: number;
};

export type Action =
  | { type: 'SET_FIELD'; field: string; value: any }
  | { type: 'SET_DAILY_SELECTION'; day: number; selection: Partial<DaySelection> }
  | { type: 'SET_STEP'; step: number }
  | { type: 'RESET' };
