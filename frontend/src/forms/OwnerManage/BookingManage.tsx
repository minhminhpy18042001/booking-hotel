import { useQuery } from "react-query";
import * as apiClient from "../../api-client";
import styles from "./../../css/HotelManage.module.css"
import { useState } from "react";

const BookingManage =() => {
    const {data: hotels}=useQuery("fetchMyHotels",()=>apiClient.fetchMyHotels());
    const [searchId, setSearchId] = useState("");
    if(!hotels){
        return <div>No Hotel found...</div>;
    }
    // Flatten all bookings with hotel info
    const allBookings = hotels.flatMap(hotel => hotel.bookings.map(booking => ({ ...booking, hotel })));
    // Filter by booking ID if searchId is set
    const filteredBookings = searchId
        ? allBookings.filter(booking => booking._id.toLowerCase().includes(searchId.toLowerCase()))
        : allBookings;
    // Sort by check-in date ascending
    filteredBookings.sort((b,a) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());
    return (
        <div className={styles.container}>
            <h2>Booking Management</h2>
            <input
                type="text"
                placeholder="Search Booking ID..."
                className="mb-4 p-2 border rounded w-64"
                value={searchId}
                onChange={e => setSearchId(e.target.value)}
            />
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Booking ID</th>
                        <th>Hotel</th>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Guest</th>
                        <th>CheckIn/CheckOut</th>
                        <th>Total cost</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBookings.map((booking) => (
                        <tr key={booking._id}>
                            <td>{booking._id.length > 12 ? `${booking._id.slice(0, 6)}...${booking._id.slice(-4)}` : booking._id}</td>
                            <td>{booking.hotel.name}</td>
                            <td>{booking.email}</td>
                            <td>{booking.firstName} {booking.lastName}</td>
                            <td>{booking.adultCount} adult {booking.childCount} children</td>
                            <td>{new Date(booking.checkIn).toLocaleDateString()} To {new Date(booking.checkOut).toLocaleDateString()}</td>
                            <td>{booking.totalCost}$</td>
                            <td>{booking.statusBooking}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BookingManage