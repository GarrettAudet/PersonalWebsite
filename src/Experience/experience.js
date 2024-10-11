import React from 'react';
import './experience.css'

import HeroMessage from './hero-message'
import Experience from './experience-container'
import Cursor from '../General/cursor'

function ExperiencePage ({ experienceRef, contactRef }) {
    return (
        <div className="main-content">
            <HeroMessage />
            <Experience experienceRef = {experienceRef} contactRef = {contactRef} />
            <Cursor />
        </div>
    );
}

export default ExperiencePage