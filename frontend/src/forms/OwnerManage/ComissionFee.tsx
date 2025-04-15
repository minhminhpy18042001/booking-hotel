import { useQuery } from "react-query";
import * as apiClient from "../../api-client";
import styles from "./../../css/HotelManage.module.css"

const CommissionFee =() => {

    const {data:payments}=useQuery("fetchPayments",()=>apiClient.fetchPayments());
    if(!payments){
        return <div>No Payment found...</div>;
    }
    return (
        <div className={styles.container}>
            <h2>Booking Management</h2>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Method</th>
                        <th>Fee(VND)</th>
                        <th>status</th>

                    </tr>
                </thead>
                <tbody>
                    {payments.map((payment) => ( 
                            <tr key={payment._id}>
                                {/* <td>{payment.paymentDate.toLocaleDateString()} </td>
                                <td>{payment.paymentMethod}</td>
                                <td>{payment.amount} </td>
                                <td>{payment.paymentStatus}</td> */}
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
                                <td>{payment.paymentStatus}</td>
                            </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default CommissionFee;
