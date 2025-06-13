import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import BookingForm from "../forms/BookingForm/BookingForm";
import { useSearchContext } from "../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BookingDetailSummary from "../components/BookingDetailSummary";
import { Room } from "../../../backend/src/shared/types";

const Booking =()=>{
    const search =useSearchContext();
    const {hotelId,roomId}=useParams();
    const[numberOfNights,setNumberOfNights]=useState<number>(0);
    useEffect(()=>{
        if(search.checkIn&& search.checkOut){
            const nights =Math.abs(search.checkOut.getTime()-search.checkIn.getTime())/(1000*60*60*24);
            setNumberOfNights(Math.ceil(nights));
        }
    },[search.checkIn,search.checkOut]);

    const checkInDateObj = new Date(search.checkIn);
    const checkOutDateObj = new Date(search.checkOut);
    const calculateTotalPrice = (room:Room) => {
        
        const totalDays = Math.round((checkOutDateObj.getTime() - checkInDateObj.getTime()) / (1000 * 3600 * 24));
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
            totalPrice += Math.round(room.pricePerNight*(1 + specialDay.price / 100));
          } else  {
            totalPrice += room.pricePerNight;
          }
        }
      
        return totalPrice;
      };
    const {data: hotel}=useQuery("fetchHotelById",()=>apiClient.fetchHotelById(hotelId as string),{enabled:!!hotelId});
 
    const{data:room}=useQuery("fetchRoomHotelById",()=>apiClient.fetchRoomHotelById(hotelId as string,roomId as string),{enabled:!!hotelId &&!!roomId});

    const { data: currentUser } =useQuery("fetchCurrentUser",apiClient.fetchCurrentUser);
    return (
        <div className="grid md:grid-cols-[1fr_2fr]">
            {hotel && room &&<BookingDetailSummary
            checkIn={search.checkIn}
            checkOut={search.checkOut}
            adultCount={search.adultCount}
            childCount={search.childCount}
            numberOfNights={numberOfNights}
            hotel={hotel}
            room ={room}
            />}
            {currentUser && room && <BookingForm currentUser ={currentUser} totalCost ={calculateTotalPrice(room)} policy={room.policy} />}
            
        </div>
    );
};
export default Booking;