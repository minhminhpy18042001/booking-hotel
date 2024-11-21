import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom"
import * as apiClient from "../api-client";
import { AiFillStar } from "react-icons/ai";
import { FiMaximize2 } from "react-icons/fi";
import { FaBed } from "react-icons/fa6";
import { BiMoney } from "react-icons/bi";
import { useAppContext } from "../contexts/AppContext";
const Detail = () => {
    const { hotelId } = useParams();
    const { data: hotel } = useQuery("fetchHotelById", () => apiClient.fetchHotelById(hotelId as string), { enabled: !!hotelId, });
    const {isLoggedIn}=useAppContext();
    if (!hotel) {
        return <></>;
    }
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
            <h2 className="text-2xl font-bold">Availability</h2>
            <div className="grid grid-rows-2 lg:grid-rows-4">
                {hotel.rooms.map((room) => (
                    <div className="border border-slate-300">
                        <span className="flex justify-between p-1">
                        <div className="text-xl font-bold text-blue-400 underline hover:text-red-900">{room.name}</div>
                        {isLoggedIn ?<>
                        <Link to={`/hotel/${hotelId}/booking/${room._id}`} className="bg-blue-600 text-white h-full p-1 font-bold hover:bg-blue-500 text-xl">reserve</Link></>:
                        <Link to={`/sign-in`} className="text-xl font-bold text-blue-400 underline hover:text-red-900"> Login to booking</Link>}
                        </span>          
                        <div className="grid grid-cols">
                            <div className="rounded-sm p-3 flex items-center font-normal text-lg">
                                <FiMaximize2 className="mr-1" />
                                {room.roomSize}m<sup>2</sup>|
                                <BiMoney className="mr-1" />
                                {room.pricePerNight}$|
                                <FaBed className="mr-1" />
                                {room.typeBed}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default Detail;