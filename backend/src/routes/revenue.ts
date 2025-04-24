// revenueRouter.ts
import express, { Request, Response } from "express";
import Hotel from "../models/hotel";
import { BookingType } from "../shared/types";
import { param, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";
import verifyRole from "../middleware/verifyRole";

const router = express.Router();
// Get revenue data
router.get("/", verifyToken as any, verifyRole(['admin']), async (req: Request, res: Response) => {
  try {
    const revenueData = await getRevenueData();
    res.json(revenueData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching revenue data" });
  }
});
// Get revenue data by hotel ID
router.get("/:hotelId", verifyToken as any, verifyRole(['admin', 'owner']), [
  param("hotelId").notEmpty().withMessage("Hotel ID is required"),
], async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const hotelId = req.params.hotelId.toString();
    const revenueData = await getRevenueDataByHotelId(hotelId);
    res.json(revenueData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching revenue data" });
  }
});
// Get revenue data by hotel ID and date range
router.get("/hotels/:hotelId/by-date-range", verifyToken as any, verifyRole(['admin', 'owner']), [
  param("hotelId").notEmpty().withMessage("Hotel ID is required"),
], async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const hotelId = req.params.hotelId.toString();
    const startDate = req.query.startDate ? req.query.startDate.toString() : '';
    const endDate = req.query.endDate ? req.query.endDate.toString() : '';
    const revenueData = await getRevenueHotelDataByEveryDate(hotelId, startDate, endDate);
    res.json(revenueData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching revenue data" });
  }
});
// Get revenue data by date range
router.get("/hotels/by-date-range", verifyToken as any, async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const startDate = req.query.startDate ? req.query.startDate.toString() : '';
    const endDate = req.query.endDate ? req.query.endDate.toString() : '';
    const revenueData = await getRevenueDataByDateRange(startDate, endDate);
    res.json(revenueData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching revenue data" });
  }
});
router.get("/hotelsOwner/by-date-range", verifyToken as any, async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const startDate = req.query.startDate ? req.query.startDate.toString() : '';
    const endDate = req.query.endDate ? req.query.endDate.toString() : '';
    const userId =req.userId
    const revenueData = await getRevenueDataOwnerByDateRange(userId,startDate, endDate);
    res.json(revenueData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching revenue data" });
  }
});
async function getRevenueData() {
  const hotels = await Hotel.find().populate("bookings");
  const revenueData = hotels.reduce((acc: { id: string, hotelName: string; revenue: number }[], hotel) => {
    const hotelRevenue = hotel.bookings.reduce((acc, booking) => {
      if (booking.statusBooking === 'completed') { // Only include completed bookings
        return acc + booking.totalCost;
      }
      return acc;
    }, 0);
    acc.push({ id: hotel._id, hotelName: hotel.name, revenue: hotelRevenue });
    return acc;
  }, []);
  return revenueData;
}
async function getRevenueDataByHotelId(hotelId: string) {
  const hotel = await Hotel.findById(hotelId).populate("bookings");
  if (!hotel) {
    throw new Error("Hotel not found");
  }
  const hotelRevenue = hotel.bookings.reduce((acc, booking) => {
    if (booking.statusBooking === 'completed') { // Only include completed bookings
      return acc + booking.totalCost;
    }
    return acc;
  }, 0);
  return { hotelName: hotel.name, revenue: hotelRevenue };
}
async function getRevenueDataByDateRange(startDate: string, endDate: string) {
  const hotels = await Hotel.find().populate("bookings");
  const revenueData = hotels.reduce((acc: { id: string, hotelName: string; revenue: number }[], hotel) => {
    const hotelRevenue = hotel.bookings.reduce((acc, booking) => {
      const bookingDate = new Date(booking.checkIn);
      if (bookingDate >= new Date(startDate) && bookingDate <= new Date(endDate) && booking.statusBooking === 'completed') { // Only include completed bookings
        // Check if the booking date is within the specified range
        return acc + booking.totalCost;
      }
      return acc;
    }, 0);
    acc.push({ id: hotel._id, hotelName: hotel.name, revenue: hotelRevenue });
    return acc;
  }, []);
  return revenueData;
}
async function getRevenueDataOwnerByDateRange(userId:string,startDate: string, endDate: string) {
  const hotels = await Hotel.find({userId:userId}).populate("bookings");
  const revenueData = hotels.reduce((acc: { id: string, hotelName: string; revenue: number }[], hotel) => {
    const hotelRevenue = hotel.bookings.reduce((acc, booking) => {
      const bookingDate = new Date(booking.checkIn);
      if (bookingDate >= new Date(startDate) && bookingDate <= new Date(endDate) && booking.statusBooking === 'completed') { // Only include completed bookings
        // Check if the booking date is within the specified range
        return acc + booking.totalCost;
      }
      return acc;
    }, 0);
    acc.push({ id: hotel._id, hotelName: hotel.name, revenue: hotelRevenue });
    return acc;
  }, []);
  return revenueData;
}
async function getRevenueDataByIdAndDate(hotelId: string, startDate: string, endDate: string) {
  const hotel = await Hotel.findById(hotelId).populate("bookings");
  if (!hotel) {
    throw new Error("Hotel not found");
  }

  const bookings = hotel.bookings.filter((booking) => {
    const bookingDate = new Date(booking.checkIn);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return bookingDate >= start && bookingDate <= end;
  });

  const revenue = bookings.reduce((acc, booking) => {
    if (booking.statusBooking === 'completed') { // Only include completed bookings
      return acc + booking.totalCost;
    }
    return acc;
  }, 0);

  return { hotelName: hotel.name, revenue };
}
async function getRevenueHotelDataByEveryDate(hotelId: string, startDate: string, endDate: string) {
  const hotel = await Hotel.findById(hotelId).populate("bookings");
  if (!hotel) {
    throw new Error("Hotel not found");
  }

  const bookings = hotel.bookings;
  const revenueData: { date: string; revenue: number }[] = [];

  const start = new Date(startDate);
  const end = new Date(endDate);
  let totalRevenue = 0;
  for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
    const dateStr = date.toISOString().split('T')[0];
    const bookingsForDate = bookings.filter((booking) => {
      const bookingDate = new Date(booking.checkIn);
      return bookingDate.toISOString().split('T')[0] === dateStr;
    });

    const revenue = bookingsForDate.reduce((acc, booking) => {
      if (booking.statusBooking === 'completed') { // Only include completed bookings
        return acc + booking.totalCost;
      }
      return acc;
    }, 0);
    totalRevenue += revenue;
    revenueData.push({ date: dateStr, revenue });
  }

  return {
    hotelName: hotel.name,
    revenueData,
    totalRevenue,
  };
}
export default router;