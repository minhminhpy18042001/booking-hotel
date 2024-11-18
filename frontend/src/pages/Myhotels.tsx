import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../api-client";
import { BsBuilding, BsMap } from "react-icons/bs";
import { BiHotel, BiMoney, BiStar } from "react-icons/bi";
import { FiMaximize2 } from "react-icons/fi";
import { FaBed } from "react-icons/fa6";
const MyHotels = () => {
  const { data: hotelData } = useQuery(
    "fetchMyHotels",
    apiClient.fetchMyHotels,
    {
      onError: () => { },
    }
  );

  if (!hotelData) {
    return <span>No Hotels found</span>;
  }

  return (
    <div className="space-y-5">
      <span className="flex justify-between">
        <h1 className="text-3xl font-bold">My Hotels</h1>
        <Link
          to="/add-hotel"
          className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500 hover:text-red-900"
        >
          Add Hotel
        </Link>
      </span>
      <div className="grid grid-cols-1 gap-8">
        {hotelData.map((hotel) => (
          <div
            data-testid="hotel-card"
            className="flex flex-col justify-between border border-slate-300 rounded-lg p-8 gap-5"
          >

            <span className="flex justify-between">
              <h2 className="text-2xl font-bold">{hotel.name}</h2>
              <Link
                to={`/edit-hotel/${hotel._id}`}
                className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500 hover:text-red-900"
              >
                View Details Hotel
              </Link>
            </span>
            <div className="whitespace-pre-line">{hotel.description}</div>
            <div className="grid grid-cols-5 gap-2">
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BsMap className="mr-1" />
                {hotel.city}, {hotel.country}
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BsBuilding className="mr-1" />
                {hotel.type}
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiMoney className="mr-1" />{hotel.pricePerNight}$ per night
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiHotel className="mr-1" />
                {hotel.adultCount} adults, {hotel.childCount} children
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiStar className="mr-1" />
                {hotel.starRating} Star Rating
              </div>
            </div>
            <div className="text-2xl font-bold">
              <span className="flex justify-between p-1">
                Rooms
                <Link to={`/edit-hotel/${hotel._id}/addRoom`} className="flex bg-blue-600 text-xl leading-4 font-bold text-white p-2 hover:bg-blue-500 hover:text-red-900">Add Room</Link>
              </span>
              <div className="grid grid-rows-2">
                {hotel.rooms.map((room) => (
                  <div className="border border-slate-300">
                    <Link to={`/edit-hotel/${hotel._id}/${room._id}`} className="text-xl font-bold text-blue-400 underline hover:text-red-900">{room.name}</Link>
                    <div className="grid grid-cols">
                      <div className="rounded-sm p-3 flex items-center font-normal text-lg">
                        <FiMaximize2 className="mr-1 " />
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyHotels;