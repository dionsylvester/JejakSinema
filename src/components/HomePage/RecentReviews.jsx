import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RecentReviews.css";

const RecentReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [curIndex, setCurIndex] = useState(0);
    const itemsPerPage = 4;

    useEffect(() => {
        axios.get("http://localhost:3001/api/recent-reviews")
            .then((response) => {
                setReviews(response.data);
            })
            .catch((error) => {
                console.error("Error fetching recent reviews:", error);
            });
    }, []);

    const uniqueReviews = reviews.filter(
        (review, index, self) =>
            index === self.findIndex((r) => r.filmId === review.filmId)
    );

    const totalMovies = uniqueReviews.length;

    const handleNext = () => {
        if (curIndex + itemsPerPage < totalMovies) {
            setCurIndex(curIndex + itemsPerPage);
        }
    };

    const handleBack = () => {
        if (curIndex - itemsPerPage >= 0) {
            setCurIndex(curIndex - itemsPerPage);
        }
    };

    const visibleReviews = uniqueReviews.slice(curIndex, curIndex + itemsPerPage);

    return (
        <div className="recent-reviews">
            {curIndex > 0 && (
                <button className="pagination-arrow back-arrow" onClick={handleBack}>
                    &#8592;
                </button>
            )}
            <div className="reviews-container">
                {visibleReviews.map((review) => (
                    <div key={review.reviewId} className="review-item">
                        <img src={review.poster} alt={review.judul} className="review-poster" />
                        <div className="review-details">
                            <h4>{review.judul}</h4>
                            <p>"{review.ulasan}"</p>
                            <p className="review-user">by {review.username}</p>
                            <div className="review-meta">
                                <span>Rating: {review.rating} ⭐</span>
                                <span>Likes: {review.like}</span>
                                <span>Dislikes: {review.dislike}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {curIndex + itemsPerPage < totalMovies && (
                <button className="pagination-arrow next-arrow" onClick={handleNext}>
                    &#8594;
                </button>
            )}
        </div>
    );
};

export default RecentReviews;
