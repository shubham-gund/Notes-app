import React,{useState} from 'react';
import PasswordInput from '../../components/Input/PasswordInput';
import Navbar from '../../components/Navbar/Navbar';
import { validateEmail } from '../../utils/helper';
import { Link,useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosinstance';

const SignUp =()=>{
    const [email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    const [name,setName]=useState("");
    const [error,setError]=useState(null); 
    const navigate = useNavigate();

    const handleSignUp = async (e)=>{
        e.preventDefault();

        if(!name){
            setError("Please enter your Name.");
            return;
        }
        if(!validateEmail(email)){
            setError("Please enter a valid email address.");
            return;
        }
        if(!password){
            setError("Please enter valid password");
            return
        }
        setError("")

        //SignUP Api call
        try {
            const response = await axiosInstance.post("/create-account",{
                fullName:name,
                email:email,
                password:password,
            })
            if(response.data && response.data.error){
                setError(response.data.message)
                return
            }
            if(response.data && response.data.accessToken){
                localStorage.setItem("token",response.data.accessToken)
                navigate("/dashboard")
            }
        } catch (error) {
            if(error.response && error.response.data && error.response.data.message){
                setError(error.response.data.message)
            }
        }
    };

    return (
        <>
            <Navbar></Navbar>
            <div className='flex items-center justify-center mt-36 sm:mt-28'>
                <div className='w-72 sm:w-96 border rounded-md px-6 py-8 sm:px-8 sm:py-10 drop-shadow-[0_3px_25px_rgba(255,255,255,0.14)] bg-black'>
                    <form onSubmit={handleSignUp}>
                        <h4 className='text-lg sm:text-2xl font-bold mb-4 text-white text-center'>Sign-Up</h4>
                        <input type="text" placeholder='Name' className='input-box' 
                            value={name}
                            onChange={(e)=>setName(e.target.value)}
                        />
                        <input type="text" placeholder='Email' className='input-box' 
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                        />
                        <PasswordInput value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                        ></PasswordInput>

                        {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
                        <button type='submit' className='btn-primary font-semibold'>Create Account</button>
                        <p className='text-sm text-white text-center mt-4'>
                        Already have an Account ?{" "} 
                            <Link to="/login" className="font-medium text-primary underline">Login</Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    )
}

export default SignUp