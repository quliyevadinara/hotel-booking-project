import { BookingProvider, useBooking } from "@/context/BookingContext";
import { renderHook, act } from "@testing-library/react";
import React from "react";

describe("BookingContext", () => {
  it("should initialize with default state", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <BookingProvider>{children}</BookingProvider>
    );

    const { result } = renderHook(() => useBooking(), { wrapper });

    expect(result.current.state.step).toBe(1);
    expect(result.current.state.citizenship).toBe("");
    expect(result.current.state.numDays).toBe(1);
  });

  it("should update field", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <BookingProvider>{children}</BookingProvider>
    );

    const { result } = renderHook(() => useBooking(), { wrapper });

    act(() => {
      result.current.dispatch({
        type: "SET_FIELD",
        field: "citizenship",
        value: "Turkey",
      });
    });

    expect(result.current.state.citizenship).toBe("Turkey");
  });

  it("should reset state", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <BookingProvider>{children}</BookingProvider>
    );

    const { result } = renderHook(() => useBooking(), { wrapper });

    act(() => {
      result.current.dispatch({
        type: "SET_FIELD",
        field: "citizenship",
        value: "Turkey",
      });
    });

    act(() => {
      result.current.dispatch({ type: "RESET" });
    });

    expect(result.current.state.citizenship).toBe("");
  });
});
