"use client";

import { useBooking } from "../context/BookingContext";
import BookingSummary from "./Steps/BookingSummary";
import ConfigurationForm from "./Steps/ConfigurationForm";
import DailyConfiguration from "./Steps/DailyConfiguration";

export default function AppContent() {
  const { state } = useBooking();

  switch (state.step) {
    case 1:
      return <ConfigurationForm />;
    case 2:
      return <DailyConfiguration />;
    case 3:
      return <BookingSummary />;
    default:
      return <ConfigurationForm />;
  }
}
