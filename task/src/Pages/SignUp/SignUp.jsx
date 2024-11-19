import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PasswordInput from '../../components/Input/PasswordInput';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

const SignUp = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (!name) {
            setError('Name is required');
            return;
        }
        if (!email) {
            setError('Email is required');
            return;
        }
        if (!password) {
            setError('Password is required');
            return;
        }
        setError(null);

        // SignUp API call
        try {
            const response = await axiosInstance.post("/create-account", {
                fullName: name,
                email: email,
                password: password,
            });

            // Handle successful signup response
            if (response.data && response.data.error) {
                setError(response.data.message);
                return;
            }
            if (response.data && response.data.accessToken) {
                localStorage.setItem("token", response.data.accessToken);
                navigate("/dashboard");
            }
        } catch (error) {
            // Handle signup error
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("An unexpected error occurred, Please try again.");
            }
        }
    };

    return (
        <>
            <Navbar />

            <div className='flex justify-center items-center mt-28'>
                <div className='relative w-96 group'>
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-purple-400 to-blue-500 rounded-lg opacity-10 blur-lg group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
                    
                    <div className='relative w-full border border-gray-200/10 rounded-lg bg-white px-7 py-10 shadow-[0_8px_30px_rgb(0,0,0,0.07)]'>
                        <form onSubmit={handleSignUp}>
                            <h4 className='text-2xl mb-7'>Sign Up</h4>

                            <input
                                type="text"
                                placeholder='Name'
                                className='input-box'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />

                            <input
                                type="text"
                                placeholder='Email'
                                className='input-box'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <PasswordInput
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

                            <button type='submit' className='start_button'>
                                Create Account
                            </button>

                            <p className='text-sm text-center mt-4'>
                                Already have an account?{" "}
                                <Link to="/login" className='font-medium text-primary underline'>
                                    Login
                                </Link>
                            </p>

                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SignUp;