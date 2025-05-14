import express, { Request, Response } from "express";
import Hotel from "../models/hotel";
import { BookingType, HotelSearchResponse } from "../shared/types";
import { param, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";
import nodemailer from "nodemailer";
const router =express.Router();
router.get("/search", async (req: Request, res: Response) => {
  try {
    const query = constructSearchQuery(req.query);
    let sortOptions = {};
    switch (req.query.sortOption) {
      case "starRating":
        sortOptions = { starRating: -1 };
        break;
      case "pricePerNightAsc":
        sortOptions = { pricePerNight: 1 };
        break;
      case "pricePerNightDesc":
        sortOptions = { pricePerNight: -1 };
        break;
    }
    const pageSize = 5;
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );
    const skip = (pageNumber - 1) * pageSize;

    const hotels = await Hotel.find(query).sort(sortOptions).skip(skip).limit(pageSize);
    const total = await Hotel.countDocuments(query);
    const response: HotelSearchResponse = {
      data: hotels,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };
    res.json(response)
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});
router.get("/recently-watched", (req: Request, res: Response) => {
  const recentlyWatched = req.cookies.recentlyWatched ? JSON.parse(req.cookies.recentlyWatched) : [];
  res.status(200).json(recentlyWatched);
});
// Create a new booking
router.post(
  "/:hotelId/bookings/:roomId",
  verifyToken as any,
  async (req: Request, res: Response):Promise<any> => {
    try {  
      const newBooking: BookingType = {
        ...req.body,
        userId: req.userId,
        statusBooking:"booked",
      };
      if (newBooking.totalCost ===0)
        {
          return res.status(400).json({message:"Change checkOut date"})
        }
        const today =new Date()
      const hotel = await Hotel.findOneAndUpdate(
        { _id: req.params.hotelId },
        {
          $push: { bookings: newBooking },
          lastUpdated: today,
        },
        { new: true } // Ensure the updated document is returned
      );

      if (!hotel) {
        return res.status(400).json({ message: "Hotel not found" });
      }

      // Retrieve the newly added booking
      const addedBooking = hotel.bookings[hotel.bookings.length - 1]; // Get the last booking
      if (!addedBooking) {
        return res.status(500).json({ message: "Failed to retrieve the new booking" });
      }
      const newBookingId = addedBooking._id; // Access the ID of the new booking

      await hotel.save();

      // Nodemailer configuration
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.GOOGLE_USER,
          pass: process.env.GOOGLE_PASS as string,
        },
      });

      var mailOptions = {
        from: process.env.GOOGLE_USER,
        to: newBooking.email,
        subject: 'Booking Confirmation - Your Booking ID: ' + newBookingId,
        html: `
          <h1>Booking Confirmation</h1>
          <p>Dear ${newBooking.firstName} ${newBooking.lastName},</p>
          <p>Your booking at <strong>${hotel.name}</strong> has been confirmed.</p>
          <p><strong>Booking ID:</strong> ${newBookingId}</p>
          <p>Thank you for choosing our service!</p>
          <p><a href="${process.env.FRONTEND_URL}/my-bookings" style="display: inline-block; padding: 10px 20px; color: white; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Manager My Bookings</a></p>
          <p>Best regards,</p>
          <p>The Booking Team</p>
        `,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      res.status(200).send();
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "something went wrong" });
    }
  }
);
router.get("/", async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find().sort("-lastUpdated");
    res.json(hotels);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching hotels" });
  }
});
router.get("/approved", async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ statusHotel: { $ne: "pending" } }).sort("-lastUpdated");
    res.json(hotels);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching hotels" });
  }
});
router.put("/approve/:id", async (req: Request, res: Response): Promise<any> => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, {
      statusHotel: "approved",
    });
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error approving hotel" });
  }
});
router.get("/pending", async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ statusHotel: "pending" }).sort("-lastUpdated");
    res.json(hotels);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching hotels" });
  }
});
router.get("/:id",[param("id").notEmpty().withMessage("Hotel ID is required")],
  async (req: Request, res: Response): Promise<any>  => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = req.params.id.toString();

    try {
      const hotel = await Hotel.findById(id);
      const recentlyWatched = req.cookies.recentlyWatched ? JSON.parse(req.cookies.recentlyWatched) : [];
      if (!recentlyWatched.includes(id)) {
        recentlyWatched.push(id);
      }
      res.cookie("recentlyWatched", JSON.stringify(recentlyWatched), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3 * 24 * 60 * 60 * 1000,
      });
      res.json(hotel);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching hotel" });
    }
  }
);
router.get("/:hotelId/:roomId", verifyToken as any, async (req: Request, res: Response): Promise<any>  => {
  const id = req.params.hotelId.toString();
  const roomId = req.params.roomId.toString();
  try {
    const hotel = await Hotel.findOne({
      _id: id,
    });
    if(!hotel){
      return res.status(404).json({message:"Hotel not found"});
    }
    const room = hotel.rooms.find(room => room._id.toString() === roomId);
    // const result = hotel.rooms.map((room) => {
    //   if (room._id === roomId) {
    //     return room;
    //   };
    // });
    // const result=hotel.rooms.filter((room)=>room._id === roomId);

    res.status(200).send(room);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};

  if (queryParams.destination) {
    constructedQuery.$or = [
      { city: new RegExp(queryParams.destination, "i") },
      { country: new RegExp(queryParams.destination, "i") },
      { name: new RegExp(queryParams.destination, "i") },
    ];
  }

  if (queryParams.adultCount) {
    constructedQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount),
    };
  }

  if (queryParams.childCount) {
    constructedQuery.childCount = {
      $gte: parseInt(queryParams.childCount),
    };
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }

  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  }

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : parseInt(queryParams.stars);

    constructedQuery.starRating = { $in: starRatings };
  }

  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice),
    };
  }

  constructedQuery.statusHotel = { $ne: "pending" };

  return constructedQuery;
};
export default router;
