import { User, Eye, EyeClosed } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

function LoginPage(){
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || `http://localhost:5000`;

    const navigate = useNavigate()
    const signUp = () => navigate('/signup')
    const { login } = useAuth();

    const [showPassword, setShowPassword] = useState(false)
    const handleShowPassword = () => setShowPassword(state => !state)

    const [user, setUsername] = useState("")
    const [pass, setPassword] = useState("")
    const handleUsername = (e) => setUsername(e.target.value)
    const handlePassword = (e) => setPassword(e.target.value)

    const [response, setResponse] = useState(null);
    
    const handleLogin = (e) => {
        e.preventDefault();

        fetch(`${BACKEND_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username:user,
                password:pass
            })
        })
        .then(res => res.json())
        .then(data => {
            setResponse(data); // set response in both cases
            if(data.success){
                login(data.data, data.token);
                navigate('/')
            }
        })
    }
    
    console.log(response)
    return(
        <>
            <div className="pageWrapper justify-center items-center">
               
                <div className="flex flex-col gap-3 bg-secondary w-[300px] rounded-2xl p-5 text-primary ">
                    <p 
                        className='text-3xl font-bold self-center mb-4'
                        >Login
                    </p>

                    <div className="flex w-full border-2 border-primary py-1.5 px-2 rounded-2xl">
                        <input 
                            type="text" 
                            placeholder="Username / Email" 
                            onChange={handleUsername}
                            value={user}
                            className='w-full focus:outline-none  focus:border-transparent'    
                        />
                        <User className='fill-primary'/>
                    </div>

                    <div className="flex w-full border-2 border-primary py-1.5 px-2 rounded-2xl">
                        <input 
                            type={!showPassword ? 'password' : 'text'} 
                            placeholder="Password"
                            onChange={handlePassword}
                            value={pass} 
                            className='w-full focus:outline-none  focus:border-transparent'    
                        />

                        {!showPassword 
                            ? (<EyeClosed onClick={handleShowPassword} className='cursor-pointer'/>) 
                            : (<Eye onClick={handleShowPassword} className='cursor-pointer'/>)
                        }

                    </div>

                    {response && (
                        <p className={`text-[12px] ${!response.success ? 'text-red-500' : ''}`}> {!response.success ? 'Incorrect Credentials' : ''} </p>
                    )}
                
                    <p 
                        className='text-[12px] cursor-pointer self-end'
                        >Forget Password?
                    </p>

                    <button 
                        onClick={handleLogin}
                        className="flex w-full justify-center items-center border-2 bg-primary p-1.5 rounded-2xl text-secondary cursor-pointer
                                   hover:bg-accent hover:text-primary"
                        >Login
                    </button>

                    <p 
                        className='text-[12px] self-center'
                        >Don't have an account? <span onClick={signUp} className='text-accent cursor-pointer'>Register Now</span>
                    </p>
                </div>
                
            </div>
            
        </>
    )
}

export default LoginPage;