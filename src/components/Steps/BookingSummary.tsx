"use client";

import React from "react";
import { useBooking } from "../../context/BookingContext";
import { hotels } from "../../data/hotels";
import { meals } from "../../data/meals";
import { calculateTotal } from "../../lib/utils/price";
import { getDateForDay } from "../../lib/utils/date";

export default function BookingSummary() {
  const { state, dispatch } = useBooking();
  const availableHotels = (hotels as any)[state.destination] || [];
  const availableMeals = (meals as any)[state.destination];

  const getHotel = (id: number) =>
    availableHotels.find((h: any) => h.id === id);
  const getMeal = (id: number, type: "lunch" | "dinner") =>
    availableMeals?.[type].find((m: any) => m.id === id);

  const getDateForDayLocal = (dayIndex: number) =>
    getDateForDay(state.startDate, dayIndex, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Booking Summary</h2>
        <button
          onClick={() => dispatch({ type: "SET_STEP", step: 2 })}
          className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
        >
          ← Edit Selection
        </button>
      </div>

      <div className="bg-blue-50 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Trip Details
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-gray-600">Citizenship</div>
            <div className="font-medium">{state.citizenship}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Destination</div>
            <div className="font-medium">{state.destination}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Duration</div>
            <div className="font-medium">{state.numDays} days</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Board Type</div>
            <div className="font-medium">{state.boardType}</div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Daily Breakdown
        </h3>
        <div className="space-y-4">
          {Array.from({ length: state.numDays }, (_, i) => {
            const sel = state.dailySelections[i];
            const hotel = sel?.hotelId ? getHotel(sel.hotelId) : null;
            const lunch = sel?.lunchId ? getMeal(sel.lunchId, "lunch") : null;
            const dinner = sel?.dinnerId
              ? getMeal(sel.dinnerId, "dinner")
              : null;
            const dayTotal =
              (hotel?.price || 0) + (lunch?.price || 0) + (dinner?.price || 0);

            return (
              <div key={i} className="border border-gray-300 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="font-semibold text-lg">
                    Day {i + 1} - {getDateForDayLocal(i)}
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    ${dayTotal}
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hotel:</span>
                    <span className="font-medium">
                      {hotel?.name} (${hotel?.price})
                    </span>
                  </div>
                  {lunch && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lunch:</span>
                      <span className="font-medium">
                        {lunch.name} (${lunch.price})
                      </span>
                    </div>
                  )}
                  {dinner && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dinner:</span>
                      <span className="font-medium">
                        {dinner.name} (${dinner.price})
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-blue-100 text-sm mb-1">Total Amount</div>
            <div className="text-3xl font-bold">
              ${calculateTotal(state as any)}
            </div>
          </div>
          <button
            onClick={() => dispatch({ type: "RESET" })}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition cursor-pointer"
          >
            New Booking
          </button>
        </div>
      </div>
    </div>
  );
}
