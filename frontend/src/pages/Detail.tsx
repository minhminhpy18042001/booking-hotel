import { useQuery } from "react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom"
import * as apiClient from "../api-client";
import { AiFillStar } from "react-icons/ai";
import { FaBed } from "react-icons/fa6";
import { useAppContext } from "../contexts/AppContext";
import { useState } from "react";
import RoomDetail from "../forms/DetailsForm/RoomDetail";
import avatar from '../images/avatar.png';
import { useSearchContext } from "../contexts/SearchContext";
import { Room } from "../../../backend/src/shared/types";
const Detail = () => {
    const search =useSearchContext();
    const { hotelId } = useParams();
    const [selectedRoom, setSelectedRoom] = useState("");
    const [openModal,setOpenModal]=useState(false);
    const { data: hotel } = useQuery("fetchHotelById", () => apiClient.fetchHotelById(hotelId as string), { enabled: !!hotelId, });
    const {isLoggedIn}=useAppContext();
    const navigate =useNavigate();
    const location =useLocation();
    const handleRoomClick = (roomId:string) => {
        setSelectedRoom(roomId);
    };
    if (!hotel) {
        return <></>;
    }

    const checkInDateObj = new Date(search.checkIn);
    const checkOutDateObj = new Date(search.checkOut);
    const totalDays = Math.round((checkOutDateObj.getTime() - checkInDateObj.getTime()) / (1000 * 3600 * 24));
    const calculateTotalPrice = (room:Room) => {
        
       
        let totalPrice = 0;
        for (let i = 0; i < totalDays; i++) {
          const currentDate = new Date(checkInDateObj.getTime() + i * 1000 * 3600 * 24);
          const currentDateString = currentDate.toISOString().split("T")[0];
          let specialDay = null;
          if (room.specialPrices) {
            const specials = room.specialPrices.filter(
              (day) => day && day.date && new Date(day.date).toISOString().split("T")[0] === currentDateString
            );
            specialDay = specials.length > 0 ? specials[specials.length - 1] : null;
          }
          if (specialDay) {
            totalPrice += Math.round(room.pricePerNight*(1 + specialDay.price / 100)); // Apply the special price percentage
          } else  {
            totalPrice += room.pricePerNight;
          }
        }
      
        return totalPrice;
      };
    const calculateAverageRating = () => {
        const totalScore = hotel.bookings.reduce((acc, booking) => {
            return booking.rating ? acc + booking.rating.score : acc;
        }, 0);
        const numberOfReviews = hotel.bookings.filter(booking => booking.rating).length;
        return numberOfReviews > 0 ? (totalScore / numberOfReviews).toFixed(1) : 0; // Return average, or 0 if no reviews
    };

    const averageRating = calculateAverageRating();

    // Calculate available amount for a room in the selected date range
    const getAvailableAmount = (room: Room) => {
        const overlappingBookings = hotel.bookings.filter(
            (booking) => {
                if (booking.roomId !== room._id) return false;
                if (booking.statusBooking !== "booked" && booking.statusBooking !== "paymenting") return false;
                // booking dates
                const bookingCheckIn = new Date(booking.checkIn);
                const bookingCheckOut = new Date(booking.checkOut);
                // Subtract 1 day from bookingCheckOut for correct blocking
                const bookingCheckOutMinus1 = new Date(bookingCheckOut);
                bookingCheckOutMinus1.setDate(bookingCheckOutMinus1.getDate() - 1);
                // Only block nights from checkIn (inclusive) to checkOut-1 (inclusive)
                return (
                    bookingCheckIn < checkOutDateObj &&
                    bookingCheckOutMinus1 >= checkInDateObj
                );
            }
        );
        return Math.max(0, room.amount - overlappingBookings.length);
    };

    const facilityIcons: Record<string, string> = {
        "bathroom": "🛁",
        "Balcony": "🌅",
        "Sea view": "🌊",
        "Air conditioning": "❄️",
        "Kitchen": "🍳",
        "Outdoor Pool": "🏊",
        "TV": "📺",
        "WiFi": "📶"
    };

    return (
        <div className="space-y-6">
            <div>
                <span className="flex">
                    {Array.from({ length: hotel.starRating }).map(() => (
                        <AiFillStar className="fill-yellow-400" />
                    ))}
                </span>
                <div>
                    <h1 className="text-3xl font-bold">{hotel.name}</h1>
                    <h3 className="">{hotel.country}, {hotel.city}</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {hotel.imageUrls.map((image) => (
                    <div className="h-[300px]">
                        <img
                            src={image}
                            alt={hotel.name}
                            className="rounded-md w-full h-full object-cover object-center"
                        />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
                {hotel.facilities.map((facility) => (
                    <div className="border border-slate-300 rounded-sm p-3 flex items-center gap-2">
                        <span>{facilityIcons[facility] || "•"}</span>
                        <span>{facility}</span>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr]">
                <div className="whitespace-pre-line">{hotel.description}</div>
                {/* <div className="h-fit">
                    <GuestInfoForm
                        pricePerNight={hotel.pricePerNight}
                        hotelId={hotel._id}
                    />
                </div> */}
            </div >
            <div className="p-4">
                <h2 className="text-2xl font-bold mb-4">Availability</h2>
                <div className="flex flex-col gap-4">
                    {hotel.rooms.map((room) => (
                        <div className="border border-slate-300 rounded-lg shadow-md p-4 bg-white flex flex-col">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                {/* 1. Room image and information */}
                                <div className="flex items-center gap-4">
                                    {room.imageUrls ? (
                                        <img src={room.imageUrls[0]} alt={room.name} className="w-24 h-24 object-cover rounded-md border" />
                                    ) : (
                                        <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded-md border text-gray-400">No Image</div>
                                    )}
                                    <div>
                                        <button className="text-lg font-bold text-blue-400 underline hover:text-red-900 mb-1"
                                            onClick={() => { handleRoomClick(room._id); setOpenModal(true) }}>
                                            {room.name}
                                        </button>
                                        <div className="text-sm text-gray-700">{room.typeBed} <FaBed className="inline mr-1" /></div>
                                    </div>
                                </div>
                                {/* 2. Room policies */}
                                <div className="text-sm text-gray-600">
                                    {(() => {
                                        const policies = [];
                                        if (room.policy === 1) {
                                            policies.push("Pay 10% now");
                                        } else {
                                            policies.push("Pay at hotel");
                                        }
                                        policies.push("Parking");
                                        policies.push("Free WiFi");
                                        const icons = [
                                            "💳", // payment
                                            "🅿️", // parking
                                            "📶"  // wifi
                                        ];
                                        return policies.map((policy, idx) => (
                                            <span key={idx} className={`block flex items-center gap-1${idx === 0 ? ' text-green-900 font-semibold' : ''}`}>
                                                <span>{icons[idx] || "•"}</span>{policy}
                                            </span>
                                        ));
                                    })()}
                                </div>
                                {/* 3. Available room amount */}
                                <div className="text-green-700 font-semibold text-center">
                                    Available: {getAvailableAmount(room)}
                                </div>
                                {/* 4. Price section */}
                                <div className="flex flex-col items-end">
                                    <div className="flex gap-2 items-center">
                                        {calculateTotalPrice(room) < room.pricePerNight * totalDays && (
                                            <span className="text-gray-500 line-through">{room.pricePerNight * totalDays}$</span>
                                        )}
                                        {Math.round((calculateTotalPrice(room) - room.pricePerNight * totalDays) / (room.pricePerNight * totalDays) * 100) < 0 && (
                                            <span className="text-red-500 font-semibold">
                                                {Math.round((calculateTotalPrice(room) - room.pricePerNight * totalDays) / (room.pricePerNight * totalDays) * 100)}%
                                            </span>
                                        )}
                                        <span className="text-red-700 font-bold text-lg">{calculateTotalPrice(room)}$</span>
                                    </div>
                                    <div className="mt-2">
                                        {getAvailableAmount(room) === 0 ? (
                                            <button className="bg-gray-400 text-white px-3 py-1 rounded cursor-not-allowed" disabled>
                                                Not Available
                                            </button>
                                        ) : isLoggedIn ? (
                                            <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500"
                                                onClick={() => navigate(`/hotel/${hotelId}/booking/${room._id}`)}>
                                                Reserve
                                            </button>
                                        ) : (
                                            <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500"
                                                onClick={() => navigate("/sign-in", { state: { from: location } })}>
                                                Login to Reserve
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {openModal && (
                <RoomDetail roomId={selectedRoom} hotelId={hotel._id} onClose={setOpenModal} />
            )}
            </div>
            <div>
                <h2 className="text-2xl font-bold">Reviews</h2>
                <div className="text-lg font-semibold mb-4">Average Rating:
                    {/* <span className="text-yellow-500 ml-2">{'★'.repeat(Math.round(averageRating))}</span> */}
                    <span className="text-gray-500 ml-1">{averageRating}/10</span>
                </div>
                {hotel.bookings.map((booking)=>(
                    (booking.rating!==undefined)&&
                    <div className="border border-slate-300 rounded-lg shadow-lg p-4 bg-white flex items-start">
                        {/* Avatar */}
                        <img
                            src={avatar} 
                            alt="User  Avatar"  
                            className="w-16 h-16 rounded-full border-2 border-gray-300 shadow-md mr-4"
                        />
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-2">
                                <div className="text-xl font-bold text-gray-800">{booking.firstName} {booking.lastName}</div>
                                <div className="flex items-center">
                                    <span className="text-yellow-500">{'★'.repeat(booking.rating.score)}</span>
                                    <span className="text-gray-500 ml-1 font-bold">{booking.rating.review}</span>
                                </div>
                            </div>
                            <div className="text-gray-600 text-sm">{booking.rating.comment}</div>
                            <div className="text-gray-500 text-xs mt-1">{new Date(booking.rating.date).toLocaleDateString()}</div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default Detail;