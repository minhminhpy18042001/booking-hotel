// HotelManage.tsx
import { useMutation, useQuery,useQueryClient } from "react-query";
import * as apiClient from "../../api-client";
import styles from "./../../css/HotelManage.module.css"

export type UpdateUserFormData={
    userId:string;
    role:string;
}
const UserManage =() => {
    const queryClient = useQueryClient();
    const {data: users}=useQuery("fetchUsers",()=>apiClient.fetchUsers());
    const {mutate:updateRole} = useMutation(apiClient.updateUserRole , {
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries("fetchUsers");
        },
    });
    const handleRoleChange = async (userId:string,newRole:string) => {
        console.log(userId,newRole)
        updateRole({userId,role:newRole});
    };
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
                    {users&&users.map((user,index) => (
                        
                        
                        <tr key={user._id}>
                            <td>{index + 1}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>
                                <select
                                    value={user.role}
                                    onChange={(e) => {
                                        handleRoleChange(user._id, e.target.value);
                                        
                                    }}
                                >
                                    <option value="user">User </option>
                                    <option value="owner">Owner</option>
                                    {/* Add more roles as needed */}
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManage