import { useQuery, useMutation } from "react-query";
import * as apiClient from "../api-client";
import styles from "./../css/HotelManage.module.css"
import { useState } from "react";
import { useAppContext } from "../contexts/AppContext";

const Credit =() => {
    const { showToast } = useAppContext();
    const {data:payments}=useQuery("fetchPayments",()=>apiClient.fetchPayments());
    const{data:user} = useQuery("fetchCurrentUser", apiClient.fetchCurrentUser);
    const [searchId, setSearchId] = useState("");
    const withdrawMutation = useMutation(apiClient.withdraw, {
        onSuccess: () => {
            showToast({ message: "Booking Saved!", type: "SUCCESS" });
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
            <div className="flex items-center gap-4 mb-4">
                <span className="text-xl font-bold">Credit:</span>
                <span className={`text-2xl font-mono ${user && user.credit < 0 ? 'text-red-600' : 'text-green-700'}`}>{user ? user.credit : 0} VND</span>
                <button
                    className={`ml-4 px-4 py-2 rounded font-bold text-white ${user && user.credit > 0 ? 'bg-blue-600 hover:bg-blue-500' : 'bg-gray-400 cursor-not-allowed'}`}
                    disabled={!user || user.credit <= 0 || withdrawMutation.isLoading}
                    onClick={() => {
                        if (user && user.credit > 0) {
                            const amount = user.credit;
                            if (window.confirm(`Withdraw ${amount} VND?`)) {
                                withdrawMutation.mutate(amount);
                            }
                        }
                    }}
                >
                    {withdrawMutation.isLoading ? "Processing..." : "Withdraw"}
                </button>
            </div>
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
                                <td style={{ color: payment.paymentMethod === 'credit'&&payment.paymentFor!=='refund'? 'red' : 'green' }}>{payment.paymentMethod === 'credit'&&payment.paymentFor!=='refund' ? '-' : ''}{payment.amount}</td>
                                <td>{payment.paymentStatus}</td>
                                <td>{payment.paymentFor || '-'}</td>
                            </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default Credit;
