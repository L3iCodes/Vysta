import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

function Button({className, text, action, id}){
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || `http://localhost:5000`;

    const { user, login } = useAuth()
    const navigate = useNavigate();

    const redirect = () => navigate('/login');

    const updateWatchList = async (id) => {
        let newWatchList;

        if (user.watch_list.includes(id)){
            newWatchList = user.watch_list.filter(item => item !== id)
        }else{
            newWatchList = [...user.watch_list, id]
        };

        const updatedData = {
            ...user,
            watch_list: newWatchList
        };

        try{
            const response = await fetch(`${BACKEND_URL}/movie/watchlist/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({data: updatedData})
            });
            
            const result = await response.json();
            login(result.data, user.token);

        }catch(error){
            console.log(error)
        }
    }


    return(
        
        <div 
            onClick={() => {
                !user ? redirect() : updateWatchList(id);
            }}
            className={`${className} flex border-2 border-primary px-3 py-1 w-fit rounded-[10px] cursor-pointer
                        hover:bg-accent`}>
            <p> {!user || !user.watch_list.includes(id) ? "Add to Watchlist" : "Watchlisted"} </p>
        </div>
    )
}

export default Button