import { Link } from "react-router-dom";
import { HotelType } from "../../../backend/src/shared/types"
import { AiFillStar } from "react-icons/ai";
import { useSearchContext } from "../contexts/SearchContext";
import { Room } from "../../../backend/src/shared/types";
type Props={
    hotel:HotelType
}

const SearchResultsCard = ({ hotel }: Props) => {
  const search =useSearchContext();
  const checkInDateObj = new Date(search.checkIn);
      const checkOutDateObj = new Date(search.checkOut);
      const totalDays = Math.round((checkOutDateObj.getTime() - checkInDateObj.getTime()) / (1000 * 3600 * 24));
      const calculateTotalPrice = (room:Room) => {
          
         
          let totalPrice = 0;
          for (let i = 0; i < totalDays; i++) {
            const currentDate = new Date(checkInDateObj.getTime() + i * 1000 * 3600 * 24);
            const currentDateString = currentDate.toISOString().split("T")[0];
            const specialDay = room.specialPrices.find((day) => new Date(day.date).toISOString().split("T")[0] === currentDateString);
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
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center border border-slate-300 rounded-lg p-8">
        <div className="w-full h-[300px] flex items-center justify-center">
          <img
            src={hotel.imageUrls[0]}
            className="w-full h-full object-cover object-center rounded-lg"
          />
        </div>
        <div className="flex flex-row w-full gap-4 items-start">
          <div className="flex flex-col flex-1 justify-between gap-4">
            <div>
              <div className="flex items-center mb-2">
                <span className="flex">
                  {Array.from({ length: hotel.starRating }).map(() => (
                    <AiFillStar className="fill-yellow-400" />
                  ))}
                </span>
                <span className="ml-1 text-sm">{hotel.type}</span>
              </div>
              <Link
                to={`/detail/${hotel._id}`}
                className="text-2xl font-bold cursor-pointer"
              >
                {hotel.name}
              </Link>
              <div className="text-gray-600 text-sm font-medium mt-1">
                {hotel.city}, {hotel.country}
              </div>
              <div className="flex gap-1 items-center flex-wrap mt-2">
                {hotel.facilities.slice(0, 3).map((facility) => (
                  <span className="bg-slate-300 p-2 rounded-lg font-bold text-xs whitespace-nowrap">
                    {facility}
                  </span>
                ))}
                <span className="text-sm">
                  {hotel.facilities.length > 3 &&
                    `+${hotel.facilities.length - 3} more`}
                </span>
              </div>
              {/* <div className="line-clamp-4 text-gray-700 mt-2">{hotel.description}</div> */}
            </div>
          </div>
          <div className="flex flex-col items-end justify-start min-w-[100px] gap-2 mt-1">
            {/* Show average rating and review count if there are reviews */}
            {hotel.bookings.filter(booking => booking.rating).length > 0 && (
              <span className="text-yellow-600 text-sm font-semibold">
                Rating: {averageRating}/10 ({hotel.bookings.filter(booking => booking.rating).length} review{hotel.bookings.filter(booking => booking.rating).length > 1 ? 's' : ''})
              </span>
            )}
            {/* Only show the first room's total price if available */}
            {hotel.rooms && hotel.rooms.length > 0 && (
              <div className="flex flex-col items-end">
                <div>
                  <span className="text-base text-text-gray-500 mb-2">{calculateTotalPrice(hotel.rooms[0]) < hotel.rooms[0].pricePerNight * totalDays ?
                    <del>{hotel.rooms[0].pricePerNight * totalDays}$</del>
                    :
                    ''}</span>
                  <span className="text-red-500 font-semibold">
                    {Math.round((calculateTotalPrice(hotel.rooms[0]) - hotel.rooms[0].pricePerNight * totalDays) / (hotel.rooms[0].pricePerNight * totalDays) * 100) < 0 ?
                      `${Math.round((calculateTotalPrice(hotel.rooms[0]) - hotel.rooms[0].pricePerNight * totalDays) / (hotel.rooms[0].pricePerNight * totalDays) * 100)}%`
                      :
                      ''}
                  </span>
                </div>
                <span className="text-base font-semibold text-red-700">{calculateTotalPrice(hotel.rooms[0])}$</span>
              </div>

            )}
            <Link
              to={`/detail/${hotel._id}`}
              className="bg-blue-600 text-white p-2 font-bold text-xl max-w-fit rounded hover:bg-blue-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              View More
            </Link>
          </div>
        </div>
      </div>
    );
  };
  
  export default SearchResultsCard;