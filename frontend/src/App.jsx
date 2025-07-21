import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Navbar from "./components/Navbar"
import HomePage from "./web-pages/HomePage"
import BrowsePage from './web-pages/BrowsePage'
import MoviePage from './web-pages/MoviePage'
import Header from "./components/Header"
import CatalogPage from './web-pages/CatalogPage'
import LoginPage from './web-pages/LoginPage'
import SignUpPage from './web-pages/SignUpPage'
import WatchlistPage from './web-pages/WatchlistPage'
import PrivateRoute from './components/PrivateRoute'




function App() {
  return (
    <>
    <Router>
      <div className="wrapper">
        {/* <Header /> */}
        <Navbar />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/browse' element={<BrowsePage />} />
          <Route path='/movie/:id' element={<MoviePage />} />
          <Route path='/movie/genre/:id/page/:page' element={<CatalogPage getGenreHeader={true} />} />
          <Route path='/movie/search/:query/page/:page' element={<CatalogPage getGenreHeader={false} />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignUpPage />} />
          <Route path='/watchlist' element={<PrivateRoute><WatchlistPage /></PrivateRoute>}/>
        </Routes>
      </div>
    </Router>
      
      
    </>
  )
}

export default App
