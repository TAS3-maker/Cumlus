import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Search, Bell, ZapIcon, LogOut } from "lucide-react";
import ClockClockwise from "../../assets/ClockClockwise.png";
import { API_URL } from "../utils/Apiconfig";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import profile from "../../assets/profile.jpg";
import MobileSidebar from "../../Component/Main/MobileSidebar";
import fetchUserData from "./fetchUserData";

const Navbar = ({ onFolderSelect }) => {
    const [showSearch, setShowSearch] = useState(false);
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [isMembershipActive, setIsMembershipActive] = useState(false);
    const [username, setUsername] = useState("");
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    const navigate = useNavigate();
    const dropdownVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
    };
    useEffect(() => {
        const getUserData = async () => {
            try {
                const data = await fetchUserData();
                if (!data?.user) {
                    throw new Error("Invalid response structure");
                }

                setUserData(data);
                setIsMembershipActive(data.user.activeMembership);
                setUsername(data.user.username);
            } catch (err) {
                setError(err.message || "Failed to fetch user data");
            }
        };
        getUserData();
    }, []);

    async function logout() {
        try {
            const token = Cookies.get("token");

            if (!token) {
                throw new Error("No token found. Please log in again.");
            }

            const apiUrl = `${API_URL}/api/auth/signout`;

            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };

            const response = await fetch(apiUrl, { method: "POST", headers });

            if (!response.ok) {
                throw new Error("Failed to log out. Please try again.");
            }

            Cookies.remove("token");
            navigate("/Login");
        } catch (error) {
            console.error(error);
        }
    }

    const toggleDropdown = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    return (
        <nav className="flex items-center justify-between px-0 md:px-8 py-3 bg-white shadow-md relative">
            <div className="md:hidden">
                <MobileSidebar onFolderSelect={onFolderSelect} />
            </div>
            <div className="flex-grow md:mx-4">
                <div className="hidden md:flex items-center">
                    <Search className="text-gray-500 ml-2" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="flex-grow px-3 py-2 rounded-md focus:outline-none"
                    />
                </div>

                {/* <div className="flex md:hidden">
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
                </div> */}

            </div>
            <div className="flex items-center space-x-2 md:space-x-4 px-3 relative">
                {!isMembershipActive && (
                    <Link to="/subscription">
                        <span className="flex border-2 border-blue-500 p-0.5 rounded-sm cursor-pointer">
                            <ZapIcon className="h-5 w-5 md:h-6 md:w-6 fill-blue-500 stroke-none" />
                            <button className="text-blue-500 text-xs md:text-sm">
                                Subscribe
                            </button>
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
                <div className="relative">
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={toggleDropdown}
                    >
                        <img
                            src={profile}
                            alt="User"
                            className="h-8 w-8 rounded-full object-cover"
                        />
                        <p className="text-black mt-1 ml-1 hidden md:block">{username}</p>
                    </div>
                    {isProfileDropdownOpen && (
                        <motion.div
                            className="absolute right-0 mt-2  border border-gray-200 rounded-md py-2 bg-blue-500 text-white shadow-lg w-28 z-10"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={dropdownVariants}
                        >
                            <button
                                onClick={logout}
                                className="flex items-center justify-between  hover:text-red-600  cursor-pointer font-medium rounded-md px-4 py-2 w-full transition duration-300"
                            >
                                {/* <LogOut className="w-5 h-5 mr-2" /> */}
                                <span>Sign Out</span>
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </nav>
    );
};

Navbar.propTypes = {
    onFolderSelect: PropTypes.func,
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