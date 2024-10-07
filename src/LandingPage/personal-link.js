import React from 'react';
import './personal-link.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function PersonalLink({ backgroundColor, divIcon, link }) {
    return (
        <a href = {link} target = "_blank" rel = "noopener noreferrer">
            <div className = "personal-link" style = {{ '--bg-color': backgroundColor }}>
                <FontAwesomeIcon icon={divIcon} className = "standard-icon-size" />
            </div>
        </a>
    );
}

export default PersonalLink;