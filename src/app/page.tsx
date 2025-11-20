"use client";

import { BookingProvider } from "../context/BookingContext";
import StepIndicator from "../components/StepIndicator";
import AppContent from "../components/AppContent";

export default function Page() {
  return (
    <BookingProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-7xl mx-auto mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-2">
            Hotel Booking System
          </h1>
          <p className="text-center text-gray-600">
            Plan your perfect vacation
          </p>
        </div>

        <StepIndicator />
        <AppContent />
      </div>
    </BookingProvider>
  );
}
