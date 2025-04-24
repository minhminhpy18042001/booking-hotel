import { useEffect, useState } from "react";
import { useAppContext } from "../contexts/AppContext";
import './../css/Admin.module.css';
import BookingManage from "../forms/OwnerManage/BookingManage";
import CommissionFee from "../forms/OwnerManage/ComissionFee";
import * as apiClient from "../api-client";
import { UserType } from "../../../backend/src/shared/types";
import RevenueManageOwner from "../forms/OwnerManage/RevenueManageOwner";
const MyGuests = () => {
    const { isLoggedIn, isOwner } = useAppContext();
    const [selectedEntity, setSelectedEntity] = useState("Booking"); // Default selection
    const [user, setUser] = useState<UserType | null>(null);
    const credit = user ? Math.abs(user.credit) : 0;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await apiClient.fetchCurrentUser();
                setUser(response);
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        };
        fetchUser();
    }, []);
    if (!isLoggedIn) {
        return <div>You must be logged in to access this page.</div>;
    }
    if (!isOwner) {
        return <div>You do not have permission to access this page.</div>;
    }
    return (
        <div style={{ display: "flex", fontFamily: "Arial, sans-serif", backgroundColor: "#f9f9f9", height: "100vh" }}>
            {/* Sidebar */}
            <div style={{ width: "250px", borderRight: "1px solid #ccc", padding: "20px", backgroundColor: "#fff" }}>
                <h3 style={{ color: "#333", marginBottom: "20px" }}>Watch Entities</h3>
                <ul style={{ listStyleType: "none", padding: "0" }}>
                    {/* <li onClick={() => setSelectedEntity("Hotel")} 
                style={{ cursor: "pointer", padding: "12px", borderRadius: "4px", transition: "background-color 0.3s", backgroundColor: selectedEntity === "Hotel" ? "#e0e0e0" : "transparent"}}>
                Hotel
            </li>
            <li onClick={() => setSelectedEntity("User")} 
                style={{ cursor: "pointer", padding: "12px", borderRadius: "4px", transition: "background-color 0.3s", backgroundColor: selectedEntity === "User " ? "#e0e0e0" : "transparent" }}>
                User
            </li> */}
                    <li onClick={() => setSelectedEntity("Booking")}
                        style={{ cursor: "pointer", padding: "12px", borderRadius: "4px", transition: "background-color 0.3s", backgroundColor: selectedEntity === "Booking" ? "#e0e0e0" : "transparent" }}>
                        Booking
                    </li>
                    <li onClick={() => setSelectedEntity("Payment")}
                        style={{ cursor: "pointer", padding: "12px", borderRadius: "4px", transition: "background-color 0.3s", backgroundColor: selectedEntity === "Payment" ? "#e0e0e0" : "transparent" }}>
                        Payment
                    </li>
                    <li onClick={() => setSelectedEntity("Revenue")}
                        style={{ cursor: "pointer", padding: "12px", borderRadius: "4px", transition: "background-color 0.3s", backgroundColor: selectedEntity === "Revenue" ? "#e0e0e0" : "transparent" }}>
                        Revenue
                    </li>
                </ul>
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, padding: "20px", backgroundColor: "#fff" }}>
                <div>
                    <h1 style={{ color: "#333" }}>Manage Page</h1>
                    <h2 style={{ color: "#555" }}>Selected Entity: <span style={{ fontWeight: "bold" }}>{selectedEntity}</span></h2>
                </div>
                <div>
                    <h2 style={{ color: "#555" }}>User Information:</h2>
                    {user && (
                        <div style={{ backgroundColor: "#f0f0f0", padding: "10px", borderRadius: "4px",placeItems:"center" }}>
                            <div>
                                <p style={{ color: user.credit >= 0 ? 'green' : 'red' }}>
                                    <strong >{user.credit >= 0 ? 'Credit' : 'Commission fee'}:</strong>
                                    {credit} VND
                                </p>
                            </div>
                            <div>
                                <button
                                    style={{
                                        backgroundColor: "#007bff",
                                        color: "#fff",
                                        border: "none",
                                        padding: "10px 20px",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        transition: "background-color 0.3s",
                                    }}
                                    onClick={() => {
                                        if (user.credit >= 0) {
                                            window.location.href = "/add-credit";
                                        }
                                        else {
                                        window.location.href = `/add-credit?amount=${credit}`;
                                        }
                                    }}
                                >
                                    {user.credit >= 0 ? 'Add credit' : 'Pay now'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                {/* {selectedEntity==="Hotel"&&<HotelManage></HotelManage>}
            {selectedEntity==="User"&&<UserManage></UserManage>} */}
                {selectedEntity === "Booking" && <BookingManage></BookingManage>}
                {selectedEntity === "Payment" && <CommissionFee></CommissionFee>}
                {selectedEntity === "Revenue" && <RevenueManageOwner></RevenueManageOwner>}
                {/* Add more components based on selectedEntity */}
                {/* You can add more admin functionalities or display data based on selectedEntity */}

            </div>

        </div>
    );
}
export default MyGuests;


