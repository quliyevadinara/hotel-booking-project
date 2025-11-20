import { BookingState, Hotel, Meal } from "@/types/hotel";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


// Hotel data
const hotelsData: Record<string, Hotel[]> = {
  Turkey: [
    { id: 101, name: "Hilton Istanbul", price: 120 },
    { id: 102, name: "Titanic Antalya", price: 90 },
  ],
  UAE: [
    { id: 201, name: "Dubai Marina Hotel", price: 200 },
    { id: 202, name: "Palm Jumeirah Resort", price: 300 },
  ],
  Italy: [{ id: 301, name: "Rome Center Hotel", price: 150 }],
};

// Meals data
const mealsData: Record<string, { lunch: Meal[]; dinner: Meal[] }> = {
  Turkey: {
    dinner: [
      { id: 1, name: "Turkish Kebab", price: 15 },
      { id: 2, name: "Istanbul Fish Plate", price: 18 },
      { id: 3, name: "Traditional Meat Stew", price: 20 },
    ],
    lunch: [
      { id: 4, name: "Chicken Pilaf", price: 10 },
      { id: 5, name: "Lentil Soup Set", price: 8 },
      { id: 6, name: "Veggie Plate", price: 9 },
    ],
  },
  UAE: {
    dinner: [
      { id: 7, name: "Arabic Mixed Grill", price: 25 },
      { id: 8, name: "Dubai Seafood Dinner", price: 30 },
    ],
    lunch: [
      { id: 9, name: "Shawarma Plate", price: 12 },
      { id: 10, name: "Hummus & Falafel Set", price: 11 },
    ],
  },
  Italy: {
    dinner: [
      { id: 11, name: "Pasta Carbonara", price: 20 },
      { id: 12, name: "Italian Seafood Dinner", price: 28 },
    ],
    lunch: [
      { id: 13, name: "Pizza Margherita", price: 12 },
      { id: 14, name: "Lasagna Lunch Set", price: 14 },
    ],
  },
};

export async function exportToPDF(
  bookingState: BookingState,
  filename: string
) {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;

    // Helper functions
    const getHotel = (id: number) => {
      const hotels = hotelsData[bookingState.destination] || [];
      return hotels.find((h) => h.id === id);
    };

    const getMeal = (id: number, type: "lunch" | "dinner") => {
      const meals = mealsData[bookingState.destination];
      return meals?.[type].find((m) => m.id === id);
    };

    const formatDate = (dateString: string, dayOffset: number) => {
      const date = new Date(dateString);
      date.setDate(date.getDate() + dayOffset);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    };

    const getBoardTypeName = (code: string) => {
      const types: Record<string, string> = {
        NB: "No Board",
        HB: "Half Board",
        FB: "Full Board",
      };
      return types[code] || code;
    };

    // Title
    doc.setFontSize(22);
    doc.setTextColor(31, 41, 55); // gray-800
    doc.text("Hotel Booking Summary", pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 10;

    // Subtitle
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128); // gray-500
    doc.text(
      `Generated on ${new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })}`,
      pageWidth / 2,
      yPosition,
      { align: "center" }
    );
    yPosition += 15;

    // Trip Details Section
    doc.setFontSize(16);
    doc.setTextColor(55, 65, 81); // gray-700
    doc.text("Trip Details", 14, yPosition);
    yPosition += 8;

    // Trip details table
    const tripDetailsData = [
      ["Citizenship", bookingState.citizenship],
      ["Destination", bookingState.destination],
      ["Start Date", formatDate(bookingState.startDate, 0)],
      ["Duration", `${bookingState.numDays} days`],
      ["Board Type", getBoardTypeName(bookingState.boardType)],
    ];

    autoTable(doc, {
      startY: yPosition,
      head: [],
      body: tripDetailsData,
      theme: "grid",
      styles: {
        fontSize: 11,
        cellPadding: 5,
      },
      columnStyles: {
        0: {
          fontStyle: "bold",
          fillColor: [243, 244, 246],
          textColor: [107, 114, 128],
        },
        1: { textColor: [31, 41, 55] },
      },
      margin: { left: 14, right: 14 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;

    // Daily Breakdown Section
    doc.setFontSize(16);
    doc.setTextColor(55, 65, 81);
    doc.text("Daily Breakdown", 14, yPosition);
    yPosition += 8;

    // Prepare daily breakdown data
    const dailyData: any[] = [];
    let totalAmount = 0;

    for (let i = 0; i < bookingState.numDays; i++) {
      const sel = bookingState.dailySelections[i];
      if (!sel) continue;

      const hotel = sel.hotelId ? getHotel(sel.hotelId) : null;
      const lunch = sel.lunchId ? getMeal(sel.lunchId, "lunch") : null;
      const dinner = sel.dinnerId ? getMeal(sel.dinnerId, "dinner") : null;

      const hotelPrice = hotel?.price || 0;
      const lunchPrice = lunch?.price || 0;
      const dinnerPrice = dinner?.price || 0;
      const dayTotal = hotelPrice + lunchPrice + dinnerPrice;
      totalAmount += dayTotal;

      // Day header
      dailyData.push([
        {
          content: `Day ${i + 1} - ${formatDate(bookingState.startDate, i)}`,
          colSpan: 2,
          styles: {
            fontStyle: "bold",
            fontSize: 12,
            fillColor: [243, 244, 246],
            textColor: [31, 41, 55],
          },
        },
        {
          content: `$${dayTotal}`,
          styles: {
            fontStyle: "bold",
            fontSize: 12,
            fillColor: [243, 244, 246],
            textColor: [37, 99, 235], // blue-600
            halign: "right",
          },
        },
      ]);

      // Hotel
      if (hotel) {
        dailyData.push(["  Hotel:", hotel.name, `$${hotel.price}`]);
      }

      // Lunch
      if (lunch) {
        dailyData.push(["  Lunch:", lunch.name, `$${lunch.price}`]);
      }

      // Dinner
      if (dinner) {
        dailyData.push(["  Dinner:", dinner.name, `$${dinner.price}`]);
      }

      // Empty row for spacing
      if (i < bookingState.numDays - 1) {
        dailyData.push(["", "", ""]);
      }
    }

    autoTable(doc, {
      startY: yPosition,
      head: [["Service", "Description", "Price"]],
      body: dailyData,
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 4,
      },
      headStyles: {
        fillColor: [37, 99, 235], // blue-600
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: "auto" },
        2: { cellWidth: 35, halign: "right" },
      },
      margin: { left: 14, right: 14 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;

    // Total Section
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    // Total box
    doc.setFillColor(37, 99, 235); // blue-600
    doc.rect(14, yPosition, pageWidth - 28, 30, "F");

    doc.setFontSize(12);
    doc.setTextColor(219, 234, 254); // blue-100
    doc.text("Total Amount", 20, yPosition + 12);

    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text(`$${totalAmount}`, pageWidth - 20, yPosition + 22, {
      align: "right",
    });

    // Footer
    yPosition = doc.internal.pageSize.getHeight() - 15;
    doc.setFontSize(9);
    doc.setTextColor(156, 163, 175); // gray-400
    doc.text("Hotel Booking System", 14, yPosition);
    doc.text(`Booking ID: ${Date.now()}`, pageWidth - 14, yPosition, {
      align: "right",
    });

    // Save PDF
    doc.save(filename);
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
}

export function printSummary() {
  window.print();
}
