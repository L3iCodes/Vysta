import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";
import Card from "../components/Card";

function WatchlistPage(){
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || `http://localhost:5000`;

    const {user} = useAuth();
    const [movieList, setMovieList] = useState([])

    console.log(user)


    useEffect(() => {
        if(!user){
            console.log("No Movie Found")
            return;
        }else{
            const getWatchList = async () => {
                try {
                    const movies = await Promise.all(
                        user.watch_list.map(async (id) => {
                            console.log(id)
                            const response = await fetch(`${BACKEND_URL}/movie/${id}`);
                            console.log(response)
                            if (!response.ok) throw new Error(`Failed to fetch movie ${id}`);
                            return await response.json();
                        })
                    );
                    setMovieList(movies);
                }catch(error){
                    console.error("Error fetching watch list:", error);
                }
            }
            getWatchList();
        }
    }, [user])

    console.log(movieList)

    const placeholder = Array.from({ length: 20 }).map((_, index) => (
            <Card
                key={`placeholder-${index}`}
                className={`!h-[300px] w-[250px] animate-pulse border-2 border-accent bg-accent`}
            />
        ))

    return(
        <>
            <div className="pageWrapper hide-scrollbar">
                <h1 className="font-bold text-2xl md:text-3xl bg-secondary p-5 text-primary rounded-b-2xl sticky top-0 z-20">
                    Your Watch List
                </h1>

                <div className="flex flex-wrap gap-5 justify-start">
                    { !movieList 
                        ? placeholder
                        : movieList.map((element) => (
                            <Card
                                key={element.id}
                                id={element.id}
                                main_text={element.original_title}
                                sub_text={element.release_date?.split('-')[0] || 'Unknown'}
                                isBackdrop={false}
                                className={'w-[calc(25%-1.25rem)] md:w-[calc(20%-1.25rem)] h-fit'}
                                img={
                                    element.backdrop_path && element.poster_path
                                        ? `https://image.tmdb.org/t/p/original/${element.poster_path}`
                                        : ''
                                }
                                redirect={true}
                            />
                        ))}
                </div>
            </div>
        </>
    )
}

export default WatchlistPage;