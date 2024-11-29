import express, {Request,Response} from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser"
import {v2 as cloudinary} from "cloudinary";
import myHotelRoutes from "./routes/my-hotels";
import hotelsRoutes from "./routes/hotels";
import bookingRoutes from "./routes/my-bookings";
import cron from 'node-cron';
import Hotel from "./models/hotel";
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.COUDINARY_API_SECRET,
});
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);

const app =express();
cron.schedule('0 * * * *', async () => {
    try {
        const currentDate = new Date();
        const hotels = await Hotel.find({});

        for (const hotel of hotels) {
            const updatedBookings = hotel.bookings.map((booking) => {
                if (new Date(booking.checkOut) < currentDate && booking.statusBooking === 'booking') {
                    booking.statusBooking = 'completed'; // Update the 
                    console.log(booking._id)
                }
                return booking;
            });

            hotel.bookings = updatedBookings;
            await hotel.save();
        }

        console.log('Booking statuses updated successfully');
    } catch (error) {
        console.error('Error updating booking statuses:', error);
    }
});
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended :true}));
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true,
}));
app.use("/api/auth", authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/my-hotels",myHotelRoutes);
app.use("/api/hotels",hotelsRoutes);
app.use("/api/my-bookings",bookingRoutes)
app.listen(7000,()=>{
    console.log("server is running on localhost:7000");
});