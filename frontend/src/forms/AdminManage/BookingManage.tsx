
import { useQuery } from "react-query";
import * as apiClient from "../../api-client";
import styles from "./../../css/HotelManage.module.css"

const BookingManage =() => {
    const {data: hotels}=useQuery("fetchHotels",()=>apiClient.fetchHotels());
    if(!hotels){
        return <div>No Hotel found...</div>;
    }
    return (
        <div className={styles.container}>
            <h2>Booking Management</h2>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Hotel</th>
                        <th>Email</th>
                        <th>Guest</th>
                        <th>CheckIn/CheckOut</th>
                        <th>Total cost</th>
                        <th>Status</th>

                    </tr>
                </thead>
                <tbody>
                    {hotels.map((hotel) => ( 
                        hotel.bookings.map((booking) => (
                            <tr key={booking._id}>
                                <td>{hotel.name} </td>
                                <td>{booking.email}</td>
                                <td>{booking.adultCount} adult {booking.childCount} children</td>
                                <td >{new Date(booking.checkIn).toLocaleDateString()}{" To "} {new Date(booking.checkOut).toLocaleDateString()}</td>
                                <td>{booking.totalCost}$</td>
                                <td>{booking.statusBooking}</td>
                            </tr>
                        ))
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BookingManage