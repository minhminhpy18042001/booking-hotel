import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import CancelBookingForm from "../forms/CancelBookingForm/CancelBookingForm";
import { useState } from "react";
//import { BookingType } from "../../../backend/src/shared/types";

// const MyBookings =()=>{
//     const {data:hotels}=useQuery("fetchMyBookings",apiClient.fetchMyBookings);
//     const [selectedStatus, setSelectedStatus] = useState("booked");
//     if (!hotels || hotels.length === 0) {
//         return <span>No bookings found</span>;
//       }
//     const filteredHotels = hotels.map((hotel) => {
//       const filteredBookings = hotel.bookings.filter((booking) => {
//         // if (selectedStatus === "all") return true;
//         return booking.statusBooking === selectedStatus;
//       });
//       return { ...hotel, bookings: filteredBookings };
//     }).filter(hotel => hotel.bookings.length > 0);
//     // Sort the bookings by check-in date

//   return (
//     <div className="space-y-5">
//       <h1 className="text-3xl font-bold">My Bookings</h1>
//       <div className="flex gap-4 mb-4">
//         {/* <button
//           className={`${selectedStatus === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
//             } py-2 px-4 rounded-lg`}
//           onClick={() => setSelectedStatus("all")}
//         >
//           All
//         </button> */}
//         <button
//           className={`${selectedStatus === "booked" ? "bg-blue-500 text-white" : "bg-gray-200"
//             } py-2 px-4 rounded-lg`}
//           onClick={() => setSelectedStatus("booked")}
//         >
//           Booked
//         </button>
//         <button
//           className={`${selectedStatus === "completed" ? "bg-blue-500 text-white" : "bg-gray-200"
//             } py-2 px-4 rounded-lg`}
//           onClick={() => setSelectedStatus("completed")}
//         >
//           Completed
//         </button>
//         <button
//           className={`${selectedStatus === "cancelled" ? "bg-blue-500 text-white" : "bg-gray-200"
//             } py-2 px-4 rounded-lg`}
//           onClick={() => setSelectedStatus("cancelled")}
//         >
//           Cancelled
//         </button>
//       </div>
//       {filteredHotels.map((hotel) => (
//         <div>
//           {hotel.bookings.map((booking) => (
//             <div>
//               <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] border border-slate-300 rounded-lg p-8 gap-5">
//                 <div className="lg:w-full lg:h-[250px]">
//                   <img
//                     src={hotel.imageUrls[0]}
//                     className="w-full h-full object-cover object-center"
//                   />
//                 </div>
//                 <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px]">
//                   <div className="text-2xl font-bold">
//                     {hotel.name}
//                     <div className="text-xs font-normal">
//                       {hotel.city}, {hotel.country}
//                     </div>
//                   </div>
//                   <CancelBookingForm booking={booking} />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   );
// };
const MyBookings = () => {
  const { data: hotels } = useQuery("fetchMyBookings", apiClient.fetchMyBookings);
  const [selectedStatus, setSelectedStatus] = useState("all");

  if (!hotels || hotels.length === 0) {
    return <span>No bookings found</span>;
  }

  // Flatten the bookings into a single array and include hotel information
  const filteredBookings = hotels.reduce((acc: any[], hotel) => {
    const filteredHotelBookings = hotel.bookings.filter((booking) => {
      if (selectedStatus === "all") return true;
      return booking.statusBooking === selectedStatus;
    });
    return [...acc, ...filteredHotelBookings.map(booking => ({ ...booking, hotel }))];
  }, []);

  // Sort the bookings by check-in date
  filteredBookings.sort((a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime());

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">My Bookings</h1>
      <div className="flex gap-4 mb-4">
        <button
          className={`${
            selectedStatus === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
          } py-2 px-4 rounded-lg`}
          onClick={() => setSelectedStatus("all")}
        >
          All
        </button>
        <button
          className={`${
            selectedStatus === "booked" ? "bg-blue-500 text-white" : "bg-gray-200"
          } py-2 px-4 rounded-lg`}
          onClick={() => setSelectedStatus("booked")}
        >
          Booked
        </button>
        <button
          className={`${
            selectedStatus === "completed" ? "bg-blue-500 text-white" : "bg-gray-200"
          } py-2 px-4 rounded-lg`}
          onClick={() => setSelectedStatus("completed")}
        >
          Completed
        </button>
        <button
          className={`${
            selectedStatus === "cancelled" ? "bg-blue-500 text-white" : "bg-gray-200"
          } py-2 px-4 rounded-lg`}
          onClick={() => setSelectedStatus("cancelled")}
        >
          Cancelled
        </button>
      </div>
      {filteredBookings.map((booking) => (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] border border-slate-300 rounded-lg p-8 gap-5" key={booking._id}>
          <div className="lg:w-full lg:h-[250px]">
            <img
              src={booking.hotel.imageUrls[0]}
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px]">
            <div className="text-2xl font-bold">
              {booking.hotel.name}
              <div className="text-xs font-normal">
                {booking.hotel.city}, {booking.hotel.country}
              </div>
            </div>
            <CancelBookingForm booking={booking} />
          </div>
        </div>
      ))}
    </div>
  );
};
export default MyBookings;