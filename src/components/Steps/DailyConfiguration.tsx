"use client";

import { useBooking } from "../../context/BookingContext";
import { hotels } from "../../data/hotels";
import { meals } from "../../data/meals";
import { getDateForDay } from "../../lib/utils/date";

export default function DailyConfiguration() {
  const { state, dispatch } = useBooking();
  const availableHotels = (hotels as any)[state.destination] || [];
  const availableMeals = (meals as any)[state.destination];

  const handleDailyChange = (
    day: number,
    field: "hotelId" | "lunchId" | "dinnerId",
    value: number | null
  ) => {
    const selection: any = { [field]: value };

    if (state.boardType === "HB") {
      if (field === "lunchId" && value !== null) {
        selection.dinnerId = null;
      } else if (field === "dinnerId" && value !== null) {
        selection.lunchId = null;
      }
    }

    dispatch({ type: "SET_DAILY_SELECTION", day, selection });
  };

  const getDateForDayLocal = (dayIndex: number) =>
    getDateForDay(state.startDate, dayIndex);

  const canProceed = () => {
    for (let i = 0; i < state.numDays; i++) {
      const selection = state.dailySelections[i];
      if (!selection?.hotelId) return false;
    }
    return true;
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          Daily Configuration
        </h2>
        <button
          onClick={() => dispatch({ type: "SET_STEP", step: 1 })}
          className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
        >
          ← Back to Configuration
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                Day
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                Hotel
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                Lunch
              </th>
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                Dinner
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: state.numDays }, (_, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-3 font-medium">
                  Day {i + 1}
                  <br />
                  <span className="text-sm text-gray-500">
                    {getDateForDayLocal(i)}
                  </span>
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <select
                    value={state.dailySelections[i]?.hotelId || ""}
                    onChange={(e) =>
                      handleDailyChange(
                        i,
                        "hotelId",
                        e.target.value ? parseInt(e.target.value) : null
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select hotel</option>
                    {availableHotels.map((hotel: any) => (
                      <option key={hotel.id} value={hotel.id}>
                        {hotel.name} - ${hotel.price}/night
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <select
                    value={state.dailySelections[i]?.lunchId || ""}
                    onChange={(e) =>
                      handleDailyChange(
                        i,
                        "lunchId",
                        e.target.value ? parseInt(e.target.value) : null
                      )
                    }
                    disabled={state.boardType === "NB"}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">No lunch</option>
                    {availableMeals?.lunch.map((meal: any) => (
                      <option key={meal.id} value={meal.id}>
                        {meal.name} - ${meal.price}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <select
                    value={state.dailySelections[i]?.dinnerId || ""}
                    onChange={(e) =>
                      handleDailyChange(
                        i,
                        "dinnerId",
                        e.target.value ? parseInt(e.target.value) : null
                      )
                    }
                    disabled={state.boardType === "NB"}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">No dinner</option>
                    {availableMeals?.dinner.map((meal: any) => (
                      <option key={meal.id} value={meal.id}>
                        {meal.name} - ${meal.price}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => canProceed() && dispatch({ type: "SET_STEP", step: 3 })}
        disabled={!canProceed()}
        className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
      >
        Continue to Summary
      </button>
    </div>
  );
}
