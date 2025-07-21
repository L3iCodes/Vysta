import { User, Eye, EyeClosed, Mail } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUpPage(){
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || `http://localhost:5000`;

    const navigate = useNavigate()
    const login = () => navigate('/login')

    const [showPassword, setShowPassword] = useState(true)
    const handleShowPassword = () => setShowPassword(state => !state)

    const [user, setUsername] = useState("")
    const [pass, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const handleUsername = (e) => setUsername(e.target.value)
    const handlePassword = (e) => setPassword(e.target.value)
    const handleEmail = (e) => setEmail(e.target.value)

    const [response, setResponse] = useState(null)

    const handleSignup = (e) => {
        e.preventDefault();
        
        if (!user.trim() || !email.trim() || !pass.trim()) {
            setResponse({ success: false, message: 'All fields are required' });
            return;
        }

        fetch(`${BACKEND_URL}/signup`, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: user,
                email,
                password:pass
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            setResponse(data)
            if(!data.success){
                setUsername('')
                setEmail('')
            }else{
                setUsername('')
                setEmail('')
                setPassword('')
            }
        
        })
    }

    return(
        <>
            <div className="pageWrapper justify-center items-center">
               
                <div className="flex flex-col gap-3 bg-secondary w-[300px] rounded-2xl p-5 text-primary ">
                    <p 
                        className='text-3xl font-bold self-center mb-4'
                        >Register
                    </p>

                    <div className="flex w-full border-2 border-primary py-1.5 px-2 rounded-2xl">
                        <input 
                            type="text" 
                            placeholder="Username" 
                            required={true}    
                            value={user}   
                            className='w-full focus:outline-none  focus:border-transparent'    
                            onChange={handleUsername}
                        />
                        <User className=''/>
                    </div>

                    <div className="flex w-full border-2 border-primary py-1.5 px-2 rounded-2xl">
                        <input 
                            type="text" 
                            placeholder="Email" 
                            required={true}
                            value={email}   
                            className='w-full focus:outline-none  focus:border-transparent'
                            onChange={handleEmail}    
                        />
                        <Mail className=''/>
                    </div>

                    <div className="flex w-full border-2 border-primary py-1.5 px-2 rounded-2xl">
                        <input 
                            type={!showPassword ? 'password' : 'text'} 
                            placeholder="Password" 
                            className='w-full focus:outline-none  focus:border-transparent'
                            required={true}
                            value={pass}      
                            onChange={handlePassword}
                        />

                        {!showPassword 
                            ? (<EyeClosed onClick={handleShowPassword} className='cursor-pointer'/>) 
                            : (<Eye onClick={handleShowPassword} className='cursor-pointer'/>)
                        }
                    </div>

                    {response && (
                        <p className={`text-[12px] self-end ${!response.success ? 'text-red-500' : 'text-green-500'}`}>
                            {!response.success ? (response.message || 'User already exists') : 'Account Created'}
                        </p>
                    )}

                   
                    <button 
                        onClick={handleSignup}
                        className="flex w-full justify-center items-center border-2 bg-primary p-1.5 rounded-2xl text-secondary cursor-pointer
                                   hover:bg-accent hover:text-primary"
                        >Sign Up
                    </button>

                    <p 
                        className='text-[12px] self-center'
                        >Already have an account? <span onClick={login} className='text-accent cursor-pointer'>Login</span>
                    </p>
                </div>
                
            </div>
            
        </>
    )
}

export default SignUpPage;