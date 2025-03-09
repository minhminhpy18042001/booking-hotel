// HotelManage.tsx
import { useQuery, useQueryClient } from "react-query";
import * as apiClient from "../../api-client";
import styles from "./../../css/HotelManage.module.css"


const HotelPendingManage =() => {
    const queryClient = useQueryClient();
    const {data: hotels} = useQuery("fetchPendingHotels",()=>apiClient.fetchPendingHotels());

    const {data: users}=useQuery("fetchUsers",()=>apiClient.fetchUsers());
    if(!hotels||!users){
        return <div>No Hotel found...</div>;
    }
    const userMap = users ? Object.fromEntries(users.map(user => [user._id, user])) : {};
    const handleApproveHotel = async (hotelId: string) => {
        try {
            await apiClient.approveHotel(hotelId);
            // Refresh the hotels data
            queryClient.invalidateQueries("fetchPendingHotels");
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div className={styles.container}>
            <h2>Hotel Management</h2>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Index</th>
                        <th>Owner Email</th>
                        <th>Name</th>
                        <th>City</th>
                        <th>County</th>
                        <th>Rating</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {hotels.map((hotel, index) => {
                        const user = userMap[hotel.userId]; // Lookup user by userId
                        return (
                            <tr key={hotel._id}>
                                <td>{index + 1}</td>
                                <td>{user ? user.email : 'Loading...'}</td> {/* Display user email */}
                                <td>{hotel.name}</td>
                                <td>{hotel.city}</td>
                                <td>{hotel.country}</td>
                                <td>{'★'.repeat(Math.round(hotel.starRating))}</td>
                                <td>
                            <button className={styles.approveButton} onClick={() => handleApproveHotel(hotel._id)}>Approve</button>
                        </td>

                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default HotelPendingManage

