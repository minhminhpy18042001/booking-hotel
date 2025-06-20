import {Link} from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";
import { useState, useRef, useEffect } from "react";
import avatar from '../images/avatar.png';
import { useQuery } from "react-query";
import * as apiClient from "../api-client";

const Header =()=>{
    const {isLoggedIn,isOwner}=useAppContext();
    const [showProfile, setShowProfile] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const { data: user } = useQuery("fetchCurrentUser", apiClient.fetchCurrentUser);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setShowProfile(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return(
        <div className ="bg-blue-800 py-6">
            <div className="container mx-auto flex justify-between">
                <span className="text-3xl text-white font-bold tracking-tight">
                    <Link to ="/">BookingHotel.com</Link>
                </span>
                <span className="flex space-x-2 items-center">
                    {isLoggedIn ?<>
                        <Link className="flex items-center text-white px-3 font-bold hover:bg-blue-600" to ="/my-bookings">My Bookings</Link>
                        {isOwner &&<>
                        <Link className="flex items-center text-white px-3 font-bold hover:bg-blue-600" to ="/my-hotels">My Hotels</Link>
                        <Link className="flex items-center text-white px-3 font-bold hover:bg-blue-600" to ="/my-guests">My Guests</Link>
                        </>}
                        <div className="relative" ref={profileRef}>
                            <button
                                className="flex items-center text-white px-3 font-bold hover:bg-blue-600 focus:outline-none"
                                onClick={() => setShowProfile((prev) => !prev)}
                            >
                                <img src={user?.avatar ? user.avatar : avatar} alt="Profile" className="w-8 h-8 rounded-full mr-2" />
                                {user ? `${user.firstName} ${user.lastName}` : "Profile"}
                            </button>
                            {showProfile && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg z-50 text-black">
                                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">View Profile</Link>
                                    <Link to="/my-bookings" className="block px-4 py-2 hover:bg-gray-100">My Bookings</Link>
                                    <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</Link>
                                    <Link to="/credit" className="block px-4 py-2 hover:bg-gray-100">Credits</Link>
                                    <div className="border-t my-1"></div>
                                    <SignOutButton />
                                </div>
                            )}
                        </div>
                    </>:
                    <Link to ="/sign-in" className="flex bg-white items-center text-blue-600 px-3 font-bold hover:bg-gray-100">Sign In</Link>}
                </span>
            </div>
        </div>
    );
};

export default Header;