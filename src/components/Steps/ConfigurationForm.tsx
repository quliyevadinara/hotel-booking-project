"use client";

import React from "react";
import { useBooking } from "../../context/BookingContext";
import { countries } from "../../data/countries";
import { boardTypes } from "../../data/boardTypes";

export default function ConfigurationForm() {
  const { state, dispatch } = useBooking();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.citizenship || !state.startDate || !state.destination) {
      alert("Please fill in all required fields");
      return;
    }

    const selections: Record<
      number,
      {
        hotelId: number | null;
        lunchId: number | null;
        dinnerId: number | null;
      }
    > = {};
    for (let i = 0; i < state.numDays; i++) {
      selections[i] = { hotelId: null, lunchId: null, dinnerId: null };
    }
    dispatch({
      type: "SET_FIELD",
      field: "dailySelections",
      value: selections,
    });
    dispatch({ type: "SET_STEP", step: 2 });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Trip Configuration
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Citizenship *
          </label>
          <select
            value={state.citizenship}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "citizenship",
                value: e.target.value,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select your country</option>
            {countries.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date *
            </label>
            <input
              type="date"
              value={state.startDate}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "startDate",
                  value: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Days *
            </label>
            <input
              type="number"
              min={1}
              max={30}
              value={state.numDays}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "numDays",
                  value: parseInt(e.target.value) || 1,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Destination *
          </label>
          <select
            value={state.destination}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "destination",
                value: e.target.value,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select destination</option>
            {countries.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Board Type *
          </label>
          <div className="space-y-3">
            {boardTypes.map((board) => (
              <label
                key={board.code}
                className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
              >
                <input
                  type="radio"
                  name="boardType"
                  value={board.code}
                  checked={state.boardType === board.code}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_FIELD",
                      field: "boardType",
                      value: e.target.value,
                    })
                  }
                  className="w-4 h-4 text-blue-600"
                />
                <div className="ml-3">
                  <div className="font-medium text-gray-900">{board.name}</div>
                  <div className="text-sm text-gray-500">
                    {board.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition cursor-pointer"
        >
          Continue to Daily Selection
        </button>
      </form>
    </div>
  );
}
