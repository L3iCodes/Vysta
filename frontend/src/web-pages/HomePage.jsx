import Hero from "../components/Hero";
import { MovieCarousel } from "../components/Carousel";
import { useEffect, useState } from "react";

function HomePage(){
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || `http://localhost:5000`;

    const [heroList, setHeroList] = useState([])
    const [currentHero, setCurrentHero] = useState(0)
    const [heroLoading, setHeroLoading] = useState(true)
    const [genreList, setGenreList] = useState([])

    //Fetch trending movies for hero component
    useEffect(()=> {
        fetch(`${BACKEND_URL}/movies/trending`)
        .then(res => res.json())
        .then(data => {
            setHeroList(data.results)
            setHeroLoading(false)
        })
        .catch(err => console.log(err))
    }, [])

    // Set an interval for the hero component
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentHero(prev => (prev + 1) % heroList.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [heroList])

    // Fetch genre list
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
                <div className="flex flex-col w-full gap-2
                                md:flex-row md:h-[60%]
                                lg:h-[80%]">
                    {heroLoading || !genreList
                        ?   <Hero className={`h-[300px] animate-pulse`}/>
                        :   <Hero 
                                title={heroList[currentHero].original_title}
                                rating={heroList[currentHero].vote_average}
                                genres={
                                    heroList[currentHero].genre_ids
                                    .map(element => genreList[element])
                                    .join(' | ')
                                }
                                duration={heroList[currentHero].release_date}
                                img={`https://image.tmdb.org/t/p/original/${heroList[currentHero].backdrop_path}`}
                            />
                    }
                   
                </div>

                <MovieCarousel 
                    url={`${BACKEND_URL}/movies/trending`} 
                    title={'Trending'} 
                    isBackdrop={true} 
                    cardClass={'w-[200px] h-fit'}
                    dataKey={'results'}
                    insideText={true}
                    redirect={true}/>
                
                <MovieCarousel 
                    url={`${BACKEND_URL}/movies/top_rated`} 
                    title={'Top Rated'} 
                    isBackdrop={false} 
                    cardClass={'w-[150px] h-fit'}
                    dataKey={'results'}
                    insideText={false}
                    redirect={true}/>
                
                <MovieCarousel 
                    url={`${BACKEND_URL}/movies/upcoming`} 
                    title={'Upcoming'} 
                    isBackdrop={false} 
                    cardClass={'w-[150px] h-fit'}
                    dataKey={'results'}
                    insideText={false}
                    redirect={true}/>

            </div>

            
            
        </>
    )
}

export default HomePage;