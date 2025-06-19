import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import * as apiClient from "../../api-client";
import styles from "../../css/CheckPayment.module.css"
const CheckPayment = () => {
    const [status, setStatus] = useState<"success" | "error">("error");
    const [title, setTitle] = useState<string>("");
    const searchParams = new URLSearchParams(useLocation().search);
    useEffect(() => {
        (async () => {
          try {
              const result = await apiClient.checkPayment(
                searchParams.toString()
              );
              // result: { message, data, paymentFor }
              if (result.data == "00") {
                setStatus("success");
                setTitle("Thanh toán thành công");
                setTimeout(() => {
                  console.log(result)
                  if (result.data.paymentFor === 'room') {
                    window.location.href = "/my-bookings";
                  } else {
                    window.location.href = "/";
                  }
                }, 3000);
              } else if (result.data && result.data.vnp_ResponseCode == "24") {
                setStatus("error");
                setTitle("Khách hàng hủy thanh toán");
              }
          } catch (error) {}
        })();
      }, [searchParams]);
      return (
        <div className={styles.paymentStatus}>
         <h1 className={`${styles.status} ${status === 'success' ? 'success' : 'error'}`}>{status}</h1>
          <p className={styles.title}>{title}</p>
          <div className={styles.buttonContainer}>
            <button
              className={styles.backButton}
              onClick={() => {
                window.location.href = "/";
              }}
            >
              Quay lại trang chủ
            </button>
          </div>
        </div>
      );
    }
export default CheckPayment;