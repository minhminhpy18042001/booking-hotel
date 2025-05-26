import { useForm } from "react-hook-form"
import { BookingType } from "../../../../backend/src/shared/types"
import { useMutation, useQuery } from "react-query"
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

type Props={
    booking:BookingType;
    hotelId:string;
    ownerId: string;
}
export type CancelBookingFormData={
    bookingId:string;
}
const CancelBookingForm =({booking,hotelId,ownerId}: Props)=>{
    const { showToast } = useAppContext();
    const navigate =useNavigate();
    const [showOwner, setShowOwner] = useState(false);
    // Fetch owner info
    const { data: owner } = useQuery(
        ["fetchUserById", ownerId],
        () => apiClient.fetchUserById(ownerId),
        { enabled: !!ownerId }
    );
    const { mutate: cancelBookingRoom,} = useMutation(
        apiClient.cancelRoomBooking,
        {
          onSuccess: () => {
            showToast({ message: "Cancel Booking Successed!", type: "SUCCESS" });
            window.location.reload(); 
          },
          onError: (error: Error) => {
            showToast({ message: error.message, type: "ERROR" });
          },
        }
      );
    const {handleSubmit}=useForm<CancelBookingFormData>({defaultValues:{
        bookingId:booking._id
    }});
    const onSubmit = async (formData: CancelBookingFormData) => {
        cancelBookingRoom({ ...formData});
    };
    const onReview = async () => {
        !booking.rating?
        navigate(`/my-bookings/review/${booking._id}/`)
        : navigate(`/my-bookings/review/${booking._id}/edit/`)
    };
    return (
        <form  onSubmit={
            booking.statusBooking === "completed"? handleSubmit(onReview) : handleSubmit(onSubmit)
        }>
            <div className="mb-2">
                <span className="font-bold mr-2">Dates:</span>
                <span>
                    {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                </span>
            </div>
            <div className="flex flex-col gap-2 w-full max-w-[350px] mb-2">
                <div className="flex justify-between items-center">
                    <span className="font-bold">Total Cost:</span>
                    <span className="text-lg font-semibold text-blue-700">{booking.totalCost}$</span>
                </div>
                <div className="text-xs text-gray-500">Booking ID: <span className="font-mono">{booking._id}</span></div>
            </div>
            {/* Owner info toggle */}
            {owner && (
                <div className="mt-2">
                    <button
                        type="button"
                        className="text-blue-600 underline text-sm mb-1 focus:outline-none"
                        onClick={() => setShowOwner((prev) => !prev)}
                    >
                        {showOwner ? "Hide" : "Show"} Contact
                    </button>
                    {showOwner && (
                        <div className="text-sm text-gray-700 bg-blue-50 border border-blue-200 rounded p-3 shadow-sm mt-1">
                            <div className="font-bold text-blue-800 mb-1">Hotels Contact</div>
                            <div className="flex flex-col gap-1 pl-2">
                                <div><span className="font-semibold">Name:</span> {owner.firstName} {owner.lastName}</div>
                                <div><span className="font-semibold">Phone:</span> {owner.phone || "N/A"}</div>
                                <div><span className="font-semibold">Email:</span> {owner.email}</div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            <div className="mt-4 flex flex-col gap-2 w-full max-w-[350px]">
                {booking.statusBooking === "completed" ?
                    (!booking.rating ?
                    (<button className="w-full bg-green-600 text-white py-2 rounded font-bold text-lg hover:bg-green-500 transition">Review</button>):
                    (<button className="w-full bg-yellow-500 text-white py-2 rounded font-bold text-lg hover:bg-yellow-400 transition">Edit Review</button>)
                    ) : (booking.statusBooking === "booked" ?
                    <button className="w-full bg-red-600 text-white py-2 rounded font-bold text-lg hover:bg-red-500 transition">Cancel</button>:null)}
                {(booking.statusBooking === "completed" || booking.statusBooking === "cancelled") && (
                    <a
                        href={`/detail/${hotelId}`}
                        className="w-full bg-blue-600 text-white py-2 rounded font-bold text-lg text-center hover:bg-blue-500 transition"
                    >
                        Book Again
                    </a>
                )}
            </div>
        </form>
    )
}
export default CancelBookingForm;