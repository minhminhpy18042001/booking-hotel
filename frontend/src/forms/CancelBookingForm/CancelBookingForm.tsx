import { useForm } from "react-hook-form"
import { BookingType } from "../../../../backend/src/shared/types"
import { useMutation } from "react-query"
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";

type Props={
    booking:BookingType
}
export type CancelBookingFormData={
    bookingId:string;
}
const CancelBookingForm =({booking}: Props)=>{
    const { showToast } = useAppContext();
    const navigate =useNavigate();
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
            <div>
                <span className="font-bold mr-2">Dates: </span>
                <span>
                    {new Date(booking.checkIn).toDateString()} -
                    {new Date(booking.checkOut).toDateString()}
                </span>
            </div>
            <div>
            <div className="flex justify-between w-[300px]">
                
                    <span className="font-bold mr-2">Total Cost:</span>
                    <span>
                    {booking.totalCost}$
                    </span>
                    <span className="font-bold mr-2">Status:</span>
                    <span>
                    {booking.statusBooking}
                    </span>
                </div>
            </div>
            <div>
                {booking.statusBooking === "completed" ?
                    (!booking.rating ?
                    (<button className="w-[300px] bg-green-600 text-white h-full p-2 font-bold text-xl hover:bg-green-500">
                        Review
                    </button>):
                    (<button className="w-[300px] bg-yellow-600 text-white h-full p-2 font-bold text-xl hover:bg-yeloow-500">
                        Edit Review
                    </button>)
                    ) : <button className="w-[300px] bg-red-600 text-white h-full p-2 font-bold text-xl hover:bg-red-500">
                        Cancel
                    </button>}
                {/* <button  className="w-[300px] bg-red-600 text-white h-full p-2 font-bold text-xl hover:bg-red-500">
                    Cancel
                </button> */}
            </div>
        </form>
    )
}
export default CancelBookingForm;