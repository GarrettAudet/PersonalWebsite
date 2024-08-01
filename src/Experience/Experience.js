import React, { useState, useEffect } from 'react';
import ExperienceSection from '../ExperienceSection/ExperienceSection';
import ContactSection from '../Contact-Section/ContactSection';
import './Experience.css';

function Experience() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 3000); // 2000ms = 2 seconds delay

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`experience-container ${isVisible ? 'visible' : ''}`}>
            <ExperienceSection number="01." text="Experience"/>
            <ContactSection number="02." text="Contact"/>
        </div>
    );
}

export default Experience;
