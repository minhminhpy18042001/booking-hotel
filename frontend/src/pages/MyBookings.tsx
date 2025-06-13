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
  const [sortOption, setSortOption] = useState("checkInDesc");
  const [searchId, setSearchId] = useState("");

  if (!hotels || hotels.length === 0) {
    return <span>No bookings found</span>;
  }

  // Flatten the bookings into a single array and include hotel information
  let filteredBookings: any[] = hotels.reduce((acc: any[], hotel: any) => {
    const filteredHotelBookings = hotel.bookings.filter((booking: any) => {
      if (searchId && !booking._id.toLowerCase().includes(searchId.toLowerCase())) return false;
      if (selectedStatus === "all") return true;
      return booking.statusBooking === selectedStatus;
    });
    return [...acc, ...filteredHotelBookings.map((booking: any) => ({ ...booking, hotel }))];
  }, []);

  // Sort the bookings based on sortOption
  filteredBookings.sort((a, b) => {
    if (sortOption === "checkInAsc") {
      return new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime();
    } else if (sortOption === "checkInDesc") {
      return new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime();
    } else if (sortOption === "priceAsc") {
      return a.totalCost - b.totalCost;
    } else if (sortOption === "priceDesc") {
      return b.totalCost - a.totalCost;
    }
    return 0;
  });

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">My Bookings</h1>
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        {/* Status filter buttons */}
        <button
          className={`${selectedStatus === "all" ? "bg-blue-500 text-white" : "bg-gray-200"} py-2 px-4 rounded-lg`}
          onClick={() => setSelectedStatus("all")}
        >
          All
        </button>
        <button
          className={`${selectedStatus === "booked" ? "bg-blue-500 text-white" : "bg-gray-200"} py-2 px-4 rounded-lg`}
          onClick={() => setSelectedStatus("booked")}
        >
          Booked
        </button>
        <button
          className={`${selectedStatus === "completed" ? "bg-blue-500 text-white" : "bg-gray-200"} py-2 px-4 rounded-lg`}
          onClick={() => setSelectedStatus("completed")}
        >
          Completed
        </button>
        <button
          className={`${selectedStatus === "cancelled" ? "bg-blue-500 text-white" : "bg-gray-200"} py-2 px-4 rounded-lg`}
          onClick={() => setSelectedStatus("cancelled")}
        >
          Cancelled
        </button>
        {/* Search by Booking ID */}
        <input
          type="text"
          placeholder="Search Booking ID..."
          className="ml-4 py-2 px-4 rounded-lg border border-gray-300 w-56"
          value={searchId}
          onChange={e => setSearchId(e.target.value)}
        />
        {/* Sort dropdown with label and icon */}
        <div className="flex items-center ml-auto gap-2 bg-gray-100 px-3 py-2 rounded-lg border border-gray-300">
          <span className="text-gray-700 font-medium">Sort by:</span>
          <select
            className="py-1 px-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            value={sortOption}
            onChange={e => setSortOption(e.target.value)}
          >
            <option value="checkInDesc">Newest Check-in</option>
            <option value="checkInAsc">Oldest Check-in</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
          </select>
        </div>
      </div>
      {filteredBookings.map((booking) => (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] border border-slate-300 rounded-lg p-8 gap-5" key={booking._id}>
          <div className="lg:w-full lg:h-[250px]">
            <img
              src={booking.hotel.imageUrls[0]}
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[500px]">
            <div className="text-2xl font-bold">
              {booking.hotel.name}
              <div className="text-xs font-normal">
                {booking.hotel.city}, {booking.hotel.country}
              </div>
            </div>
            <CancelBookingForm booking={booking} hotelId={booking.hotel._id} ownerId ={booking.hotel.userId}/>
          </div>
        </div>
      ))}
    </div>
  );
};
export default MyBookings;