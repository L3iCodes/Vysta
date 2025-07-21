import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react'
import { useRef, useEffect, useState } from "react";
import Card from './Card';
import { useNavigate } from 'react-router-dom';

export function HorizontalCarousel({ className, title, children, genre_redirect=false, genre_id, page}){
    const navigate = useNavigate()
    const redirect = () => navigate(`/movie/genre/${genre_id}/page/${page}`)
    
    
    const scrollRef = useRef(null);
    const scrollAmount = 200;

    const handleNext = () => {
        if(scrollRef.current){
            scrollRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handlePrev = () => {
        if(scrollRef.current){
            scrollRef.current.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Move carousel using the wheel feature
    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        container.addEventListener("wheel", handleScroll, { passive: false });

        return () => {
        container.removeEventListener("wheel", handleScroll);
        };
    }, []);
    
        
    const handleScroll = (e) => {
        e.preventDefault();
        scrollRef.current.scrollBy({
        left: e.deltaY,
        behavior: "smooth",
        });
    };

    return(
        <>
            <div className={`${className} w-full relative z-0`}>
                <p  onClick={genre_redirect ? redirect : ()=>{}} 
                    className={`font-bold md:text-2xl
                                ${genre_redirect ? 'hover:text-accent cursor-pointer' : ''}`}>{title}
                </p>

                <div className='relative'>
                    <div className="flex gap-4 h-full overflow-hidden relative" ref={scrollRef}>
                        {children}

                    </div>

                    <ArrowLeft 
                        onClick={handlePrev} 
                        className='flex w-[30px] h-[30px] p-1 absolute top-1/2 left-0 transform -translate-y-1/2 text-primary rounded-full bg-accent cursor-pointer'/>
                    <ArrowRight 
                        onClick={handleNext} 
                        className='flex w-[30px] h-[30px] p-1 absolute top-1/2 right-0 transform -translate-y-1/2 text-primary rounded-full bg-accent cursor-pointer'/>    
                </div>
                
                
            </div>

        </>
    )
}

export function VerticalCarousel({ className, title, children, genre_redirect }){
    const scrollRef = useRef(null);
    const scrollAmount = 200;

    const handleNext = () => {
        if(scrollRef.current){
            scrollRef.current.scrollBy({
                top: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handlePrev = () => {
        if(scrollRef.current){
            scrollRef.current.scrollBy({
                top: -scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return(
        <>
            <div className={`${className} h-full shrink-0 relative`}>
                <p>{title}</p>
                <div className="flex flex-col justify-evenly gap-2 h-full overflow-hidden" ref={scrollRef}>
                    {children}
                </div>

                <ArrowDown 
                    onClick={handleNext} 
                    className='flex w-[30px] h-[30px] p-1 absolute bottom-0 left-1/2 transform -translate-x-1/2 text-primary rounded-full bg-accent cursor-pointer'/>
                <ArrowUp 
                    onClick={handlePrev} 
                    className='flex w-[30px] h-[30px] p-1 absolute top-0 left-1/2 transform -translate-x-1/2 text-primary rounded-full bg-accent cursor-pointer'/>

            </div>

            
        </>
    )
}

export function MovieCarousel ({ url, title, dataKey, className, insideText, isBackdrop = false, cardClass, redirect, genre_redirect, genreID, page }){
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true)
    
    const placeholder = Array.from({ length: 15 }).map((_, index) => (
        <Card
            key={`placeholder-${index}`}
            className={`${cardClass} ${isBackdrop ? '!h-[100px]' : '!h-[250px]' } animate-pulse border-2 border-accent bg-accent`}
        />
    ))

    useEffect(() => {
        fetch(url)
            .then(res => res.json())
            .then(data => {
                setData(data[dataKey] || [])
                setLoading(false)
            });
    }, [url]);

    
    return (
        <HorizontalCarousel className={className} title={title} genre_redirect={genre_redirect} genre_id={genreID} page={page}>
            {loading 
                ? placeholder 
                : dataKey == 'results' ? data.map((element) => (
                    <Card
                        key={element.id}
                        id={element.id}
                        className={cardClass}
                        main_text={element.original_title}
                        sub_text={element.release_date?.split('-')[0] || 'Unknown'}
                        img={(element.backdrop_path && element.poster_path)
                                ? `https://image.tmdb.org/t/p/original/${isBackdrop ? element.backdrop_path : element.poster_path}`
                                : ''
                        }
                        insideText={insideText}
                        redirect={redirect}
                        useBackDrop={isBackdrop}
                    />
                    ))
                :   data.map((element) => (
                        <Card 
                            key={element.id}
                            id={element.id}
                            img={element.profile_path 
                                ? `https://image.tmdb.org/t/p/w500/${element.profile_path}` 
                                : ''}
                            main_text={element.original_name}
                            sub_text={element.character}
                            className={cardClass}
                            insideText={insideText}
                            useBackDrop={isBackdrop}
                        />))
                
            }
        </HorizontalCarousel>
    );
};


export default VerticalCarousel;