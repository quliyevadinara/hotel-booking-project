"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useBooking } from "../../context/BookingContext";
import { calculateTotal } from "../../lib/utils/price";
import { exportToPDF, printSummary } from "../../lib/utils/pdf";
import SuccessModal from "../SuccessModal";
import {
  getHotelById,
  getMealById,
  formatTripDate,
  getBoardTypeName,
} from "../../lib/utils/booking";

export default function BookingSummary() {
  const { state, dispatch } = useBooking();
  const [isExporting, setIsExporting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "save" | "pdf" | "print" | "warning";
    message?: string;
  }>({
    isOpen: false,
    type: "save",
  });

  useEffect(() => {
    checkIfSaved();
  }, [state]);

  const checkIfSaved = () => {
    try {
      const existingBookings = localStorage.getItem("hotel-bookings");
      if (!existingBookings) {
        setIsSaved(false);
        return;
      }

      const bookings = JSON.parse(existingBookings);

      const exists = bookings.some((booking: any) => {
        return (
          booking.citizenship === state.citizenship &&
          booking.destination === state.destination &&
          booking.startDate === state.startDate &&
          booking.numDays === state.numDays &&
          booking.boardType === state.boardType &&
          JSON.stringify(booking.dailySelections) ===
            JSON.stringify(state.dailySelections)
        );
      });

      setIsSaved(exists);
    } catch (error) {
      console.error("Error checking saved bookings:", error);
      setIsSaved(false);
    }
  };

  const handleSaveBooking = () => {
    if (state.step !== 3) {
      setModalState({
        isOpen: true,
        type: "warning",
        message: "Please complete the booking first",
      });
      return;
    }

    if (isSaved) {
      setModalState({
        isOpen: true,
        type: "warning",
        message: "This booking has already been saved to My Reservations",
      });
      return;
    }

    try {
      const existingBookings = localStorage.getItem("hotel-bookings");
      const bookings = existingBookings ? JSON.parse(existingBookings) : [];

      const newBooking = {
        ...state,
        id: `booking-${Date.now()}`,
        savedAt: Date.now(),
      };
      bookings.push(newBooking);
      localStorage.setItem("hotel-bookings", JSON.stringify(bookings));

      setIsSaved(true);

      setModalState({
        isOpen: true,
        type: "save",
        message: `Booking saved successfully! View in My Reservations.`,
      });
    } catch (error) {
      console.error("Error saving booking:", error);
      setModalState({
        isOpen: true,
        type: "warning",
        message: "Failed to save booking. Please try again.",
      });
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);

    try {
      const timestamp = Date.now();
      const filename = `booking-${state.destination}-${timestamp}.pdf`;

      const success = await exportToPDF(state, filename);

      if (success) {
        setModalState({
          isOpen: true,
          type: "pdf",
          message: "Your booking PDF has been downloaded successfully!",
        });
      } else {
        throw new Error("PDF generation failed");
      }
    } catch (error) {
      console.error("PDF export error:", error);
      setModalState({
        isOpen: true,
        type: "warning",
        message: "Failed to generate PDF. Please try print option.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    printSummary();
    setTimeout(() => {
      setModalState({
        isOpen: true,
        type: "print",
        message: "Print dialog opened successfully!",
      });
    }, 500);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-6xl mx-auto"
      >
        <div className="bg-white rounded-lg shadow-lg p-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex justify-between items-center mb-6"
          >
            <h2 className="text-3xl font-bold text-gray-800">
              Booking Summary
            </h2>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => dispatch({ type: "SET_STEP", step: 2 })}
                className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer px-4 py-2 border border-blue-600 rounded-lg"
              >
                ← Edit
              </motion.button>
            </div>
          </motion.div>

          {isSaved && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start gap-3"
            >
              <svg
                className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="font-semibold text-green-800">Already Saved</p>
                <p className="text-sm text-green-700 mt-1">
                  This booking is already in your reservations.
                </p>
              </div>
            </motion.div>
          )}

          {/* Detallar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-blue-50 rounded-lg p-6 mb-6"
          >
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
                <div className="font-medium">
                  {getBoardTypeName(state.boardType)}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Günlük Detallar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mb-6"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Daily Breakdown
            </h3>
            <div className="space-y-4">
              {Array.from({ length: state.numDays }, (_, i) => {
                const sel = state.dailySelections[i];
                const hotel = sel?.hotelId
                  ? getHotelById(state.destination, sel.hotelId)
                  : null;
                const lunch = sel?.lunchId
                  ? getMealById(state.destination, sel.lunchId, "lunch")
                  : null;
                const dinner = sel?.dinnerId
                  ? getMealById(state.destination, sel.dinnerId, "dinner")
                  : null;
                const dayTotal =
                  (hotel?.price || 0) +
                  (lunch?.price || 0) +
                  (dinner?.price || 0);

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + i * 0.05, duration: 0.5 }}
                    whileHover={{ scale: 1.01 }}
                    className="border border-gray-300 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="font-semibold text-lg">
                        Day {i + 1} - {formatTripDate(state.startDate, i)}
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        ${dayTotal}
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      {hotel && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Hotel:</span>
                          <span className="font-medium">
                            {hotel.name} (${hotel.price})
                          </span>
                        </div>
                      )}
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
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Total and Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-blue-100 text-sm mb-1">Total Amount</div>
                <div className="text-3xl font-bold">
                  ${calculateTotal(state)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <motion.button
                whileHover={{ scale: isSaved ? 1 : 1.05 }}
                whileTap={{ scale: isSaved ? 1 : 0.95 }}
                onClick={handleSaveBooking}
                disabled={isExporting || isSaved}
                className={`px-4 py-2 rounded-lg font-medium transition cursor-pointer text-sm flex items-center justify-center gap-2 ${
                  isSaved
                    ? "bg-green-100 text-green-700 cursor-not-allowed"
                    : "bg-white text-blue-600 hover:bg-blue-50"
                } disabled:opacity-50`}
              >
                {isSaved ? (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Saved
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Save
                  </>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExportPDF}
                disabled={isExporting}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition cursor-pointer text-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isExporting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
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
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                    >
                      <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" />
                      <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                    </svg>
                    PDF
                  </>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrint}
                disabled={isExporting}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition cursor-pointer text-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.875 1.5C6.839 1.5 6 2.34 6 3.375v2.99c-.426.053-.851.11-1.274.174-1.454.218-2.476 1.483-2.476 2.917v6.294a3 3 0 0 0 3 3h.27l-.155 1.705A1.875 1.875 0 0 0 7.232 22.5h9.536a1.875 1.875 0 0 0 1.867-2.045l-.155-1.705h.27a3 3 0 0 0 3-3V9.456c0-1.434-1.022-2.7-2.476-2.917A48.716 48.716 0 0 0 18 6.366V3.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM16.5 6.205v-2.83A.375.375 0 0 0 16.125 3h-8.25a.375.375 0 0 0-.375.375v2.83a49.353 49.353 0 0 1 9 0Zm-.217 8.265c.178.018.317.16.333.337l.526 5.784a.375.375 0 0 1-.374.409H7.232a.375.375 0 0 1-.374-.409l.526-5.784a.373.373 0 0 1 .333-.337 41.741 41.741 0 0 1 8.566 0Zm.967-3.97a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H18a.75.75 0 0 1-.75-.75V10.5ZM15 9.75a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V10.5a.75.75 0 0 0-.75-.75H15Z"
                    clipRule="evenodd"
                  />
                </svg>
                Print
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => dispatch({ type: "RESET" })}
                disabled={isExporting}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition cursor-pointer text-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                    clipRule="evenodd"
                  />
                </svg>
                New
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
      <SuccessModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        type={modalState.type}
        message={modalState.message}
      />
    </>
  );
}
