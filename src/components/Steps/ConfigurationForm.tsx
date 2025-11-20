"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBooking } from "../../context/BookingContext";
import { countries } from "../../data/countries";
import { boardTypes } from "../../data/boardTypes";
import {
  configurationSchema,
  ConfigurationFormData,
} from "../../lib/validations/booking";

export default function ConfigurationForm() {
  const { state, dispatch } = useBooking();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ConfigurationFormData>({
    resolver: zodResolver(configurationSchema),
    defaultValues: {
      citizenship: state.citizenship,
      startDate: state.startDate,
      numDays: state.numDays,
      destination: state.destination,
      boardType: state.boardType,
    },
  });

  const watchedBoardType = watch("boardType");

  const onSubmit = async (data: ConfigurationFormData) => {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      Object.entries(data).forEach(([key, value]) => {
        dispatch({
          type: "SET_FIELD",
          field: key as keyof ConfigurationFormData,
          value,
        });
      });

      const selections: Record<
        number,
        {
          hotelId: number | null;
          lunchId: number | null;
          dinnerId: number | null;
        }
      > = {};
      for (let i = 0; i < data.numDays; i++) {
        selections[i] = { hotelId: null, lunchId: null, dinnerId: null };
      }
      dispatch({
        type: "SET_FIELD",
        field: "dailySelections",
        value: selections,
      });
      dispatch({ type: "SET_STEP", step: 2 });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const ErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null;
    return (
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="text-red-500 text-sm mt-1"
      >
        {message}
      </motion.p>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8"
    >
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-3xl font-bold text-gray-800 mb-6"
      >
        Trip Configuration
      </motion.h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Citizenship *
          </label>
          <select
            {...register("citizenship")}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              errors.citizenship ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select your country</option>
            {countries.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <AnimatePresence>
            <ErrorMessage message={errors.citizenship?.message} />
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date *
            </label>
            <input
              type="date"
              {...register("startDate")}
              min={new Date().toISOString().split("T")[0]}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                errors.startDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            <AnimatePresence>
              <ErrorMessage message={errors.startDate?.message} />
            </AnimatePresence>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Days *
            </label>
            <input
              type="number"
              {...register("numDays", { valueAsNumber: true })}
              min={1}
              max={30}
              onKeyDown={(e) => {
                if (
                  e.key === "Backspace" ||
                  e.key === "Delete" ||
                  e.key === "ArrowLeft" ||
                  e.key === "ArrowRight" ||
                  e.key === "Tab"
                ) {
                  return;
                }
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              onFocus={(e) => e.target.select()}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                errors.numDays ? "border-red-500" : "border-gray-300"
              }`}
            />
            <AnimatePresence>
              <ErrorMessage message={errors.numDays?.message} />
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Destination *
          </label>
          <select
            {...register("destination")}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              errors.destination ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select destination</option>
            {countries.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <AnimatePresence>
            <ErrorMessage message={errors.destination?.message} />
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Board Type *
          </label>
          <div className="space-y-3">
            {boardTypes.map((board, index) => (
              <motion.label
                key={board.code}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                  watchedBoardType === board.code
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  {...register("boardType")}
                  value={board.code}
                  className="w-4 h-4 text-blue-600"
                />
                <div className="ml-3">
                  <div className="font-medium text-gray-900">{board.name}</div>
                  <div className="text-sm text-gray-500">
                    {board.description}
                  </div>
                </div>
              </motion.label>
            ))}
          </div>
          <AnimatePresence>
            <ErrorMessage message={errors.boardType?.message} />
          </AnimatePresence>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition cursor-pointer disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
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
            "Continue to Daily Selection"
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
