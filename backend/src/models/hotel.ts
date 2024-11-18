import mongoose from "mongoose";
import {  BookingType, HotelType,Room } from "../shared/types";
const bookingSchema = new mongoose.Schema<BookingType>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  adultCount: { type: Number, required: true },
  childCount: { type: Number, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  userId: { type: String, required: true },
  roomId:{type:String,required:true},
  totalCost: { type: Number, required: true },
  statusBooking:{type: String,required:true},
});
const roomSchema =new mongoose.Schema<Room>({
  name:{ type:String,required:true},
  roomSize:{type:String, required:true},
  description:{type:String, required:true},
  typeBed:{type:String,required:true},
  pricePerNight:{type:Number,required:true},
  imageUrls:[{ type: String, required: true }],
  Bookings:[bookingSchema],
});
const hotelSchema =new mongoose.Schema<HotelType>({
userId: { type: String, required: true },
  name: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  adultCount: { type: Number, required: true },
  childCount: { type: Number, required: true },
  facilities: [{ type: String, required: true }],
  pricePerNight: { type: Number, required: true },
  starRating: { type: Number, required: true, min: 1, max: 5 },
  imageUrls: [{ type: String, required: true }],
  lastUpdated: { type: Date, required: true },
  bookings: [bookingSchema],
  rooms:[roomSchema],
});
const Hotel = mongoose.model<HotelType>("Hotel", hotelSchema);
export default Hotel;