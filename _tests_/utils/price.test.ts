import { calculateTotal } from "@/lib/utils/price";
import { BookingState } from "@/types/hotel";

describe("Price Calculation", () => {
  it("should calculate total for single day with no meals", () => {
    const state: BookingState = {
      citizenship: "Turkey",
      startDate: "2025-01-01",
      numDays: 1,
      destination: "Turkey",
      boardType: "NB",
      dailySelections: {
        0: { hotelId: 101, lunchId: null, dinnerId: null },
      },
      step: 3,
    };

    const total = calculateTotal(state);
    expect(total).toBe(120);
  });

  it("should calculate total with meals for multiple days", () => {
    const state: BookingState = {
      citizenship: "Turkey",
      startDate: "2025-01-01",
      numDays: 2,
      destination: "Turkey",
      boardType: "FB",
      dailySelections: {
        0: { hotelId: 101, lunchId: 4, dinnerId: 1 },
        1: { hotelId: 102, lunchId: 5, dinnerId: 2 },
      },
      step: 3,
    };

    const total = calculateTotal(state);
    expect(total).toBe(261);
  });
});