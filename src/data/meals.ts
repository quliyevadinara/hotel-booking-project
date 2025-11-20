export const meals = {
  Turkey: {
    dinner: [
      { id: 1, name: "Turkish Kebab", price: 15 },
      { id: 2, name: "Istanbul Fish Plate", price: 18 },
      { id: 3, name: "Traditional Meat Stew", price: 20 }
    ],
    lunch: [
      { id: 4, name: "Chicken Pilaf", price: 10 },
      { id: 5, name: "Lentil Soup Set", price: 8 },
      { id: 6, name: "Veggie Plate", price: 9 }
    ]
  },
  UAE: {
    dinner: [
      { id: 7, name: "Arabic Mixed Grill", price: 25 },
      { id: 8, name: "Dubai Seafood Dinner", price: 30 }
    ],
    lunch: [
      { id: 9, name: "Shawarma Plate", price: 12 },
      { id: 10, name: "Hummus & Falafel Set", price: 11 }
    ]
  },
  Italy: {
    dinner: [
      { id: 11, name: "Pasta Carbonara", price: 20 },
      { id: 12, name: "Italian Seafood Dinner", price: 28 }
    ],
    lunch: [
      { id: 13, name: "Pizza Margherita", price: 12 },
      { id: 14, name: "Lasagna Lunch Set", price: 14 }
    ]
  }
} as const;
