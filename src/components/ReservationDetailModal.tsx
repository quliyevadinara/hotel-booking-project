"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BookingState } from "@/types/hotel";
import {
  getHotelById,
  getMealById,
  calculateBookingTotal,
  formatTripDate,
  getBoardTypeName,
} from "@/lib/utils/booking";

interface ReservationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: BookingState | null;
}

export default function ReservationDetailModal({
  isOpen,
  onClose,
  reservation,
}: ReservationDetailModalProps) {
  if (!reservation) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto my-8"
            >
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-2xl z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      Booking Details
                    </h2>
                    <p className="text-blue-100 text-sm">
                      View your reservation summary
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition cursor-pointer"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </motion.button>
                </div>
              </div>

              <div className="p-6">
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Trip Information
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Citizenship</div>
                      <div className="font-medium text-gray-900">
                        {reservation.citizenship}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Destination</div>
                      <div className="font-medium text-gray-900">
                        {reservation.destination}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Start Date</div>
                      <div className="font-medium text-gray-900">
                        {formatTripDate(reservation.startDate, 0)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Duration</div>
                      <div className="font-medium text-gray-900">
                        {reservation.numDays} days
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Board Type</div>
                      <div className="font-medium text-gray-900">
                        {getBoardTypeName(reservation.boardType)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Daily Breakdown
                  </h3>
                  <div className="space-y-4">
                    {Array.from({ length: reservation.numDays }, (_, i) => {
                      const sel = reservation.dailySelections[i];
                      const hotel = sel?.hotelId
                        ? getHotelById(reservation.destination, sel.hotelId)
                        : null;
                      const lunch = sel?.lunchId
                        ? getMealById(
                            reservation.destination,
                            sel.lunchId,
                            "lunch"
                          )
                        : null;
                      const dinner = sel?.dinnerId
                        ? getMealById(
                            reservation.destination,
                            sel.dinnerId,
                            "dinner"
                          )
                        : null;
                      const dayTotal =
                        (hotel?.price || 0) +
                        (lunch?.price || 0) +
                        (dinner?.price || 0);

                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="font-semibold text-lg text-gray-800">
                              Day {i + 1} -{" "}
                              {formatTripDate(reservation.startDate, i)}
                            </div>
                            <div className="text-lg font-bold text-blue-600">
                              ${dayTotal}
                            </div>
                          </div>
                          <div className="space-y-2 text-sm">
                            {hotel && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Hotel:</span>
                                <span className="font-medium text-gray-900">
                                  {hotel.name} (${hotel.price})
                                </span>
                              </div>
                            )}
                            {lunch && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Lunch:</span>
                                <span className="font-medium text-gray-900">
                                  {lunch.name} (${lunch.price})
                                </span>
                              </div>
                            )}
                            {dinner && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Dinner:</span>
                                <span className="font-medium text-gray-900">
                                  {dinner.name} (${dinner.price})
                                </span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-blue-100 text-sm mb-1">
                        Total Amount
                      </div>
                      <div className="text-3xl font-bold">
                        ${calculateBookingTotal(reservation)}
                      </div>
                    </div>
                    <div className="text-right ">
                      <div className="text-blue-100 text-sm mb-1">Status</div>
                      <span className="bg-green-500 px-4 py-2 rounded-full text-sm font-medium">
                        Confirmed
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="border-t p-6 bg-gray-50 rounded-b-2xl">
                <div className="flex justify-end gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition cursor-pointer"
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
