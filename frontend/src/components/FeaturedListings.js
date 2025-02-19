// File: src/components/FeaturedListings.js
import React from 'react';

const FeaturedListings = () => {
    return (
        <section className="featured-listings">
            <h2>Featured Properties</h2>
            <div className="listings">
                <div className="listing-card">
                    <img src="/assets/images/house1.jpg" alt="House 1" />
                    <h3>Cozy Apartment in Nairobi</h3>
                    <p>KES 2,500 per night</p>
                </div>
                <div className="listing-card">
                    <img src="/assets/images/house2.jpg" alt="House 2" />
                    <h3>Beach House in Mombasa</h3>
                    <p>KES 5,000 per night</p>
                </div>
            </div>
        </section>
    );
};

export default FeaturedListings;
