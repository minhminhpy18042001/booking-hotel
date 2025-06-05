import React, { useContext, useState } from "react";

type SearchContext = {
    destination: string;
    checkIn: Date;
    checkOut: Date;
    adultCount: number;
    childCount: number;
    hotelId: string;
    saveSearchValues: (
      destination: string,
      checkIn: Date,
      checkOut: Date,
      adultCount: number,
      childCount: number
    ) => void;
  };

const SearchContext =React.createContext<SearchContext|undefined>(undefined);

type SearchContextProviderProps = {
    children: React.ReactNode;
  };
  
export const SearchContextProvider =({children}:SearchContextProviderProps) =>{
    const [destination,setDestination]=useState<string>(()=>localStorage.getItem("destination") ||"")
    // Helper: check if a date is in the past (before today)
    const isPastDate = (date: Date) => {
        const today = new Date();
        today.setHours(0,0,0,0);
        return date < today;
    };

    const [checkIn, setCheckIn] = useState<Date>(() => {
        const stored = localStorage.getItem("checkIn");
        const date = stored ? new Date(stored) : new Date();
        // If date is in the past, reset to today
        return isPastDate(date) ? new Date() : date;
    });
    const [checkOut, setCheckOut] = useState<Date>(() => {
        const checkInStr = localStorage.getItem("checkIn");
        const checkOutStr = localStorage.getItem("checkOut");
        let checkInDate = checkInStr ? new Date(checkInStr) : new Date();
        let checkOutDate = checkOutStr ? new Date(checkOutStr) : null;
        // If check-in is in the past, reset to today
        if (isPastDate(checkInDate)) checkInDate = new Date();
        // If check-out is missing or before check-in, set to next day
        if (!checkOutDate || checkOutDate <= checkInDate) {
            const nextDay = new Date(checkInDate);
            nextDay.setDate(checkInDate.getDate() + 1);
            return nextDay;
        }
        return checkOutDate;
    });
    const [adultCount, setAdultCount] = useState<number>(()=>parseInt(localStorage.getItem("adultCount")||"1"));
    const [childCount, setChildCount] = useState<number>(()=>parseInt(localStorage.getItem("childCount")||"0"));
    const [hotelId,setHotelId] =useState<string>(()=>localStorage.getItem("hotelId")||"");
    const saveSearchValues =(
        destination: string,
        checkIn: Date,
        checkOut: Date,
        adultCount: number,
        childCount: number,
        hotelId?:string
    ) =>{
        setDestination(destination);
        setCheckIn(checkIn);
        setCheckOut(checkOut);
        setAdultCount(adultCount);
        setChildCount(childCount);
        if(hotelId){
            setHotelId(hotelId);
        }
        localStorage.setItem("destination", destination);
        localStorage.setItem("checkIn", checkIn.toISOString());
        localStorage.setItem("checkOut", checkOut.toISOString());
        localStorage.setItem("adultCount", adultCount.toString());
        localStorage.setItem("childCount", childCount.toString());

        if (hotelId) {
            localStorage.setItem("hotelId", hotelId);
        }
    }
    return(
        <SearchContext.Provider value={{
            destination,
            checkIn,
            checkOut,
            adultCount,
            childCount,
            hotelId,
            saveSearchValues,
        }}>
            {children}
        </SearchContext.Provider>
    )
};
export const useSearchContext=() =>{
    const context =useContext(SearchContext);
    return context as SearchContext;
}
