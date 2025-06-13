import { HotelType, Room } from "../../../backend/src/shared/types";

type Props = {
    checkIn: Date;
    checkOut: Date;
    adultCount: number;
    childCount: number;
    numberOfNights: number;
    hotel: HotelType;
    room:Room
};
const BookingDetailSummary =({checkIn,checkOut,adultCount,childCount,numberOfNights,hotel,room}: Props)=>{
    return(
        <div className="grid gap-4 rounded-lg border border-slate-300 p-5 h-fit">
            <h2 className="text-xl font-bold">Your Booking Details</h2>
            <div className="border-b py-2">
                Location:
                <div className="font-bold">{`${hotel.name}, ${hotel.city}, ${hotel.country}`}</div>
            </div>
            <div className="flex justify-between">
                <div>
                    Check-in
                    <div className="font-bold"> {checkIn.toDateString()}</div>
                </div>
                <div>
                    Check-out
                    <div className="font-bold"> {checkOut.toDateString()}</div>
                </div>
            </div>
            <div className="border-t border-b py-2 flex justify-between">
                <div>
                    Total length of stay:
                    <div className="font-bold">{numberOfNights} nights</div>
                </div>
                <div>
                    {room.name}
                    <div className="font-bold">{room.typeBed}</div>
                </div>
            </div>
            <div>
                Guests{" "}
                <div className="font-bold">
                    {adultCount} adults & {childCount} children
                </div>
            </div>
            <div className="border-t py-2 text-red-600 font-semibold">
                Free cancellation up to 3 days before check-in
            </div>
        </div>
    )
};
export default BookingDetailSummary;