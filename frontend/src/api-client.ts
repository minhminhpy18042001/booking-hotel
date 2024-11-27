import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import { HotelSearchResponse, HotelType, Room, UserType } from "../../backend/src/shared/types";
import { BookingFormData } from "./forms/BookingForm/BookingForm";
import {CancelBookingFormData} from "./forms/CancelBookingForm/CancelBookingForm"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const fetchCurrentUser = async (): Promise<UserType> => {
  const response = await fetch(`${API_BASE_URL}/api/users/me`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error fetching user");
  }
  return response.json();
};
export const register = async (formData: RegisterFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
      method: "POST",
      credentials:"include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
  
    const responseBody = await response.json();
  
    if (!response.ok) {
      throw new Error(responseBody.message);
    }
  };

  
export const signIn =async(formData:SignInFormData)=>{
  const response =await fetch(`${API_BASE_URL}/api/auth/login`,{
    method:"POST",
    credentials:"include",
    headers:{
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData), 
  });
  const body =await response.json();
  if(!response.ok){
    throw new Error(body.message);
  }
  return body;
}

export const validateToken =async ()=>{
  const response =await fetch(`${API_BASE_URL}/api/auth/validate-token`,{
    credentials:"include"
  });
  if(!response.ok){
    throw new Error("Token invalid");
  }
  return response.json();
}  

export const signOut =async()=>{
  const response =await fetch(`${API_BASE_URL}/api/auth/logout`,{
    method:"POST",
    credentials:"include"
  });
  if(!response.ok){
    throw new Error("Error during sign out");
  }
};

export const addMyHotel = async (hotelFormData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    method: "POST",
    credentials: "include",
    body: hotelFormData,
  });

  if (!response.ok) {
    throw new Error("Failed to add hotel");
  }

  return response.json();
};

export const fetchMyHotels = async (): Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching hotels");
  }

  return response.json();
};

export const fetchMyHotelById = async (hotelId: string): Promise<HotelType> => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching Hotels");
  }

  return response.json();
};

export const updateMyHotelById =async (hotelFormData: FormData) =>{
  const response =await fetch(
    `${API_BASE_URL}/api/my-hotels/${hotelFormData.get("hotelId")}`,{
      method:"PUT",
      body:hotelFormData,
      credentials:"include",
    });
    if (!response.ok) {
      throw new Error("Failed to update Hotel");
    }
  
    return response.json();
};

export type SearchParams ={
  destination?:string;
  checkIn?:string;
  checkOut?:string;
  adultCount?:string;
  childCount?:string;
  page?:string;
  facilities?: string[];
  types?: string[];
  stars?: string[];
  maxPrice?: string;
  sortOption?: string;
}
export const searchHotels =async(searchParams:SearchParams):Promise<HotelSearchResponse>=>{
  const queryParams = new URLSearchParams();
  queryParams.append("destination", searchParams.destination || "");
  queryParams.append("checkIn", searchParams.checkIn || "");
  queryParams.append("checkOut", searchParams.checkOut || "");
  queryParams.append("adultCount", searchParams.adultCount || "");
  queryParams.append("childCount", searchParams.childCount || "");
  queryParams.append("page", searchParams.page || "");
  
  queryParams.append("maxPrice", searchParams.maxPrice || "");
  queryParams.append("sortOption", searchParams.sortOption || "");

  searchParams.facilities?.forEach((facility) =>
    queryParams.append("facilities", facility)
  );

  searchParams.types?.forEach((type) => queryParams.append("types", type));
  searchParams.stars?.forEach((star) => queryParams.append("stars", star));
  const response = await fetch(`${API_BASE_URL}/api/hotels/search?${queryParams}`);

  if(!response.ok){
    throw new Error("Error fetching hotels");
  }
  return response.json();
}
export const fetchHotels = async (): Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/hotels`);
  if (!response.ok) {
    throw new Error("Error fetching hotels");
  }
  return response.json();
};
export const fetchRecentlyWatchedHotels = async () => {
  const response = await fetch(`${API_BASE_URL}/api/hotels/recently-watched`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error fetching recently watched hotels');
  }

  return response.json();
};
export const fetchHotelById =async(hotelId:string): Promise<HotelType> =>{
  const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`, {
    credentials: 'include', // Ensure cookies are sent with the request
  });
  if (!response.ok) {
    throw new Error("Error fetching Hotel");
  }

  return response.json();
}

export const createRoomBooking = async (formData: BookingFormData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/hotels/${formData.hotelId}/bookings/${formData.roomId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    }
  );
  if (!response.ok) {
    throw new Error("Error booking room");
  }
};
export const cancelRoomBooking = async (formData: CancelBookingFormData) => {
  const response =await fetch(
    `${API_BASE_URL}/api/my-bookings/${formData.bookingId}`,{
      method:"PUT",
      credentials:"include",
    });
    const body = await response.json();
    if (!response.ok) {
      throw new Error(body.message);
    }
  
    return body;
};

export const fetchMyBookings = async (): Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/my-bookings`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Unable to fetch bookings");
  }

  return response.json();
};
export const addRoom = async (RoomFormData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels/${RoomFormData.get("hotelId")}/addRoom`, {
    method: "PUT",
    credentials: "include",
    body: RoomFormData,
  });

  if (!response.ok) {
    throw new Error("Failed to add Room");
  }

  return response.json();
};
export const updateRoomHotelById =async (roomFormData: FormData) =>{
  const response =await fetch(
    `${API_BASE_URL}/api/my-hotels/${roomFormData.get("hotelId")}/${roomFormData.get("roomId")}`,{
      method:"PUT",
      body:roomFormData,
      credentials:"include",
    });
    if (!response.ok) {
      throw new Error("Failed to update Room");
    }
  
    return response.json();
};
export const fetchRoomHotelById = async (hotelId:string,roomId: string): Promise<Room> => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}/${roomId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching Hotels");
  }

  return response.json();
};
