import { Menu, Home, Globe, List, Search, X, User, Moon, SunDim, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

function Navbar(){

    // Navigation Bar Control
    const [navOpen, setNavOpen] = useState(false)
    const handleNav = () => setNavOpen(state => !state)
    const location = useLocation();
    const currentPath = location.pathname;
    
    const [profileOpen, setProfileOpen] = useState(false)
    const handleProfileOpen = () => setProfileOpen(state => !state)

    // Search Control
    const [searchOpen, setSearchOpen] = useState(false)
    const handleSearch = () => setSearchOpen(state => !state)
    const [searchMovie, setSearchMovie] = useState('')
    const handleKeyDown = (e) => {
        if (e.key === 'Enter'){
            setSearchMovie('')
            search()
            e.preventDefault();
        }
    }
    
    // Darkmode Control
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    const toggleTheme = () => setIsDark(prev => !prev);

    // Navigation
    const navigate = useNavigate();
    const home = () => navigate('/')
    const browse = () => navigate(`/browse`)
    const catalog = () => navigate(`/sample/28`)
    const search = () => navigate(searchMovie ? `/movie/search/${searchMovie}/page/1` : `/`)
    const login = () => navigate(`/login`)
    const watchlist = () => navigate(`/watchlist`)

    // Credentials
    const {user, logout} = useAuth();

    // Windows Width
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    return(
        <>
            <div className={`flex flex-col-reverse shrink-0 w-[60px] h-[60px] p-[10px] absolute bottom-0 right-0  bg-secondary rounded-2xl text-primary text-[0.9rem] z-20
                            md:relative md:flex-col md:h-full
                            transition-all ease-out duration-300 
                            ${!navOpen ? `h-[60px] overflow-hidden` : `h-[450px] !bg-secondary/90`}
                            ${!navOpen ? `md:w-[60px]` : `md:w-[250px]`}`}>
                    
                    <div className='flex flex-col-reverse gap-[20px] md:flex-col'>
                        <div onClick={() => {
                            if(window.innerWidth >= 768){ //Open/close both nav and search when window is md
                                handleSearch();
                                handleNav();
                            }else{
                                handleNav()
                            }

                            }} className='desktop-nav-element-wrapper'>
                            <Menu className={`desktop-nav-element`}/>
                            <p className={`hidden ${!navOpen ? 'md:hidden' : 'md:block'} font-extrabold text-[1.2rem]`}>Vysta</p>
                        </div>

                        {/* Search */}
                        <div className={`relative desktop-nav-element-wrapper ${!navOpen ? 'hidden' : 'bg-primary/10'}`}>
                            <Search onClick={() => {
                                if(window.innerWidth >= 768){ //Open/close both nav and search when window is md
                                    handleSearch();
                                    handleNav();
                                }else{
                                    handleSearch()
                                }
                                
                                }} className={`desktop-nav-element z-10`}/>
                            
                            <input type='text' placeholder='Search' 
                                   className={`absolute right-[55px] h-[40px] bg-secondary p-2.5 rounded-2xl
                                               md:relative md:left-0 md:bg-primary/0 z-1
                                   ${!navOpen ? 'hidden' : 'block'} focus:outline-none  focus:border-transparent
                                   
                                   transition-all duration-300 ease-in
                                   ${!searchOpen ? 'w-0 opacity-0' : 'translate-x-0' } `}
                                   
                                   onChange={(e) => setSearchMovie(e.target.value)}
                                   onKeyDown={handleKeyDown}
                                   value={searchMovie}
                                   >

                                   </input>
                        </div>
                    </div>
                    
                    {/* Home, Browse, Wathclist */}
                    <div className='flex flex-col my-[50px] gap-2'>
                        <div title="Home" onClick={home} className={`desktop-nav-element-wrapper ${currentPath === "/" ? `bg-accent hover:!bg-accent` : ""}` }>
                            <Home className={`desktop-nav-element`}/>
                            <p className={`hidden ${!navOpen ? 'md:hidden' : 'md:block'}`}>Home</p>
                        </div>
                        <div title="Browse" onClick={browse} className={`desktop-nav-element-wrapper ${currentPath === "/browse" ? `bg-accent hover:!bg-accent` : ""}` }>
                            <Globe className={`desktop-nav-element`}/>
                            <p className={`hidden ${!navOpen ? 'md:hidden' : 'md:block'} text-[0.9rem]`}>Browse</p>
                        </div>
                        <div title="Watch List" onClick={watchlist} className={`desktop-nav-element-wrapper ${currentPath === "/watchlist" ? `bg-accent hover:!bg-accent` : ""}`}>
                            <List className={`desktop-nav-element`}/>
                            <p className={`hidden ${!navOpen ? 'md:hidden' : 'md:block'}`}>Watch List</p>
                        </div>
                    </div>
                    
                    <div className='flex flex-col mt-auto gap-[20px]'>

                        <div className='flex flex-row items-center justify-center'>
                            <div className={`md:flex gap-1 items-center hidden ${!navOpen ? 'md:hidden' : 'md:block'}`}>
                                {!isDark? (<SunDim size={30}/>) : <Moon size={30}/>}
                                <p className='mr-5'>{isDark? "Dark" : "Light"} Mode</p>
                            </div>
                            
                            <div title="Theme" onClick={toggleTheme} className='flex items-center justify-between w-[40px] h-[25px] border-2 border-primary rounded-2xl relative p-[1px] cursor-pointer bg-primary/100'>
                                <div className={`flex justify-center items-center h-[15px] w-[15px] rounded-full bg-secondary z-10 absolute
                                                 transition-all ease-in duration-500 ${isDark? 'translate-x-[20px]' : 'translaty-x-0'}`}>
                                </div>
                                <Moon size={15} className='text-secondary'/>
                                <Sun size={15} className='text-secondary'/>
                                
                            </div>
                        </div>
                        
                        {!user 
                            ? (<div onClick={login} className={`desktop-nav-element-wrapper ${currentPath === "/login" ? `bg-accent hover:!bg-accent` : ""}`}>
                                    <User className={`desktop-nav-element`}/>
                                    <p className={`hidden ${!navOpen ? 'md:hidden' : 'md:block'}`} >Log In / Sign Up</p>
                                </div>) 

                            : (
                                <div className='flex flex-row items-center relative'>
                                    <div 
                                        onClick={() => {
                                            if(window.innerWidth >= 768){ //Open/close both nav and search when window is md
                                                handleSearch();
                                                handleNav();
                                            }else{
                                                handleProfileOpen()
                                            }
                                        }}
                                        className={`desktop-nav-element-wrapper w-full ${currentPath === "/login" ? `bg-accent hover:!bg-accent` : ""}`}
                                    >

                                        <User className={`desktop-nav-element`}/>
                                        <p className={`hidden ${!navOpen ? 'md:hidden' : 'md:block'}`} >{user.username}</p>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            logout();
                                            navigate('/')
                                            
                                        }}
                                        className={`hidden ${!navOpen ? 'md:hidden' : 'md:block'} ml-auto border-2 px-2 w-[40%] h-fit rounded-[5px] cursor-pointer
                                                    hover:bg-accent`}
                                        >Log out
                                    </button>

                                    {/* // Mobile Logout */}
                                    <button 
                                        onClick={user ? logout : navigate('/login')}
                                        className={`absolute right-[55px] w-[150px] h-[40px] bg-secondary border-2 border-primary rounded-2xl
                                                        ${windowWidth >= 768 ? 'hidden' : 'block'}
                    
                                                        transition-all duration-300 ease-in
                                                        ${!profileOpen ? 'w-0 opacity-0' : 'translate-x-0' }
                                                        hover:bg-accent cursor-pointer`}
                                        >{user ? 'Log Out' : ''}
                                    </button>
                                </div>  
                            )
                        }



                        
                    </div>
            </div>
        </>
    );
}

export default Navbar;