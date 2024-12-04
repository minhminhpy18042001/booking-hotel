// HotelManage.tsx
import { useQuery } from "react-query";
import * as apiClient from "../../api-client";
import styles from "./../../css/HotelManage.module.css"

const HotelManage =() => {
    const {data: hotels}=useQuery("fetchHotels",()=>apiClient.fetchHotels());
    if(!hotels){
        return <div>No Hotel found...</div>;
    }
    return (
        <div className={styles.container}>
            <h2>Hotel Management</h2>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Index</th>
                        <th>User Id</th>
                        <th>Name</th>
                        <th>City</th>
                        <th>County</th>
                        <th>Rating</th>

                    </tr>
                </thead>
                <tbody>
                    {hotels.map((hotel,index) => (
                        
                        
                        <tr key={hotel._id}>
                            <td>{index + 1}</td>
                            <td>{hotel.userId}</td>
                            <td>{hotel.name}</td>
                            <td>{hotel.city}</td>
                            <td>{hotel.country}</td>
                            <td>{'★'.repeat(Math.round(hotel.starRating))}</td>
                            {/* <td>{hotel.rooms}</td>
                            <td>{hotel.rating}</td> */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HotelManage