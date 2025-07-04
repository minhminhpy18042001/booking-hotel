import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import { BookingType, HotelSearchResponse, HotelType, PaymentType, Room, UserType } from "../../backend/src/shared/types";
import { BookingFormData } from "./forms/BookingForm/BookingForm";
import {CancelBookingFormData} from "./forms/CancelBookingForm/CancelBookingForm"
import { UpdateUserFormData } from "./forms/AdminManage/UserManage";
import { ResetPasswordFormData } from "./pages/ResetPassword";

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
export const fetchUserById =async(userId:string):Promise<UserType>=>{
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
    credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Error fetching user");
    }
    return response.json();
}
export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: "POST",
    credentials: "include",
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
export const resetPassword = async (formData: ResetPasswordFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/reset-password/${formData.userId}/${formData.token}`, {
    method: "POST",
    credentials: "include",
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
export const fetchPendingHotels = async (): Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/hotels/pending`);
  if (!response.ok) {
    throw new Error("Error fetching hotels");
  }
  return response.json();
};
export const fetchApprovedHotels = async (): Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/hotels/approved`);
  if (!response.ok) {
    throw new Error("Error fetching hotels");
  }
  return response.json();
};
export const approveHotel = async (hotelId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/hotels/approve/${hotelId}`, {
      method: 'PUT',
      credentials:"include",
  });

  if (!response.ok) {
      throw new Error('Failed to approve hotel');
  }
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
  const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}/${roomId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching Hotels");
  }

  return response.json();
};
export const addReview =async(reviewFormData:FormData)=>{
  const response = await fetch(`${API_BASE_URL}/api/my-bookings/review/${reviewFormData.get("bookingId")}`, {
    method: "PUT",
    credentials: "include",
    body: reviewFormData,
  });
  if (!response.ok) {
    throw new Error("Failed to add Room");
  }
  return response.json();
}
export const fetchReviewById= async(bookingId:string):Promise<BookingType>=>{
  const response = await fetch(`${API_BASE_URL}/api/my-bookings/${bookingId}`,{
    credentials:"include",
  })
  if (!response.ok) {
    throw new Error("Error fetching Review");
  }
  return response.json();
}
export const fetchUsers =async():Promise<UserType[]> =>{
  const response = await fetch(`${API_BASE_URL}/api/users/getUsers`,{
    credentials:"include",
  });
  if (!response.ok) {
    throw new Error("Error fetching Users");
  }
  return response.json();
}
export const updateUserRole =async(formData:UpdateUserFormData)=>{
  const response = await fetch(`${API_BASE_URL}/api/users/updateRole/${formData.userId}/${formData.role}`,{
    credentials:"include",
    method:"PUT",
  });
    if (!response.ok) {
      throw new Error("Error Update Users");
    }

    return response.json();
}
export const sendPasswordResetLink = async (email: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/users/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error('Failed to send password reset link');
  }
};
export const fetchRevenue =async()=>{
  const response = await fetch(`${API_BASE_URL}/api/revenue`,{
    credentials:"include",
  });
  if (!response.ok) {
    throw new Error("Error fetching Revenue");
  }
  return response.json();
}
export const fetchRevenueHotel =async(hotelId:string)=>{
  const response = await fetch(`${API_BASE_URL}/api/revenue/${hotelId}`,{
    credentials:"include",
  });
  if (!response.ok) {
    throw new Error("Error fetching Revenue");
  }
  return response.json();
}
export const fetchRevenueByDateRange =async(startDate:string,endDate:string)=>{
  const response = await fetch(`${API_BASE_URL}/api/revenue/hotels/by-date-range?startDate=${startDate}&endDate=${endDate}`,{
    credentials:"include",
  });
  if (!response.ok) {
    throw new Error("Error fetching Revenue");
  }
  return response.json();
}
export const fetchRevenueOwnerByDateRange =async(startDate:string,endDate:string)=>{
  const response = await fetch(`${API_BASE_URL}/api/revenue/hotelsOwner/by-date-range?startDate=${startDate}&endDate=${endDate}`,{
    credentials:"include",
  });
  if (!response.ok) {
    throw new Error("Error fetching Revenue");
  }
  return response.json();
}
export const fetchRevenueByHotelIdAndDateRange =async(hotelId:string,startDate:string,endDate:string)=>{  
  const response = await fetch(`${API_BASE_URL}/api/revenue/hotels/${hotelId}/by-date-range?startDate=${startDate}&endDate=${endDate}`,{
    credentials:"include",
  });
  if (!response.ok) {
    throw new Error("Error fetching Revenue");
  }
  return response.json();
}
export const saveSpecialPrice =async(hotelId:string,roomId:string,price:string,date:string)=>{
  const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}/${roomId}/special-price`,{
    method:"PUT",
    credentials:"include",
    headers:{
      "Content-Type":"application/json",
    },
    body:JSON.stringify({price,date}),
    });
    if (!response.ok) {
      throw new Error("Error saving special price");
    }
    return response.json();
}
export const saveSpecialPriceforAllRooms =async(hotelId:string,price:string,date:string)=>{
  const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}/special-prices/allroom`,{
    method:"PUT",
    credentials:"include",
    headers:{
      "Content-Type":"application/json",
    },
    body:JSON.stringify({price,date}),
    });
    if (!response.ok) {
      throw new Error("Error saving special price");
    }
    return response.json();
}
export const createPayment =async (amount:number):Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/api/payment/create-payment-vnpay/${amount}/false`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error create payment");
  }
  return response.json();
}
export const createPaymentBooking =async (amount:number):Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/api/payment/create-payment-vnpay/${amount}/true`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error create payment");
  }
  return response.json();
}
export const checkPayment =async (searchParams:string) => {
  const response = await fetch(`${API_BASE_URL}/api/payment/check-payment-vnpay?${searchParams}`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error check payment");
  }
  return response.json();
}

export const fetchPayments=async():Promise<PaymentType[]>=>{
  const response = await fetch(`${API_BASE_URL}/api/payment`,{
    credentials:"include",
  });
  if (!response.ok) {
    throw new Error("Error fetching Payment");
  }
  return response.json();
}
export const fetchAllPayment =async():Promise<PaymentType[]>=>{
  const response = await fetch(`${API_BASE_URL}/api/payment/all`,{
    credentials:"include",
  });
  if (!response.ok) {
    throw new Error("Error fetching Payment");
  }
  return response.json();
}
export const withdraw =async(amount:number)=>{
  const response = await fetch(`${API_BASE_URL}/api/payment/withdraw`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount }),
  });
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message);
  }
  return body;
}
export const fetchAllWithdraws =async():Promise<PaymentType[]>=>{
  const response = await fetch(`${API_BASE_URL}/api/payment/allWithdraws`,{
    credentials:"include",
  });
  if (!response.ok) {
    throw new Error("Error fetching Withdraws");
  }
  return response.json();
}
export const changePassword =async (currentPassword:string,newPassword:string)=>{
  const response = await fetch(`${API_BASE_URL}/api/users/change-password`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ currentPassword, newPassword}),
  });
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message);
  }
  return body;
}
export const updateUserProfile = async (firstName:string,lastName:string,phone:string) => {
  const response = await fetch(`${API_BASE_URL}/api/users/update-profile`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ firstName, lastName, phone }),
  });
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message);
  }
  return body;
}
export const uploadAvatar = async (formData:FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/update-avatar`, {
    method: "PUT",
    credentials: "include",
    body: formData,
  });
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message);
  }
  return body;
}
export const updateWithdrawStatus = async (paymentId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/payment/update-status`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paymentId }),
  });
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message);
  }
  return body;
};