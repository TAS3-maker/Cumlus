import { useState , useEffect } from "react";
import PropTypes from 'prop-types';

import { Search, Bell, ZapIcon, Menu } from "lucide-react";
import ClockClockwise from "../../assets/ClockClockwise.png";
import profile from "../../assets/profile.jpg";
// import Sidebar from "../../Component/Main/Sidebar";
import MobileSidebar from "../../Component/Main/MobileSidebar";
import { Link , NavLink } from "react-router-dom";
// import { Sheet, SheetContent, SheetTrigger } from "@radix-ui/react-sheet";
import fetchUserData from "./fetchUserData";
const Navbar = ({onFolderSelect}) => {
    const [showSearch, setShowSearch] = useState(false);
    // const active = localStorage.getItem('active');
    // const membership = localStorage.getItem('membership');
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [isMembershipActive, setIsMembershipActive] = useState(false);
    const [membershipDetail, setMembershipDetail] = useState(null);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [deletebutton1, setDeletebutton1] = useState(false);
    useEffect(() => {
        const getUserData = async () => {
            try {
                const data = await fetchUserData();              
                if (!data?.user) {
                    throw new Error("Invalid response structure");
                }
    
                setUserData(data);
                console.log("data",data);
                console.log("data user",data.user);
                setIsMembershipActive(data.user.activeMembership);
                setMembershipDetail(data.user.memberships);
                console.log("details",data.user.membershipDetail);
                console.log("membership",data.user.isMembershipActive);
            } catch (err) {
                setError(err.message || "Failed to fetch user data");
            }
        };
        getUserData();
    }, []);
    
    useEffect(() => {
        // Retrieve the user data from localStorage
        const storedUser = localStorage.getItem("user");
        const storedEmail = localStorage.getItem("email");
        console.log("krcnjrncirc", storedUser);
        console.log("krcnjrncirc", storedEmail);
        setEmail(storedUser);
       
      }, []);
      
      
      
    


    return (
        <nav className="flex items-center justify-between px-0 md:px-8 py-3 bg-white shadow-md">
            <div className="md:hidden">
                <MobileSidebar  onFolderSelect={onFolderSelect}/>
            </div>
            {/* Search Bar */}
            <div className="flex-grow md:mx-4">
                {/* Desktop and Medium Screen */}
                <div className="hidden md:flex items-center">
                    <Search className="text-gray-500 ml-2" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="flex-grow px-3 py-2 rounded-md focus:outline-none"
                    />
                </div>

                {/* Mobile Screen */}
                <div className="flex md:hidden">
                    <Search
                        className="text-gray-500 ml-1 mb-1 md:ml-2 cursor-pointer"
                        onClick={() => setShowSearch(true)}
                    />
                    {showSearch && (
                        <div className="fixed top-0 left-0 w-full bg-white shadow-md p-4 flex items-center z-50">
                            <input
                                type="text"
                                placeholder="Search"
                                className="flex-grow px-4 py-2 border rounded-md focus:outline-blue-500"
                            />
                            <button
                                className="ml-2 text-gray-600"
                                onClick={() => setShowSearch(false)}
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            
            <div className="flex items-center space-x-1 md:space-x-4 px-3">

                {!isMembershipActive && (
                <Link to="/subscription">
                    <span className="flex border-2 border-blue-500 p-0.5 rounded-sm cursor-pointer">
                        <ZapIcon className="h-5 w-5 md:h-6 md:w-6 fill-blue-500 stroke-none" />
                        <button className="text-blue-500 text-xs md:text-sm">Subscribe</button>
                    </span>
                </Link>
                )}
                <span>
                    <img src={ClockClockwise} alt="Clock Icon" className="h-7 w-7" />
                </span>
                <button>
                    <Bell className="text-gray-700 w-6 h-6" />
                </button>
                <p className="hidden md:block">|</p>
                <div className="flex">
                    <img
                        src={profile}
                        alt="User"
                        className="h-8 w-8 rounded-full object-cover"
                    />
                    <p className="text-black mt-1 ml-1 hidden md:block">{email}</p>
                </div>
            </div>                  

        </nav>
    );
};
Navbar.propTypes = {
    searchQuery: PropTypes.string.isRequired,
    setSearchQuery: PropTypes.func.isRequired,
};
export default Navbar;

// const MobileSidebar = () => {
//     const [isOpen, setIsOpen] = useState(false);

//     return (
//         <Sheet open={isOpen} onOpenChange={setIsOpen}>
//             <SheetTrigger>
//                 <Menu
//                     className="w-7 h-7 pt-1 text-gray-700 cursor-pointer"
//                     onClick={() => setIsOpen(!isOpen)} // Toggling the state when the menu is clicked
//                 />
//             </SheetTrigger>
//             <SheetContent>
//                 {/* You don't need DialogTitle here */}
//                 <div>
//                     <Sidebar />
//                 </div>
//             </SheetContent>
//         </Sheet>
//     );
// };