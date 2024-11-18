import React, { useState, useEffect } from "react";
import "./TopRatedMovies.css";
import axios from "axios";

const TopRatedMovies = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3001/api/top-rated-movies")
            .then((response) => {
                setMovies(response.data);
            })
            .catch((error) => {
                console.error("Error fetching top-rated movies:", error);
            });
    }, []);

    return (
        <div className="top-rated-movies">
            <div className="top-rated-container">
                {movies.map((movie) => (
                    <div key={movie.filmId} className="top-rated-item">
                        <img src={movie.poster} alt={movie.judul} className="top-rated-poster" />
                        <p className="top-rated-title">{movie.judul}</p>
                        <p className="top-rated-rating">Rating: {movie.filmrating} ⭐</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopRatedMovies;
