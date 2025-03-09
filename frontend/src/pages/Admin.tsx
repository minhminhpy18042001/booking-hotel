import { useState } from "react";
import { useAppContext } from "../contexts/AppContext";
import './../css/Admin.module.css';
import HotelApprovedManage from "../forms/AdminManage/HotelApprovedManage";
import UserManage from "../forms/AdminManage/UserManage";
import BookingManage from "../forms/AdminManage/BookingManage";
import HotelPendingManage from "../forms/AdminManage/HotelPendingManage";
import RevenueManage from "../forms/AdminManage/RevenueManage";
const Admin =()=>{
    const { isLoggedIn, isAdmin } = useAppContext();
    const [selectedEntity, setSelectedEntity] = useState("Revenue"); // Default selection
    const [expandedHotelSection, setExpandedHotelSection] = useState("Pending");

    // // Function to handle some admin action
    // const handleAdminAction = () => {
    //     // Perform some admin-specific action
    //     showToast({ message: "Admin action performed!", type: "SUCCESS" });
    // };
    // const handleEntityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //     setSelectedEntity(event.target.value);
    //     // You can add logic here to fetch or display data based on the selected entity
    //     showToast({ message: `You are now viewing: ${event.target.value}`, type: "SUCCESS" });
    // };
    // Check if the user is logged in and is an owner
    if (!isLoggedIn) {
        return <div>You must be logged in to access this page.</div>;
    }

    if (!isAdmin) {
        return <div>You do not have permission to access this page.</div>;
    }

    return (
        <div style={{ display: "flex", fontFamily: "Arial, sans-serif", backgroundColor: "#f9f9f9", height: "100vh" }}>
    {/* Sidebar */}
    <div style={{ width: "250px", borderRight: "1px solid #ccc", padding: "20px", backgroundColor: "#fff" }}>
        <h3 style={{ color: "#333", marginBottom: "20px" }}>Watch Entities</h3>
        <ul style={{ listStyleType: "none", padding: "0" }}>
            <li onClick={() => setSelectedEntity("Revenue")}
              style={{ cursor: "pointer", padding: "12px", borderRadius: "4px", transition: "background-color 0.3s", backgroundColor: selectedEntity === "Revenue" ? "#e0e0e0" : "transparent" }}>
              Revenue
            </li>
            <li onClick={() => setSelectedEntity("Hotel")} 
                style={{ cursor: "pointer", padding: "12px", borderRadius: "4px", transition: "background-color 0.3s", backgroundColor: selectedEntity === "Hotel" ? "#e0e0e0" : "transparent"}}>
                Hotel
            </li>
            {selectedEntity === "Hotel" && (
            <>
              <li onClick={() => setExpandedHotelSection("Approved")}
                style={{ cursor: "pointer", padding: "12px",margin: 15, borderRadius: "4px", transition: "background-color 0.3s", backgroundColor: expandedHotelSection === "Approved" ? "#e0e0e0" : "transparent" }}>
                Approved Hotels
              </li>
              <li onClick={() => setExpandedHotelSection("Pending")}
                style={{ cursor: "pointer", padding: "12px",margin: 15, borderRadius: "4px", transition: "background-color 0.3s", backgroundColor: expandedHotelSection === "Pending" ? "#e0e0e0" : "transparent" }}>
                Pending Hotels
              </li>
            </>
          )}
            <li onClick={() => setSelectedEntity("User")} 
                style={{ cursor: "pointer", padding: "12px", borderRadius: "4px", transition: "background-color 0.3s", backgroundColor: selectedEntity === "User " ? "#e0e0e0" : "transparent" }}>
                User
            </li>
            <li onClick={() => setSelectedEntity("Booking")} 
                style={{ cursor: "pointer", padding: "12px", borderRadius: "4px", transition: "background-color 0.3s", backgroundColor: selectedEntity === "Booking" ? "#e0e0e0" : "transparent" }}>
                Booking
            </li>

        </ul>
    </div>

    {/* Main Content Area */}
    <div style={{ flex: 1, padding: "20px", backgroundColor: "#fff" }}>
        <h1 style={{ color: "#333" }}>Admin Page</h1>
        {/* <h2 style={{ color: "#555" }}>Selected Entity: <span style={{ fontWeight: "bold" }}>{selectedEntity}</span></h2> */}
        {selectedEntity === "Hotel" && (
          <>
            {expandedHotelSection === "Approved" && <HotelApprovedManage />}
            {expandedHotelSection === "Pending" && <HotelPendingManage/>}
          </>
        )}
        {selectedEntity==="User"&&<UserManage></UserManage>}
        {selectedEntity==="Booking"&&<BookingManage></BookingManage>}
        {selectedEntity==="Revenue"&&<RevenueManage></RevenueManage>}
        {/* You can add more admin functionalities or display data based on selectedEntity */}

    </div>
</div>
    );
}
export default Admin;