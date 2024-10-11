import React, { useState } from 'react';
import './Section-Content.css';

function SectionContent({ title, description, LogoComponent, svgColor, Link }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <a
            href={Link}
            className="section-link"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="logo">
                <LogoComponent 
                    className="svg-logo" 
                    style={{ 
                        color: isHovered ? svgColor : 'rgba(255, 255, 255, 0.5)', 
                        opacity: isHovered ? 1 : 1
                    }} 
                />
            </div>
            <div className="sectionContent">
                <h3 className="experienceTitle">{title}</h3>
                <p className="experienceDescription">{description}</p>
            </div>
        </a>
    );
}

export default SectionContent;



