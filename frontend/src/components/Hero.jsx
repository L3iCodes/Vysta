import { Star, Clock } from 'lucide-react';
import placeholder from './superman-img.jpg'
import Button from './Buttons';

function Hero({ className, title, genres, rating, duration, img, overview, id}){
    return(
        <>
            <div className={`${className} w-full rounded-[15px] bg-black relative`}>
                <img src={img} className='object-cover h-full w-full rounded-[15px] z-0'></img>
                
                {/* Overlay */}
                <div className='absolute top-0 rounded-[15px] left-0 h-full w-full bg-gradient-to-tr from-secondary/100'/>
                <div className='absolute bottom-0 rounded-[15px] left-0 h-full w-full bg-gradient-to-tr from-secondary/20'/>

                <div className='flex p-5 absolute top-0 left-0 w-full h-full'>

                    {/* Movie Title and Genre */}
                    <div className='flex flex-col justify-end text-primary sm:w-[90%] xl:w-[60%]'>
                        <h1 className='font-bold text-2xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-7xl'>{title}</h1>
                        <p className='text-1xl lg:text-2xl mt-1'>{genres}</p>

                        {/* Movie Ratings */}
                        <div className={`flex gap-[20px] mt-3 md:mt-5 lg:mt-8`}>
                            <div className={`${!rating ? 'hidden' : ''} flex justify-center items-center gap-2 w-fit  text-primary`}>
                                <Star className='w-[20px] h-[20px] fill-primary'/> 
                                <p className='text-1xl '>{rating}</p>
                            </div>

                            {/* Movie Duration */}
                            <div className={`${!duration ? 'hidden' : ''} flex justify-center items-center gap-2 w-fit text-primary`}>
                                <Clock className='w-[20px] h-[20px]'/> 
                                <p className='text-1xl '>{duration}</p>
                            </div>
                        </div>

                        <p className='text-[12px] mt-3 md:text-[12px] lg:text-[1rem] md:mt-5 lg:mt-8'>{overview}</p>

                        {id && <Button className={`sm:mt-5`} text={'Add to Watchlist'} id={id} />}
                    </div>
                    
                </div>
            </div>
        </>
    )
}

export default Hero;