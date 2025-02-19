// File: src/components/HeroSection.js
import React from 'react';
import '../styles/landing.css';

const HeroSection = () => {
    return (
        <section className="hero">
            <div className="hero-content">
                <h1>Find Your Perfect Stay with Kwanyumba</h1>
                <p>Book your next stay with M-Pesa payments in just a few clicks.</p>
                <input type="text" placeholder="Search for rentals..." className="search-bar"/>
                <button className="search-btn">Search</button>
            </div>
        </section>
    );
};

export default HeroSection;
