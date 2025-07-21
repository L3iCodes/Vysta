import { useEffect, useState } from "react";
import Card from "../components/Card";
import placeholder from "../components/superman-poster-img.jpg"
import { useLocation, useParams } from "react-router-dom";
import PageNavigation from "../components/PageNavigation";

function CatalogPage({getGenreHeader = false}){
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || `http://localhost:5000`;

    const location = useLocation();
    const url = location.pathname;
    const { id, page, query } = useParams()
    const [maxPage, setMaxPage] = useState(null)
    const [movieList, setMovieList] = useState([])
    const [genreList, setGenreList] = useState([])
    const [loading, setLoading] = useState(true);


    useEffect(()=> {
        fetch(`${BACKEND_URL}/genre-list`)
        .then(res => res.json())
        .then(data => {
            setGenreList(data)
        })
        .catch(err => console.log(err))
    }, [])

    useEffect(() => {
    setLoading(true); // Start loading
    fetch(`${BACKEND_URL}${url}`)
        .then(res => res.json())
        .then(data => {
            setMovieList(data.results);
            setMaxPage(data.total_pages);
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false)); // Stop loading after fetch
}, [id, page, query]);

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
                    {getGenreHeader ? genreList[id] : `Search: '${query}' `}
                </h1>

                {loading ? (
                    <div className="flex flex-wrap gap-5 justify-evenly">
                        {placeholder}
                    </div>
                ) : movieList && movieList.length > 0 ? (
                    <>
                        <PageNavigation page={page} url={url} maxPage={maxPage} />

                        <div className="flex flex-wrap gap-5 justify-evenly">
                            {movieList.map((element) => (
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

                        <PageNavigation page={page} url={url} maxPage={maxPage} />
                    </>
                ) : (
                    <div className="flex items-center justify-center w-full h-full">
                        <h1>No result found</h1>
                    </div>
                )}
            </div>

        </>
    )
}

export default CatalogPage;