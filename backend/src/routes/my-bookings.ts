import express, { Request, Response } from "express";
import verifyToken from "../middleware/auth";
import Hotel from "../models/hotel";
import { HotelType } from "../shared/types";
import multer from "multer";
import nodemailer from "nodemailer";
const upload = multer(); 
const router = express.Router();

router.get("/", verifyToken as any, async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.aggregate([
            {
                $match: {
                    bookings: { $elemMatch: { userId: req.userId } } // Match hotels with user bookings
                }
            },
            {
                $unwind: "$bookings" // Unwind the bookings array
            },
            {
                $match: {
                    "bookings.userId": req.userId // Filter to only include bookings for the current user
                }
            },
            {
                $sort: { "bookings.checkIn": -1} // Sort by checkout date (ascending)
            },
            {
                $group: {
                    _id: "$_id", // Group back to hotel level
                    userId:{$first:"$userId"},
                    name: { $first: "$name" }, // Include other hotel fields as needed
                    city: { $first: "$city" },
                    country:{$first:"$country"},
                    description:{$first:"$description"},
                    type:{$first:"$type"},
                    adultCount:{$first:"$adultCount"},
                    childCount:{$first:"$childCount"},
                    facilities:{$first:"$facilities"},
                    pricePerNight:{$first:"$pricePerNight"},
                    starRating:{$first:"$starRating"},
                    imageUrls:{$first:"$imageUrls"},
                    lastUpdated:{$first:"$lastUpdated"},
                    rooms:{$first:"$rooms"},
                    bookings: { $push: "$bookings" } // Collect bookings back into an array
                    // Add other fields you want to include
                }
            },
            {
                $sort: { "name": 1 } // Sort the final output by hotel name (or any other field)
            }
        ]);
        // const results = hotels.map((hotel) => {
        //     const userBookings = hotel.bookings.filter(
        //         (booking) => booking.userId === req.userId
        //     );

        //     const hotelWithUserBookings: HotelType = {
        //         ...hotel.toObject(),
        //         bookings: userBookings,
        //     };

        //     return hotelWithUserBookings;
        // });

        res.status(200).send(hotels);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Unable to fetch bookings" });
    }
});
router.get("/:bookingId",verifyToken as any,async (req: Request, res: Response): Promise<any>=>{
    try {
        const bookingId =req.params.bookingId;
        const hotel =await Hotel.findOne({bookings: { $elemMatch: { userId: req.userId,_id: bookingId, } }})
        if(!hotel){
            return res.status(404).json({ message: "Booking not found" });
        }
        const booking = hotel.bookings.find(b => b._id.toString() === bookingId.toString());
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        res.status(200).send(booking)
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
})
// Update booking status to "cancelled"
router.put("/:bookingId",verifyToken as any,async (req: Request, res: Response): Promise<any> =>{
    try {

        const bookingId=req.params.bookingId

        const hotela =await Hotel.findOne({bookings: { $elemMatch: { userId: req.userId,_id: bookingId, } }})
        if(!hotela){return res.status(404).json({ message: "Hotel not found" })}

        const booking = hotela.bookings.find(booking => booking._id.toString() === bookingId);
        if(!booking){return res.status(404).json({ message: "Booking not found"})}

        const today =new Date()
        const before =booking.checkIn.getTime() >= today.getTime()
        const nights =Math.abs(booking.checkIn.getTime()-today.getTime())/(1000*60*60*24);
        console.log(nights,before)
        if (nights<3 || !before){return res.status(404).json({ message: "Only can be cancelled before 3 days"})}
        const hotel = await Hotel.findOneAndUpdate({
            bookings: { $elemMatch: { _id: bookingId, } },
        },
        { $set: { "bookings.$.statusBooking": "cancelled" } }, // Update the booking status to "Cancelled"
        { new: true }
        );
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        // Nodemailer configuration for cancellation
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
            to: booking.email,
            subject: 'Booking Cancellation - Your Booking ID: ' + bookingId,
            html: `
              <h1>Booking Cancellation</h1>
              <p>Dear ${booking.firstName} ${booking.lastName},</p>
              <p>Your booking at <strong>${hotela.name}</strong> has been cancelled.</p>
              <p><strong>Booking ID:</strong> ${bookingId}</p>
              <p>If you have any questions, please contact our support team.</p>
              <p>
                <a href="${process.env.FRONTEND_URL}/my-bookings" style="display: inline-block; padding: 10px 20px; color: white; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Manage My Bookings</a>
              </p>
              <p>
                <a href="${process.env.FRONTEND_URL}/detail/${hotela._id}" style="display: inline-block; padding: 10px 20px; color: white; background-color: #28a745; text-decoration: none; border-radius: 5px;">Book Again</a>
              </p>
              <p>Best regards,</p>
              <p>The Booking Team</p>
            `,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Cancellation email sent: " + info.response);
            }
        });
        // Refund 10% credit if paymentMethod is 1
        if (booking.paymentMethod === 1) {
            const User = require('../models/user').default;
            const Payment = require('../models/payment').default;
            const refundAmount = Math.round(booking.totalCost * 0.1 * 25800); // Assuming totalCost is in USD and we convert to VND
            await User.findOneAndUpdate(
                { _id: req.userId },
                { $inc: { credit: refundAmount } }
            );
            // Create a payment record for the refund
            await Payment.create({
                amount: refundAmount,
                userId: req.userId,
                paymentMethod: 'credit',
                paymentStatus: 'completed',
                paymentDate: new Date(),
                paymentFor: 'refund',
            });
        }
        res.status(201).json(hotel);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});
router.put("/review/:bookingId",verifyToken as any,upload.none(),async (req: Request, res: Response): Promise<any> =>{
    try {
        const bookingId =req.params.bookingId;
        const { score, review,comment } = req.body;
        const date =new Date();
        if ( score < 1 || score > 10) {
            return res.status(400).json({ message: "Score must be a number between 1 and 10." });
        }
        // if (typeof review !== 'string' || review.trim() === '') {
        //     return res.status(400).json({ message: "Review cannot be empty." });
        // }

        const hotel =await Hotel.findOne({bookings: { $elemMatch: { userId: req.userId,_id: bookingId, } }})

        if (!hotel) {
            return res.status(404).json({ message: "Booking not found" });
        }
        // Update the review in the booking
        const booking = hotel.bookings.find(b => b._id.toString() === bookingId.toString());
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        // Update the rating field
        booking.rating = { score, review,comment,date }; // Assuming rating is an object with score and review

        // Save the updated hotel document
        await hotel.save();
        res.status(200).json({ message: "Review updated successfully", booking });
    } catch (error) {
        res.status(500).json({ message: error });
    }
});
export default router;
