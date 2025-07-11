export type UserType = {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role:string;
  credit: number;
  phone: string;
  avatar: string;
};

export type HotelType = {
  _id: string;
  userId: string;
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  adultCount: number;
  childCount: number;
  facilities: string[];
  pricePerNight: number;
  starRating: number;
  imageUrls: string[];
  lastUpdated: Date;
  statusHotel:string;
  bookings: BookingType[];
  rooms: Room[];
};

export type BookingType = {
  _id: string;
  userId: string;
  roomId:string;
  firstName: string;
  lastName: string;
  email: string;
  adultCount: number;
  childCount: number;
  checkIn: Date;
  checkOut: Date;
  totalCost: number;
  statusBooking:string;
  paymentMethod: number; // Payment method field, optional
  rating: {
    score: number,
    review: string,
    comment:string,
    date:Date; 
},
};
export type Room={
  _id:string;
  name:string;
  roomSize:string;
  description: string;
  typeBed:string;
  pricePerNight:number;
  specialPrices: { date: Date; price: number }[];
  imageUrls: string[];
  amount:number;
  policy: number;
  Bookings: BookingType[];
}

export type HotelSearchResponse = {
  data: HotelType[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
};

export type PaymentType ={
  _id:string;
  amount:number;
  userId:string;
  paymentMethod:string;
  paymentStatus:string;
  paymentDate:Date;
  paymentFor:string;
}