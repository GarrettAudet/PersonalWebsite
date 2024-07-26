import React, { useState } from 'react';
import './Section-Content.css';

function SectionContent({ title, description, LogoComponent }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <a
        href="https://www.google.com"
        className="section-link"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`logo ${isHovered ? 'hovered' : ''}`}>
                <LogoComponent className="svg-logo" />
            </div>
            <div>
                <h3 className="experienceTitle">{title}</h3>
                <p className="experienceDescription">{description}</p>
            </div>
        </a>
    );
}

export default SectionContent;
