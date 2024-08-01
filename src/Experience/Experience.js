import React, { useState, useEffect } from 'react';
import ExperienceSection from '../ExperienceSection/ExperienceSection';
import ContactSection from '../Contact-Section/ContactSection';
import './Experience.css';

function Experience({ experienceRef, contactRef }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 2000); 

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`experience-container ${isVisible ? 'visible' : ''}`}>
            <div ref={experienceRef}>
                <ExperienceSection number="01." text="Experience"/>
            </div>
            <div ref={contactRef}>
                <ContactSection number="02." text="Contact"/>
            </div>
        </div>
    );
}

export default Experience;
