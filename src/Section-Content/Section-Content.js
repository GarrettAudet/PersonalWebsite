import React from 'react';
import './Section-Content.css';

function SectionContent({ title, description, LogoComponent }) {
    return (
        <a href="https://www.google.com" className="section-link">
            <div className="logo">
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
