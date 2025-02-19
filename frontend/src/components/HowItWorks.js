// File: src/components/HowItWorks.js
import React from 'react';

const HowItWorks = () => {
    return (
        <section className="how-it-works">
            <h2>How It Works</h2>
            <div className="steps">
                <div className="step">
                    <h3>1. Search</h3>
                    <p>Find rentals that suit your needs.</p>
                </div>
                <div className="step">
                    <h3>2. Pay with M-Pesa</h3>
                    <p>Make payments seamlessly via Paybill.</p>
                </div>
                <div className="step">
                    <h3>3. Enjoy Your Stay</h3>
                    <p>Get booking confirmation and check-in details.</p>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
