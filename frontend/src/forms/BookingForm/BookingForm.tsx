import { useForm } from "react-hook-form";
import { UserType } from "../../../../backend/src/shared/types"
import { useParams } from "react-router-dom";
import { useSearchContext } from "../../contexts/SearchContext";
import { useMutation } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";
type Props={
    currentUser:UserType;
    totalCost:number;
}
export type BookingFormData={
    firstName:string;
    lastName:string;
    email:string;
    adultCount: number;
    childCount: number;
    checkIn: string;
    checkOut: string;
    hotelId: string;
    roomId:string;
    totalCost: number;
}

const BookingForm =({ currentUser,totalCost}: Props)=>{
    const search = useSearchContext();
    const { hotelId,roomId } = useParams();
    const { showToast } = useAppContext();
    const navigate =useNavigate();
    const { mutate: bookRoom, isLoading } = useMutation(
        apiClient.createRoomBooking,
        {
          onSuccess: () => {
            showToast({ message: "Booking Saved!", type: "SUCCESS" });
            navigate(`/my-bookings`);
          },
          onError: () => {
            showToast({ message: "Change CheckOut date", type: "ERROR" });
          },
        }
      );
    const {handleSubmit,register}=useForm<BookingFormData>({defaultValues:{
        firstName:currentUser.firstName,
        lastName:currentUser.lastName,
        email:currentUser.email,
        adultCount: search.adultCount,
        childCount: search.childCount,
        checkIn: search.checkIn.toISOString(),
        checkOut: search.checkOut.toISOString(),
        hotelId: hotelId,
        roomId:roomId,
        totalCost: totalCost,
    }});
    const onSubmit = async (formData: BookingFormData) => {
        
        bookRoom({ ...formData,totalCost:totalCost});
    };
    return(
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5">
            <span className="text-3xl font-bold">Confirm Your Details</span>
            <div className="grid grid-cols-2 gap-6">
                <label className="text-gray-700 text-sm font-bold flex-1">
                    First Name
                    <input
                        className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
                        type="text"
                        {...register("firstName")}
                    />
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                    Last Name
                    <input
                        className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
                        type="text"
                        {...register("lastName")}
                    />
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                    Email
                    <input
                        className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
                        type="text"
                        readOnly
                        disabled
                        {...register("email")}
                    />
                </label>
            </div>
            <div className="space-y-2">
                <h2 className="text-xl font-semibold">Your Price Summary</h2>

                <div className="bg-blue-200 p-4 rounded-md">
                    <div className="font-semibold text-lg">
                        Total Cost: {totalCost.toFixed(2)}$
                    </div>
                    <div className="text-xs">Includes taxes and charges</div>
                </div>
            </div>
            <div className="flex justify-end">
                <button
                    disabled={isLoading}
                    type="submit"
                    className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-md disabled:bg-gray-500"
                >
                    {isLoading ? "Saving..." : "Confirm Booking"}
                </button>
            </div>
        </form>
    );
};
export default BookingForm;