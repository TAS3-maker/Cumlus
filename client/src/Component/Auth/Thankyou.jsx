import React from "react";
import logo from "../../assets/logo.png";
import rightsignup from "../../assets/signup-right.png";
import { Link, useNavigate } from "react-router-dom";
const Thankyou =() => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col md:flex-row h-screen text-white  md:justify-center">
            {/* Left Section */}
            <div className="md:w-2/4 w-full flex flex-col justify-center items-center p-3 md:p-6">
                <div className="bg-white text-black p-6 rounded-lg  w-full max-w-md">
                    {/* Logo */}
                    <div className="flex items-center mb-6">
                        <img
                            src={logo}
                            alt="Cumulus Logo"
                            className="h-10 w-full"
                        />
                    </div>

                   
                
                 
                   <div className="mb-5">
                     <h2 className="text-black text-center text-3xl md:text-4xl font-semibold mb-1">Thank you for updating  your password Please login!</h2>

                     {/* <p className=" text-xs text-gray-600">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Neque iste amet iure minus culpa, dolor, quo corrupti maiores exercitationem voluptatem sunt suscipit, quas fugiat. Dolore quidem iste quam delectus illum!</p> */}
                   </div>
                   <Link to="/Login">
                   <button
        
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition "
                        >
                            Login
                        </button>
                        </Link>
                </div>
            </div>

            {/* Right Section */}
            <div className="hidden lg:flex md:w-3/5 bg-gray-100 justify-center items-center aspect-[16/9]">
                <img
                    src={rightsignup}
                    alt="Illustration"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
};

export default Thankyou;
