import { useEffect, useState } from "react";
import { MovieCarousel } from "../components/Carousel";

function BrowsePage(){
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || `http://localhost:5000`;
    console.log(BACKEND_URL)
    const [genreList, setGenreList] = useState([])

    useEffect(()=> {
        fetch(`${BACKEND_URL}/genre-list`)
        .then(res => res.json())
        .then(data => {
            setGenreList(data)
        })
        .catch(err => console.log(err))
    }, [])

    return(

        <>
            <div className="pageWrapper hide-scrollbar">
                <h1 className="font-bold text-2xl md:text-3xl bg-secondary p-5 text-primary rounded-b-2xl sticky top-0 z-20">Browse Movies</h1>
                
                {Object.entries(genreList).map(([id, name]) => (
                    <MovieCarousel 
                        key={id}
                        url={`${BACKEND_URL}/movie/genre/${id}/page/1`} 
                        title={name} 
                        isBackdrop={false} 
                        cardClass={'w-[150px] h-[300px]'}
                        dataKey={'results'}
                        insideText={false}
                        redirect={true}
                        genre_redirect={true}
                        genreID={id}
                        page={1}/>
                             
                ))}
            </div>
        </>
    )
}

export default BrowsePage;