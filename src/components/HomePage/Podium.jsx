import React, { useState, useEffect } from "react";
import "./Podium.css";
import axios from "axios";

const Podium = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3001/api/movies-of-the-month")
            .then((response) => {
                setMovies(response.data);
            })
            .catch((error) => {
                console.error("Error fetching movies of the month:", error);
            });
    }, []);

    const podiumOrder = movies.length === 3 ? [movies[1], movies[0], movies[2]] : [];

    return (
        <div className="podium-container">
            {podiumOrder.length === 3 ? (
                <>
                    <div className="movies-row">
                        {podiumOrder.map((movie, index) => (
                            <div key={movie.filmId} className={`podium-item podium-item-${index + 1}`}>
                                <img src={movie.poster} alt={movie.judul} className="podium-poster" />
                                <p className="podium-title">{movie.judul}</p>
                                <p className="podium-reviews">{movie.filmreview} reviews</p>
                            </div>
                        ))}
                    </div>
                    <div className="podium-base">
                        <div className="podium-level level-2">2</div>
                        <div className="podium-level level-1">1</div>
                        <div className="podium-level level-3">3</div>
                    </div>
                </>
            ) : (
                <p>Loading movies...</p>
            )}
        </div>
    );
};

export default Podium;
