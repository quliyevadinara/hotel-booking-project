"use client";

import React from "react";
import { useBooking } from "../context/BookingContext";

export default function StepIndicator() {
  const { state } = useBooking();
  const steps = [
    { num: 1, label: "Configuration" },
    { num: 2, label: "Daily Selection" },
    { num: 3, label: "Summary" },
  ];

  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, idx) => (
          <React.Fragment key={step.num}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  state.step >= step.num
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {step.num}
              </div>
              <div className="text-sm mt-2 font-medium text-gray-700">
                {step.label}
              </div>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-4 ${
                  state.step > step.num ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
