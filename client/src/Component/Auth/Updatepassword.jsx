import {
    Loader2
      } from "lucide-react";
import React, { useState } from "react";
import logo from "../../assets/logo.png";
import rightsignup from "../../assets/signup-right.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import useLoadingStore from "../../store/UseLoadingStore";
import { API_URL } from "../utils/Apiconfig";
const Updatepassword = () => {
    const navigate = useNavigate();
    const { isLoading, showLoading, hideLoading } = useLoadingStore();
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [newPassword, setNewPassword] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handleOtpChange = (value, index) => {
        if (/^\d?$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            console.log("Current OTP:", newOtp.join(""));

            // Move to next box if input is added
            if (value && index < 5) {
                document.getElementById(`otp-${index + 1}`).focus();
            }

            // Move to previous box if backspace is pressed
            if (!value && index > 0) {
                document.getElementById(`otp-${index - 1}`).focus();
            }
        }
    };

    const handlePasswordChange = (e) => setNewPassword(e.target.value);

    const handleSendOTP = async () => {

        try {
            showLoading();
            const response = await axios.post(`${API_URL}/api/auth/send-otp`, { email });
            if (response.data.success) {
                setMessage("OTP sent successfully! Please check your email.");
                setIsOtpSent(true); // This will trigger the OTP input field to appear.
             


            } else {
                setMessage(response.data.message);
                setIsOtpSent(true);
            }
        } catch (error) {
            setMessage("An error occurred while sending OTP.");
        }
        finally {
            hideLoading();
        }
    };

    
    const handleVerifyOtp = async (otp) => {
        if (!otp || otp.length !== 6) {
            setError("Please enter a valid 6-digit OTP.");
            return;
        }
    
        try {
            console.log("Sending OTP:", otp, "Email:", email);
            const response = await axios.post(`${API_URL}/api/auth/confirm-otp`, {
                email,
                otp,
            });
            if (response.status === 200) {
                // alert('OTP verified successfully!');
                setIsOtpVerified(true);
                setError(""); // Clear error message
            } else {
                setError(response.data.message || "Failed to verify OTP.");
            }
        } catch (err) {
            console.error("Error verifying OTP:", err.response?.data?.message);
            setError(err.response?.data?.message || 'Error verifying OTP');
        }
    };
    


    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("Email:", email);
    
        // Clear previous errors
        setError("");
    
        // Validate input fields
        if (!email) {
            setError("Email is required.");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }
    
        const loginRequestBody = { email };
        console.log("Login Payload:", loginRequestBody);
    
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginRequestBody),
            });
    
            console.log('Response status:', response.status); // Log the response status
    
            // Check for 400 status code
            if (response.status === 400) {
                const errorData = await response.json();
                console.log("Error Response Data:", errorData);  // Log error response data
                setError(errorData.message || "Incorrect email .");
                return;
            }
            else {
                handleSendOTP();
        
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("There was an error . Please try again.");
        }
    };


        const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        const data = { email, newPassword };
        console.log("Email:", email);
        console.log("New Password:", newPassword);

        try {
            const response = await fetch(`${API_URL}/api/auth/update-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                setMessage(result.message || "Password updated successfully!");
                navigate('/Thankyou'); 
            } else {
                setMessage(result.message || "An error occurred");
            }
        } catch (error) {
            console.error("Error updating password:", error);
            setMessage("An error occurred while updating the password");
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen text-white  md:justify-center">
            {/* Left Section */}
            <div className="md:w-2/4 w-full flex flex-col justify-center items-center p-3 md:p-6">
                <div className="bg-white text-black p-6 rounded-lg w-full max-w-md">
                    <div className="flex items-center mb-6">
                        <img src={logo} alt="Cumulus Logo" className="h-10 w-full" />
                    </div>
                    <h2 className="text-black text-2xl font-bold mb-2">Forgot Password</h2>
                    <p className="text-gray-600 mb-6">Enter your email to reset your password.</p>

                    {/* Email Section */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none"
                            placeholder="Enter your email"
                            value={email}
                            onChange={handleEmailChange}
                            readOnly={isOtpVerified}
                        />
{!isOtpVerified && (
                            <div className="flex justify-end">
                                {isLoading ? (
                                    <button
                                        type="submit"
                                        className="mt-2 cursor-not-allowed flex justify-center bg-blue-400 py-1 px-4  rounded-md text-white"
                                    >
                                        <Loader2 className="animate-spin h-6 w-6 font-bold" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleLogin}
                                        className="mt-2 bg-blue-500 text-white flex py-1 px-4 rounded-md hover:bg-blue-600"
                                    >
                                        Send OTP
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* OTP Section */}
                    {isOtpSent && (
                        <div className="mt-4">
                            <label htmlFor="otp" className="block text-sm font-medium">Enter OTP</label>
                            <div className="flex gap-2 mt-2">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(e.target.value, index)}
                                        className="w-10 h-10 border rounded text-center"
                                    />
                                ))}
                            </div>
                            {isLoading ? (<button
                                type="submit"
                                className="cursor-not-allowed flex justify-center  bg-blue-400 w-full  rounded-md text-white mt-2 px-4 py-1"
                            >
                                <Loader2 className="animate-spin h-6 w-6 font-bold" />
                            </button>) : (<button
                                onClick={() => handleVerifyOtp(otp.join(""))} // Pass joined OTP as a string
                                className="mt-2 bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600"
                            >
                                Verify OTP
                            </button>
                            )}

                        </div>
                    )}

                    {/* Password Section */}
                    {isOtpVerified && (
                        <div className="mt-4">
                            <label htmlFor="newPassword" className="block text-sm font-medium">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={handlePasswordChange}
                            />
                            <button
                                onClick={handlePasswordSubmit}
                                className="mt-2 bg-green-500 text-white py-1 px-4 rounded-md hover:bg-green-600"
                            >
                                Update Password
                            </button>
                        </div>
                    )}

                    {message && <p className="text-center mt-4 text-green-600">{message}</p>}
                    {error && <p className="text-center mt-4 text-red-600">{error}</p>}
                </div>
                <p className="text-center text-gray-500 mt-4">
                         Don&apos;t have an account?{" "}
                         {/* <a href="#" className="text-blue-500">
                             Register Now
                         </a> */}
                         <Link to="/" className="text-blue-500">
                             Register Now
                         </Link>
                    </p>
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

export default Updatepassword;