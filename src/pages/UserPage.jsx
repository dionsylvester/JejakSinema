import React, { useState, useEffect } from "react";
import ProfileHeader from "../components/UserPage/ProfileHeader";
import FavoriteMovies from "../components/UserPage/FavoriteMovies";
import ReviewedMovies from "../components/UserPage/ReviewedMovies";
import ButtonToHome from "../components/UserPage/ButtonToHome";
import axios from "axios";
import "./UserPage.css";
import { useNavigate } from "react-router-dom";
import photopic from "../assets/profilepicture.png";

const UserPage = () => {
    const navigate = useNavigate();

    const [userData, setUserData] = useState({});
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const [userReviews, setUserReviews] = useState([]);

    useEffect(() => {
        const userId = 2; // Ganti ID nanti

        axios.get(`http://localhost:3001/api/user/${userId}`)
            .then((response) => setUserData(response.data))
            .catch((error) => console.error("Error fetching user data:", error));

        axios.get(`http://localhost:3001/api/user/${userId}/favorites`)
            .then((response) => setFavoriteMovies(response.data))
            .catch((error) => console.error("Error fetching favorite movies:", error));

        axios.get(`http://localhost:3001/api/user/${userId}/reviews`)
            .then((response) => setUserReviews(response.data))
            .catch((error) => console.error("Error fetching user reviews:", error));
    }, []);

    const handleViewReview = (review) => {
        alert(`User Review:\n${review.ulasan}`);
    };

    return (
        <div className="user-profile">
            <ProfileHeader username={userData.username || "Loading..."} photo={userData.profilepicture || {photopic}} />

            <hr className="section-divider" />
            <FavoriteMovies movies={favoriteMovies} />

            <hr className="section-divider" />
            <ReviewedMovies reviews={userReviews} onClickReview={handleViewReview} />

            <button className="log-button" onClick={() => navigate("/add-review")}>+LOG</button>

            <ButtonToHome />
        </div>
    );
};

export default UserPage;
