import { SquareArrowRight, SquareArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

function PageNavigation({page, url, maxPage}){
    const navigate = useNavigate()

    const newURL = (() => url.split('/').slice(0, -1).join('/'))();
    console.log(newURL)

    const goToNextPage = () => navigate(`${newURL}/${Number(page) + 1}`);
    const goToPrevPage = () => {
        if (Number(page) > 1) {
            navigate(`${newURL}/${Number(page) - 1}`);
        }
    };

    return(
        <>
            <div className="flex gap-2 items-center justify-center">
                <button
                    onClick={goToPrevPage}
                    className={`px-3 py-1 border rounded cursor-pointer hover:bg-accent`}
                    >Prev
                    
                </button>
                
                {Array.from({ length: Math.min(3, maxPage - Number(page) + 1) }, (_, index) => {
                    const pageNum = Number(page) + index;
                    return (
                        <button
                            key={pageNum}
                            onClick={() => navigate(`${newURL}/${pageNum}`)}
                            className={`px-3 py-1 border rounded ${
                                pageNum === Number(page)
                                    ? 'bg-secondary border-primary text-primary'
                                    : 'bg-primary text-secondary hover:bg-accent cursor-pointer'
                            }`}
                        >
                            {pageNum}
                        </button>
                    );
                })}

                <button
                    onClick={goToNextPage}
                    className={`px-3 py-1 border rounded cursor-pointer hover:bg-accent`}
                    >Next
                    
                </button>
            </div>
        </>
    )
}

export default PageNavigation;