import React from 'react';
import './Titlecard.css'

function Titlecard () {
    return (
        <a href = "about">
            <div className = "header-container">
                <h2>
                    <span>I'm a full-stack businessman interested in the </span>
                    <span><span>applications of technology</span> in business.</span>
                </h2>
            </div>
        </a>
    );
}

export default Titlecard