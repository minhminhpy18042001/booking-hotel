import { useQuery, useMutation } from "react-query";
import * as apiClient from "../../api-client";
import styles from "./../../css/HotelManage.module.css"
import { useState } from "react";
import { useAppContext } from "../../contexts/AppContext";
const Withdraw =() => {

    const { showToast } = useAppContext();
    const {data:payments}=useQuery("fetchAllWithdraws",()=>apiClient.fetchAllWithdraws());
    const [searchId, setSearchId] = useState("");
    const updateStatusMutation = useMutation(apiClient.updateWithdrawStatus, {
        onSuccess: () => {
            showToast({ message: "Status update completed", type: "SUCCESS" });
            window.location.reload();
        },
        onError: (error: any) => {
            showToast({ message: error.message, type: "ERROR" });
        },
    });
    if(!payments){
        return <div>No Payment found...</div>;
    }
    // Filter payments by payment ID if searchId is set
    const filteredPayments = searchId
        ? payments.filter(payment => payment._id.toLowerCase().includes(searchId.toLowerCase()))
        : payments;
    return (
        <div className={styles.container}>
            <h2>Booking Management</h2>
            <input
                type="text"
                placeholder="Search Payment ID..."
                className="mb-4 p-2 border rounded w-64"
                value={searchId}
                onChange={e => setSearchId(e.target.value)}
            />
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Payment ID</th>
                        <th>Date</th>
                        <th>Method</th>
                        <th>Fee(VND)</th>
                        <th>Status</th>
                        <th>Payment For</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPayments.map((payment) => ( 
                            <tr key={payment._id}>
                                <td>{payment._id.length > 12 ? `${payment._id.slice(0, 6)}...${payment._id.slice(-4)}` : payment._id}</td>
                                <td>{new Date(payment.paymentDate).toLocaleString('en-US', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false
                                })} </td>
                                <td style={{ color: payment.paymentMethod === 'vnpay' ? 'green' : 'red' }}>{payment.paymentMethod}</td>
                                <td style={{ color: payment.paymentMethod === 'vnpay' ? 'green' : 'red' }}>{payment.paymentMethod === 'credit' ? '-' : ''}{payment.amount}</td>
                                <td>{payment.paymentStatus}
                                    {payment.paymentStatus === "pending" && (
                                        <button
                                            className="ml-2 px-2 py-1 bg-green-600 text-white rounded hover:bg-green-500"
                                            onClick={() => updateStatusMutation.mutate(payment._id)}
                                            disabled={updateStatusMutation.isLoading}
                                        >
                                            {updateStatusMutation.isLoading ? "Updating..." : "Mark as Completed"}
                                        </button>
                                    )}
                                </td>
                                <td>{payment.paymentFor || '-'}</td>
                            </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default Withdraw;
