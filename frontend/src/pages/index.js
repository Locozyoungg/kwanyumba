// File: src/pages/index.js
import React from 'react';
import HeroSection from '../components/HeroSection';
import HowItWorks from '../components/HowItWorks';
import FeaturedListings from '../components/FeaturedListings';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import ReactDOM from "react-dom";
import App from "./App";
import "./styles/landing.css"; 

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);


const HomePage = () => {
    return (
        <div>
            <HeroSection />
            <HowItWorks />
            <FeaturedListings />
            <Testimonials />
            <Footer />
        </div>
    );
};

export default HomePage;
