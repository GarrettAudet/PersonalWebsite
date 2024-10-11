import React from 'react';
import './Content.css'

import HeroMessage from '../HeroSection/hero-message'
import Experience from '../Experience/Experience'
import Cursor from '../Cursor/Cursor'

function Content ({ experienceRef, contactRef }) {
    return (
        <div className="main-content">
        <HeroMessage />
        <Experience experienceRef = {experienceRef} contactRef = {contactRef} />
        <Cursor />
        </div>
    );
}

export default Content