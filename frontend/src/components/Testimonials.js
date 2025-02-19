// File: src/components/Testimonials.js
import React from 'react';

const Testimonials = () => {
    return (
        <section className="testimonials">
            <h2>What Our Users Say</h2>
            <div className="review">
                <p>"Kwanyumba made booking my holiday so easy! The M-Pesa integration was smooth."</p>
                <h4>- Jane, Nairobi</h4>
            </div>
            <div className="review">
                <p>"Loved how seamless everything was. Got my check-in details instantly!"</p>
                <h4>- Brian, Kisumu</h4>
            </div>
        </section>
    );
};

export default Testimonials;
