"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBooking } from "../../context/BookingContext";
import { hotels } from "../../data/hotels";
import { meals } from "../../data/meals";
import { getDateForDay } from "../../lib/utils/date";

export default function DailyConfiguration() {
  const { state, dispatch } = useBooking();
  const [isLoading, setIsLoading] = useState(false);
  const [showBulkSelect, setShowBulkSelect] = useState(true);
  const [bulkSelections, setBulkSelections] = useState({
    hotelId: "",
    lunchId: "",
    dinnerId: "",
  });

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

  const handleBulkChange = (
    field: keyof typeof bulkSelections,
    value: string
  ) => {
    setBulkSelections((prev) => ({ ...prev, [field]: value }));
  };

  const applyToAllDays = () => {
    if (!bulkSelections.hotelId) {
      alert("Please select a hotel first");
      return;
    }

    for (let i = 0; i < state.numDays; i++) {
      const selection: any = {
        hotelId: bulkSelections.hotelId
          ? parseInt(bulkSelections.hotelId)
          : null,
        lunchId: bulkSelections.lunchId
          ? parseInt(bulkSelections.lunchId)
          : null,
        dinnerId: bulkSelections.dinnerId
          ? parseInt(bulkSelections.dinnerId)
          : null,
      };

      dispatch({ type: "SET_DAILY_SELECTION", day: i, selection });
    }

    // Show success message
    const successMsg = document.createElement("div");
    successMsg.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        font-weight: 500;
      ">
        ✓ Applied to all ${state.numDays} days!
      </div>
    `;
    document.body.appendChild(successMsg);
    setTimeout(() => {
      document.body.removeChild(successMsg);
    }, 2000);
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

  const handleContinue = async () => {
    if (!canProceed()) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    dispatch({ type: "SET_STEP", step: 3 });
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-4 md:p-8"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Daily Configuration
        </h2>
        <div className="flex gap-2 w-full md:w-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch({ type: "SET_STEP", step: 1 })}
            className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer px-4 py-2 border border-blue-600 rounded-lg flex-1 md:flex-none"
          >
            ← Back
          </motion.button>
        </div>
      </motion.div>

      {state.boardType === "HB" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3"
        >
          <svg
            className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="font-semibold text-amber-800">Half Board Selected</p>
            <p className="text-sm text-amber-700 mt-1">
              You can select either <strong>lunch OR dinner</strong> for each
              day, not both. Selecting one will automatically deselect the
              other.
            </p>
          </div>
        </motion.div>
      )}

      {state.boardType === "NB" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3"
        >
          <svg
            className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="font-semibold text-blue-800">No Board Selected</p>
            <p className="text-sm text-blue-700 mt-1">
              Meal selections are disabled. Only hotel booking is included.
            </p>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {showBulkSelect && state.numDays > 1 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4 md:p-6 mb-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Quick Apply to All Days
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Save time by selecting options once and applying to all{" "}
                  {state.numDays} days
                </p>
              </div>
              <button
                onClick={() => setShowBulkSelect(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hotel *
                </label>
                <select
                  value={bulkSelections.hotelId}
                  onChange={(e) => handleBulkChange("hotelId", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select hotel</option>
                  {availableHotels.map((hotel: any) => (
                    <option key={hotel.id} value={hotel.id}>
                      {hotel.name} - ${hotel.price}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lunch
                </label>
                <select
                  value={bulkSelections.lunchId}
                  onChange={(e) => {
                    handleBulkChange("lunchId", e.target.value);
                    if (state.boardType === "HB" && e.target.value) {
                      handleBulkChange("dinnerId", "");
                    }
                  }}
                  disabled={state.boardType === "NB"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">No lunch</option>
                  {availableMeals?.lunch.map((meal: any) => (
                    <option key={meal.id} value={meal.id}>
                      {meal.name} - ${meal.price}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dinner
                </label>
                <select
                  value={bulkSelections.dinnerId}
                  onChange={(e) => {
                    handleBulkChange("dinnerId", e.target.value);
                    if (state.boardType === "HB" && e.target.value) {
                      handleBulkChange("lunchId", "");
                    }
                  }}
                  disabled={state.boardType === "NB"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">No dinner</option>
                  {availableMeals?.dinner.map((meal: any) => (
                    <option key={meal.id} value={meal.id}>
                      {meal.name} - ${meal.price}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-1 flex items-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={applyToAllDays}
                  disabled={!bulkSelections.hotelId}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Apply to All
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showBulkSelect && state.numDays > 1 && (
        <div className="mb-4">
          <button
            onClick={() => setShowBulkSelect(true)}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Show Quick Apply
          </button>
        </div>
      )}

      {/* Individual Days konfiqurasiya */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Individual Day Configuration
        </h3>

        {/* Desktop table gorunus */}
        <div className="hidden md:block overflow-x-auto">
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
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.05, duration: 0.5 }}
                  className="hover:bg-gray-50"
                >
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
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile gorunus */}
        <div className="md:hidden space-y-4">
          {Array.from({ length: state.numDays }, (_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.05, duration: 0.5 }}
              className="border border-gray-300 rounded-lg p-4 bg-white"
            >
              <div className="font-semibold text-lg mb-3 pb-3 border-b border-gray-200">
                Day {i + 1}
                <span className="block text-sm text-gray-500 font-normal mt-1">
                  {getDateForDayLocal(i)}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hotel *
                  </label>
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
                        {hotel.name} - ${hotel.price}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lunch
                  </label>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">No lunch</option>
                    {availableMeals?.lunch.map((meal: any) => (
                      <option key={meal.id} value={meal.id}>
                        {meal.name} - ${meal.price}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dinner
                  </label>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">No dinner</option>
                    {availableMeals?.dinner.map((meal: any) => (
                      <option key={meal.id} value={meal.id}>
                        {meal.name} - ${meal.price}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        whileHover={{ scale: canProceed() ? 1.02 : 1 }}
        whileTap={{ scale: canProceed() ? 0.98 : 1 }}
        onClick={handleContinue}
        disabled={!canProceed() || isLoading}
        className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading...
          </>
        ) : (
          "Continue to Summary"
        )}
      </motion.button>
    </motion.div>
  );
}
