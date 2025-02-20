// File: src/components/FeaturedListings.js
import React, { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"; // Fallback API URL

const FeaturedListings = () => {
    const [listings, setListings] = useState([]); // Store listings

    useEffect(() => {
        fetch(`${API_URL}/properties`)
            .then(response => response.json())
            .then(data => setListings(data)) // Store API data in state
            .catch(error => console.error("Error fetching listings:", error));
    }, []); // Run only once on component mount

    return (
        <section className="featured-listings">
            <h2>Featured Properties</h2>
            <div className="listings">
                {listings.length > 0 ? (
                    listings.map((listing, index) => (
                        <div key={index} className="listing-card">
                            <img src={listing.image || "/assets/images/default.jpg"} alt={listing.title} />
                            <h3>{listing.title}</h3>
                            <p>KES {listing.price} per night</p>
                        </div>
                    ))
                ) : (
                    <p>Loading properties...</p>
                )}
            </div>
        </section>
    );
};

export default FeaturedListings;
