import { useQuery } from "react-query";
import * as apiClient from "../../api-client";
import styles from "./../../css/HotelManage.module.css"

const BookingManage =() => {
    const {data: hotels}=useQuery("fetchMyHotels",()=>apiClient.fetchMyHotels());
    if(!hotels){
        return <div>No Hotel found...</div>;
    }
    // Flatten all bookings with hotel info
    const allBookings = hotels.flatMap(hotel => hotel.bookings.map(booking => ({ ...booking, hotel })));
    // Sort by check-in date ascending
    allBookings.sort((b,a) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());
    return (
        <div className={styles.container}>
            <h2>Booking Management</h2>
            <table className={styles.table}>
                <thead>
                    <tr>
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
                    {allBookings.map((booking) => (
                        <tr key={booking._id}>
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