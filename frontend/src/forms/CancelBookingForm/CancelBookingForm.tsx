import { useForm } from "react-hook-form"
import { BookingType } from "../../../../backend/src/shared/types"
import { useMutation } from "react-query"
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";

type Props={
    booking:BookingType
}
export type CancelBookingFormData={
    bookingId:string;
}
const CancelBookingForm =({booking}: Props)=>{
    const { showToast } = useAppContext();
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
    return (
        <form  onSubmit={handleSubmit(onSubmit)}>
            <div>
                <span className="font-bold mr-2">Dates: </span>
                <span>
                    {new Date(booking.checkIn).toDateString()} -
                    {new Date(booking.checkOut).toDateString()}
                </span>
            </div>
            <div>
                <span className="font-bold mr-2">Guests:</span>
                <span>
                    {booking.adultCount} adults, {booking.childCount} children
                </span>
            </div>
            <div>
                <button type="submit" className="w-[300px] bg-red-600 text-white h-full p-2 font-bold text-xl hover:bg-red-500">
                    Cancel
                </button>
            </div>
        </form>
    )
}
export default CancelBookingForm;