import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function PersonalLink({ backgroundColor, divIcon }) {
    return (
        <div className = "personal-link" style = {{ '--bg-color': backgroundColor }}>
            <FontAwesomeIcon icon={divIcon} />
        </div>
    );
}

export default PersonalLink;