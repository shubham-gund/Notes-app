import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/Input/PasswordInput';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosinstance';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        if (!password) {
            setError("Please enter valid password");
            return
        }
        setError("");

        //Login api call
        try {
            const response = await axiosInstance.post("/login",{
                email:email,
                password:password,
            })
            if(response.data && response.data.accessToken){
                localStorage.setItem("token",response.data.accessToken)
                navigate('/dashboard');
            }
        } catch (error) {
            if(error.response && error.response.data && error.response.data.message){
                setError(error.response.data.message)
            }
        }
    }

    return (
        <>
            <Navbar />
            <div className='flex items-center justify-center mt-36 sm:mt-28'>
                <div className='w-72 sm:w-96 border rounded-md px-6 py-8 sm:px-8 sm:py-10 drop-shadow-[0_3px_25px_rgba(255,255,255,0.14)] bg-black'>
                    <form onSubmit={handleLogin}>
                        <h4 className='text-lg sm:text-2xl font-bold mb-4 text-white text-center'>Login</h4>
                        <input type="text" placeholder='Email' className='input-box mb-4'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <PasswordInput value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        ></PasswordInput>

                        {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
                        <button type='submit' className='btn-primary font-semibold w-full'>Login</button>
                        <p className='text-sm text-center text-white mt-4'>
                            Not registered yet?{" "}
                            <Link to="/signup" className="font-medium text-primary underline">Create an Account</Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login;
