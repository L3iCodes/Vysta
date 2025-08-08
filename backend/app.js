import express, { response } from 'express'
import cors from 'cors'
import mongoose from 'mongoose';
import User from './models/user.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
import fetch from 'node-fetch';

const PORT = process.env.PORT || 5000
const app = express();
app.listen(PORT, ()=>{
    console.log(`Server is running at Localhost:${[PORT]}`)
})

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(cors({
    origin: CLIENT_ORIGIN,
    credentials: true
}));

// TMDB API CALLS
const TMDB_AUTH = process.env.TMDB_AUTH
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TMDB_AUTH}`
    }
};

// Fetch Movie List [Trending, Upcoming, Latest]
app.get('/movies/:type', async (req, res) => {
    const movieType = req.params.type;
    const url_upcoming = `https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1`;
    const url_trending = 'https://api.themoviedb.org/3/trending/movie/day?language=en-US';
    const url_latest = 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1';

    const url =
        movieType === 'trending' ? url_trending :
        movieType === 'upcoming' ? url_upcoming : 
        movieType === 'top_rated' ? url_latest : '';

    try{
        const response = await (fetch(url, options));

        if(!response.ok){ 
            throw new Error(`TMDB error: ${response.status}`)
        }

        const data = await response.json();
        res.json(data)

    }catch(error){
        console.log(error)
    }
})

// Fetch genre list
app.get('/genre-list', async (req, res) => {
    const url = 'https://api.themoviedb.org/3/genre/movie/list?language=en';
    
    try{
        const response = await (fetch(url, options));

        if(!response.ok){ 
            throw new Error(`TMDB error: ${response.status}`)
        }

        const data = await response.json();
        
        const genreDict = data.genres.reduce((acc, genre) => {
            acc[genre.id] = genre.name
            return acc
        },{})

        res.json(genreDict)

    }catch(error){
        console.log(error)
    }
})

// Fetch specific movie by their ID
app.get('/movie/:id', async (req, res) => {
    const movieId = req.params.id;

    const url = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`

    try{
        const response = await (fetch(url, options));
        
         if(!response.ok){ 
            throw new Error(`TMDB error: ${response.status}`)
        }

        const data = await response.json();
        res.json(data)

    }catch(error){
        console.log(error)
    }
})

//Fetch movie similar movies
app.get('/movie/similar/:id', async (req, res) => {
    const movieId = req.params.id
    const url = `https://api.themoviedb.org/3/movie/${movieId}/similar?language=en-US&page=1`

    try{
        const response = await (fetch(url, options));

        if (!response.ok){
            throw new Error(`TMDB error: ${response.status}`)
        }

        const data = await response.json();
        res.json(data)
    }catch(error){
        console.log(error)
    }
})


//Fetch movie actors
app.get('/actor/:id', async (req, res) => {
    const movieId = req.params.id
    const url = `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`

    try{
        const response = await (fetch(url, options));

        if (!response.ok){
            throw new Error(`TMDB error: ${response.status}`)
        }

        const data = await response.json();
        res.json(data)
    }catch(error){
        console.log(error)
    }
})

// Fetch movie by genre
app.get('/movie/genre/:id/page/:page', async (req, res) => {
    const genreId = req.params.id;
    const genrePage = req.params.page
    const url = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&page=${genrePage}`

    try{
        const response = await (fetch(url, options));

        if(!response.ok){
            throw new Error(`TMDB error: ${response.status}`)
        }

        const data = await response.json();
        res.json(data)

    }catch(error){
        console.log(error)
    }
})

// Fetch movie by query (search)
app.get(`/movie/search/:query/page/:page`, async (req, res) => {
    const query = req.params.query;
    const page = req.params.page;
    const url = `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${page}`

    try{
        const response = await (fetch(url, options))

        if(!response.ok){
            throw new Error(`TMDB error: ${response.status}`)
        }

        const data = await response.json()
        res.json(data)

    }catch(error){
        console.log(error)
    }
})


// MongoDB Database Connection
const MONGO_URL = process.env.MONGO_URL
mongoose.connect(MONGO_URL)
    .then(() => {
        console.log('Connected to DB')
    })
    .catch(err => console.log("Can't connect to DB"))

// MongoDB API CALLS
app.use(express.json());

// Signup -> add user to db
app.post(`/signup`, async (req, res) => {
    const {username, email, password} = req.body;
    
    try{
        const existingUser = await User.findOne({
            $or: [{username}, {email}],
        })

        if (existingUser){
            return res.status(400).json({success:false, message: "Username or Email already exists"});
        }else{
            const salt = 10;
            const hashedPassword = await bcrypt.hash(password, salt)

            const newUser = new User({
                username, 
                email, 
                password: hashedPassword});

            await newUser.save();
            return res.status(201).json({success: true, message: "User Created Succesfully"})
        }
    }catch(error){
        console.log(`Failed to add user: ${username} - ${email}`)
    }
})


// Login -> verify and authenticate user
const SECRET_KEY = process.env.JWT_SECRET;

app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    
    try{
        const user = await User.find({
             $or: [
                {username: username},
                {email: username}
            ]
        })

        if(user.length === 0){
            console.log("User does not exist")
            res.json({success: false, message: "User does not exists"});
        }else{
            const isMatch = await bcrypt.compare(password, user[0].password);

            if(isMatch){
                const token = jwt.sign({username: user[0].username}, SECRET_KEY, {expiresIn: '1h'});
                res.json({token: token, success: true, data:{  username: user[0].username, 
                                                                watch_list: user[0].watch_list, 
                                                                watched_list: user[0].watched_list
                                                            }
                })
            }else{
                console.log("Incorrect Password")
                res.json({success: false, message: "Incorrect Username and Password"})
            }
        }

    }catch(err){
        console.log(err)
    }

})

// Update watch list
app.post('/movie/watchlist/:id', (req,res) => {
    const {data} = req.body;
    
    User.findOneAndUpdate(
            {username: data.username},
            {watch_list: data.watch_list},
            {new: true}
        )
        .then(user => {
            user.watch_list = data.watch_list;

            res.status(200).json( {success: true, data: {username: user.username, 
                                                    watch_list: user.watch_list, 
                                                    watched_list: user.watched_list}})
        })
})
