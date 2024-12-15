import { useQuery } from "react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom"
import * as apiClient from "../api-client";
import { AiFillStar } from "react-icons/ai";
import { FaBed } from "react-icons/fa6";
import { useAppContext } from "../contexts/AppContext";
import { useState } from "react";
import RoomDetail from "../forms/DetailsForm/RoomDetail";
import avatar from '../images/avatar.png';
const Detail = () => {
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
    const calculateAverageRating = () => {
        const totalScore = hotel.bookings.reduce((acc, booking) => {
            return booking.rating ? acc + booking.rating.score : acc;
        }, 0);
        const numberOfReviews = hotel.bookings.filter(booking => booking.rating).length;
        return numberOfReviews > 0 ? (totalScore / numberOfReviews).toFixed(1) : 0; // Return average, or 0 if no reviews
    };

    const averageRating = calculateAverageRating();
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
                    <div className="border border-slate-300 rounded-sm p-3">
                        {facility}
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
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {hotel.rooms.map((room) => (
                        <div className="border border-slate-300 rounded-lg shadow-md p-4 bg-white flex flex-col">
                            <div className="flex justify-between items-center mb-2">
                                <button className="text-xl font-bold text-blue-400 underline hover:text-red-900"
                                    onClick={() => { handleRoomClick(room._id); setOpenModal(true) }}>
                                    {room.name}
                                </button>
                                {isLoggedIn ? (
                                    <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500"
                                        onClick={() => navigate(`/hotel/${hotelId}/booking/${room._id}`)}>
                                        Reserve
                                    </button>
                                ) : (
                                    <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500"
                                        onClick={() => navigate("/sign-in", { state: { from: location } })}>
                                        Login to Book
                                    </button>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="text-lg font-normal text-gray-700">
                                    {/* <FiMaximize2 className="inline mr-1" />
                                    {room.roomSize} m<sup>2</sup>
                                    <BiMoney className="inline mr-1" />
                                    {room.pricePerNight} $  */}
                                    {room.typeBed} {<FaBed className="inline mr-1" />}
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