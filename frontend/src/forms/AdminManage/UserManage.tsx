// HotelManage.tsx
import { useQuery } from "react-query";
import * as apiClient from "../../api-client";
import styles from "./../../css/HotelManage.module.css"

const UserManage =() => {
    const {data: users}=useQuery("fetchUsers",()=>apiClient.fetchUsers());
    if(!users){
        return <div>No User found...</div>;
    }
    return (
        <div className={styles.container}>
            <h2>User Management</h2>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Index</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Role</th>

                    </tr>
                </thead>
                <tbody>
                    {users.map((user,index) => (
                        
                        
                        <tr key={user._id}>
                            <td>{index + 1}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            {/* <td>{hotel.rooms}</td>
                            <td>{hotel.rating}</td> */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManage