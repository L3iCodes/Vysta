import { useNavigate } from 'react-router-dom';
import placeholder from './placeholder.svg'



export function Card({ className, insideText, id, main_text, sub_text, img, redirect, useBackDrop }) {

  const navigate = useNavigate()
  const handleRedirect = () => navigate(`/movie/${id}`)

  return (
    <div
      onClick={redirect ? handleRedirect : () => {}}
      className={`${className} flex ${!insideText ? 'flex-col' : ''} shrink-0 rounded-[10px] overflow-hidden relative cursor-pointer
                hover:border-2 border-accent`}>
      
      <div className={`${!insideText ? 'h-[1000%]' : '' } w-full relative`}>
        {/* Overlay */}
        <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-tr from-secondary/50" />

        {/* Image */}
        {img ? (
          <img src={img} alt={main_text} className="w-full h-full object-cover bg-accent" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-accent">
            <img src={placeholder} alt="placeholder" className={`w-full h-full object-cover ${!useBackDrop ? `aspect-[2/3]` : `aspect-[16/9] `} opacity-50`} />
          </div>
        )}

        {/* Inside content (only shows when inside is true) */}
        {insideText && (
          <div className="flex flex-col justify-end w-full h-full absolute left-0 top-0 p-2 text-primary md:p-5">
            <p className="font-semibold text-[15px] md:text-[20px] truncate">{main_text}</p>
            <p className="text-[10px] md:text-[15px]">{sub_text}</p>
          </div>
        )}
      </div>

      {/* Outside content (only shows when inside is false) */}
      {!insideText && (
        <div className={`flex flex-col justify-end w-full h-full text-secondary`}>
          <p className="font-semibold text-[15px] md:text-[15px] truncate">{main_text}</p>
          <p className="text-[10px] md:text-[15px] truncate">{sub_text}</p>
        </div>
      )}
    
    </div>
  );
}

export default Card;