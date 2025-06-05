import mongoose from "mongoose";
import Hotel from "../models/hotel";
import "dotenv/config";

async function addAmountToRooms() {
  await mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);

  const hotels = await Hotel.find({});
  for (const hotel of hotels) {
    console.log("Hotel:", hotel._id);
    let updated = false;
    for (const room of hotel.rooms) {
        console.log("Room:", room._id, "amount:", room.amount);
      if (room.amount === undefined) {
        room.amount = 1; // Set your default value here
        updated = true;
      }
    }
    if (updated) {
      await hotel.save();
      console.log(`Updated hotel: ${hotel._id}`);
    }
  }

  await mongoose.disconnect();
  console.log("Done updating rooms.");
}

addAmountToRooms().catch(console.error);