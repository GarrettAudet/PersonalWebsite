import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../General/header'

/* Styling */
import './experience.css';

/* Generic Component */
import Cursor from '../General/cursor';

/* Webpage Specific Components */ 
import HeroMessage from './hero-message';
import Experience from './experience-container';

function ExperiencePage () {
    const experienceRef = useRef(null);
    const contactRef = useRef(null);
    const location = useLocation(); // Get location (including hash)

    // Scroll to the contact section when the hash changes or when the page first loads
    useEffect(() => {
        if (location.hash === '#contact' && contactRef.current) {
            contactRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [location]); // Run this effect whenever the location (including hash) changes

    return (
        <div className = "full-main flex">
            <Header style= {{position: 'relative'}}/>
            <div className="main-content">
                <HeroMessage />
                <Experience experienceRef={experienceRef} contactRef={contactRef} />
                <Cursor />
            </div>
        </div>
    );
}

export default ExperiencePage;