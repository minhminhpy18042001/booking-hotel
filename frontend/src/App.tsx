import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import AddHotel from "./pages/AddHotel";
import { useAppContext } from "./contexts/AppContext";
import MyHotels from "./pages/Myhotels";
import EditHotel from "./pages/EditHotel";
import Search from "./pages/Search";
import Detail from "./pages/Detail";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import AddRoom from "./pages/AddRoom";
import EditRoom from "./pages/EditRoom";
import Home from "./pages/Home";
import AddReview from "./pages/AddReview";
import EditReview from "./pages/EditReview";
import LayoutAdmin from "./layouts/LayoutAdmin";
import Admin from "./pages/Admin";
import MyGuests from "./pages/MyGuests";



const App =()=>{
  const {isLoggedIn}= useAppContext();
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout>
          <Home/>
        </Layout>}/>
        <Route path="/search" element={<Layout>
          <Search/>
        </Layout>}/>
        <Route path="/admin" element={<LayoutAdmin>
          <Admin/>
        </LayoutAdmin>}/>
        <Route path="/detail/:hotelId" element={<Layout>
          <Detail/>
        </Layout>}/>
        <Route path ="/register" element={<Layout>
          <Register />
        </Layout>}/>
        <Route path="/sign-in" element ={<Layout>
          <SignIn />
        </Layout>}/>
        {isLoggedIn &&<>
        <Route path ="/hotel/:hotelId/booking/:roomId" element={
          <Layout>
            <Booking/> 
          </Layout>
        }/>
        <Route path ="/add-hotel" element={
          <Layout>
            <AddHotel/> 
          </Layout>
        }/>
        <Route path ="/edit-hotel/:hotelId" element={
          <Layout>
            <EditHotel/> 
          </Layout>
        }/>
        <Route path ="/edit-hotel/:hotelId/addRoom" element={
          <Layout>
            <AddRoom/> 
          </Layout>
        }/>
        <Route path ="/edit-hotel/:hotelId/:roomId" element={
          <Layout>
            <EditRoom/> 
          </Layout>
        }/>

         <Route path ="/my-hotels" element={
          <Layout>
            <MyHotels/> 
          </Layout>
        }/>
        <Route path ="/my-guests" element={
          <Layout>
            <MyGuests/> 
          </Layout>
        }/>
        <Route path ="/my-bookings" element={
          <Layout>
            <MyBookings/> 
          </Layout>
        }/>
        <Route path ="/my-bookings/review/:bookingId" element={
          <Layout>
            <AddReview/> 
          </Layout>
        }/>
        <Route path ="/my-bookings/review/:bookingId/edit" element={
          <Layout>
            <EditReview/> 
          </Layout>
        }/>
        </>}
        <Route path="*" element={<Navigate to="/"/>}/>
      </Routes>
    </BrowserRouter>
  );
};


export default App;
