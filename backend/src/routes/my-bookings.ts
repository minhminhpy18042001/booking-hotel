import express, { Request, Response } from "express";
import verifyToken from "../middleware/auth";
import Hotel from "../models/hotel";
import { HotelType } from "../shared/types";


const router = express.Router();

router.get("/", verifyToken as any, async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find({
            bookings: { $elemMatch: { userId: req.userId,statusBooking:"booking" } },
        });

        const results = hotels.map((hotel) => {
            const userBookings = hotel.bookings.filter(
                (booking) => booking.userId === req.userId
            );

            const hotelWithUserBookings: HotelType = {
                ...hotel.toObject(),
                bookings: userBookings,
            };

            return hotelWithUserBookings;
        });

        res.status(200).send(results);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Unable to fetch bookings" });
    }
});
router.put("/:bookingId",verifyToken as any,async (req: Request, res: Response): Promise<any> =>{
    try {

        const bookingId=req.params.bookingId

        const hotela =await Hotel.findOne({bookings: { $elemMatch: { _id: bookingId, } }})
        if(!hotela){return res.status(404).json({ message: "Hotel not found" })}

        const booking = hotela.bookings.find(booking => booking._id.toString() === bookingId);
        if(!booking){return res.status(404).json({ message: "Booking not found"})}

        const today =new Date()
        const nights =Math.abs(booking.checkIn.getTime()-today.getTime())/(1000*60*60*24);
        if (nights<3){return res.status(404).json({ message: "Only can be cancelled before 3 days"})}
        const hotel = await Hotel.findOneAndUpdate({
            bookings: { $elemMatch: { _id: bookingId, } },
        },
        {
            $pull:{ bookings:{_id:bookingId}}
        },
        // {
        //     arrayFilters:[{bookings:{_id:req.params.bookingId}}]
        // }
        );
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        await hotel.save();
        res.status(201).json(hotel);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});
export default router;
