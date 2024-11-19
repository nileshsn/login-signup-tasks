import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { Link, useNavigate } from 'react-router-dom'
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import OTPInput from '../../components/Input/OTPInput';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSendOTP = async (e) => {
        e.preventDefault();
        // 1. Validate email
        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }
        setError("");
        setIsLoading(true);

        try {
            // 2. Send OTP API call
            await axiosInstance.post("/send-otp", {
                email: email,
            });
            setIsOtpSent(true);
            setError(null);
        } catch (error) {
            // 3. Handle error
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        } finally {
            // 4. Reset loading state
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        // 1. Validate OTP
        if (!otp || otp.length !== 6) {
            setError("Please enter a valid OTP");
            return;
        }
        setError("");
        setIsLoading(true);

        try {
            // 2. Verify OTP API call
            const response = await axiosInstance.post("/verify-otp", {
                email: email,
                otp: otp,
            });

            // 3. Handle successful OTP verification
            if (response.data && response.data.accessToken) {
                localStorage.setItem("token", response.data.accessToken);
                navigate("/dashboard");
            }
        } catch (error) {
            // 4. Handle error
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("Invalid OTP. Please try again.");
            }
        } finally {
            // 5. Reset loading state
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setIsLoading(true);
        try {
            // 1. Resend OTP API call
            await axiosInstance.post("/send-otp", {
                email: email,
            });
            setError("OTP resent successfully!");
        } catch (error) {
            // 2. Handle error
            setError("Failed to resend OTP. Please try again.");
        } finally {
            // 3. Reset loading state
            setIsLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className='flex justify-center items-center mt-28'>
                <div className='relative w-96 group'>
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-purple-400 to-blue-500 rounded-lg opacity-10 blur-lg group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
                    
                    <div className='relative w-full border border-gray-200/10 rounded-lg bg-white px-7 py-10 shadow-[0_8px_30px_rgb(0,0,0,0.07)]'>
                        <form onSubmit={isOtpSent ? handleVerifyOTP : handleSendOTP}>
                            <h4 className='text-2xl mb-7'>Login</h4>

                            {!isOtpSent ? (
                                <>
                                    {/* 1. Email input */}
                                    <input
                                        type="email"
                                        placeholder='Email'
                                        className='input-box'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isLoading}
                                    />

                                    {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

                                    {/* 2. Send OTP button */}
                                    <button 
                                        type='submit'
                                        className='start_button'
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Sending OTP...' : 'Send OTP'}
                                    </button>
                                </>
                            ) : (
                                <>
                                    {/* 1. OTP input */}
                                    <p className='text-sm text-gray-600 mb-6'>
                                        Enter the OTP sent to {email}
                                    </p>

                                    <OTPInput
                                        value={otp}
                                        onChange={setOtp}
                                        disabled={isLoading}
                                    />

                                    {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

                                    {/* 2. Verify OTP button */}
                                    <button 
                                        type='submit'
                                        className='start_button'
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Verifying...' : 'Verify OTP'}
                                    </button>

                                    {/* 3. Resend OTP button */}
                                    <button 
                                        onClick={handleResendOTP}
                                        disabled={isLoading}
                                        className="start_button transparent mt-4"
                                        type="button"
                                    >
                                        Resend OTP
                                    </button>

                                    {/* 4. Change Email button */}
                                    <button 
                                        onClick={() => {
                                            setIsOtpSent(false);
                                            setOtp("");
                                            setError(null);
                                        }}
                                        className="start_button transparent mt-2"
                                        type="button"
                                    >
                                        Change Email
                                    </button>
                                </>
                            )}

                            {/* 5. Don't have an account? */}   
                            <p className='text-sm text-center mt-4'>
                                Don't have an account?{" "}
                                <Link to="/signup" className='font-medium text-primary underline'>
                                    Create an account
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;