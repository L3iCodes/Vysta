import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import placeholder from "../components/superman-img.jpg"
import { useParams } from "react-router-dom";
import { Star, Clock } from 'lucide-react';
import { MovieCarousel } from "../components/Carousel";

function MoviePage(){
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || `http://localhost:5000`;

    const { id } = useParams();
    const [movieInfo, setMovieInfo] = useState(null);
    const [actors, setActor] = useState('')

    useEffect(() => {
        fetch(`${BACKEND_URL}/movie/${id}`)
        .then(res => res.json())
        .then(data => setMovieInfo(data))
        .catch(error => console.log(error))
    }, [id])


    useEffect(() => {
        fetch(`${BACKEND_URL}/actor/${id}`)
        .then(res => res.json())
        .then(data => setActor(data))
        .catch(error => console.log(error))
    }, [id])

    return(
        <>
            <div className="pageWrapper hide-scrollbar">
                {movieInfo && (
                    <>
                        {/* Desktop Hero */}
                        <Hero
                            key={movieInfo.id}
                            id={movieInfo.id}
                            title={movieInfo.original_title}
                            rating={movieInfo.vote_average}
                            duration={movieInfo.release_date}
                            img={`https://image.tmdb.org/t/p/original/${movieInfo.backdrop_path}`}
                            overview={movieInfo.overview}
                            genres={movieInfo.genres.map((element) => element.name).join(' | ')}
                            className="hidden sm:block md:max-h-[60%] lg:max-h-[80%]"
                        />

                        {/* Mobile layout */}
                        <div className="flex flex-col gap-[30px] text-secondary sm:hidden">
                            <Hero
                                id={movieInfo.id}
                                img={`https://image.tmdb.org/t/p/original/${movieInfo.backdrop_path}`}
                            />

                            <div>
                                <h1 className="font-bold text-3xl">{movieInfo.original_title}</h1>
                                <p className="text-1xl lg:text-2xl mt-1 truncate">
                                    {movieInfo.genres.map((element) => element.name).join(' | ')}
                                </p>

                                <div className="flex gap-[20px] mt-3 md:mt-5 lg:mt-8">
                                    <div className="flex justify-center items-center gap-2 w-fit">
                                        <Star className="w-[20px] h-[20px] fill-secondary" />
                                        <p className="text-1xl">{movieInfo.vote_average}</p>
                                    </div>

                                    <div className="flex justify-center items-center gap-2 w-fit">
                                        <Clock className="w-[20px] h-[20px]" />
                                        <p className="text-1xl">{movieInfo.release_date}</p>
                                    </div>
                                </div>

                                <p className="text-[12px] mt-3 md:text-[1rem] md:mt-5 lg:mt-8">
                                    {movieInfo.overview}
                                </p>
                            </div>
                        </div>
                    </>
                )}


                <MovieCarousel 
                    url={`${BACKEND_URL}/actor/${id}`} 
                    title={'Cast'} 
                    isBackdrop={false} 
                    cardClass={'w-[100px] h-fit sm:w-[150px]'}
                    dataKey={'cast'}
                    redirect={false}/>

                <MovieCarousel 
                    url={`${BACKEND_URL}/movie/similar/${id}`} 
                    className={'mt-5'}
                    title={'Similar'} 
                    isBackdrop={true} 
                    cardClass={'w-[250px] h-fit lg:w-[250px] lg:w-[200px]'}
                    dataKey={'results'}
                    insideText={true}
                    redirect={true}/>
            </div>
                
        </>
    )
}

export default MoviePage;