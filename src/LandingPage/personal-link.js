import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function PersonalLink({ backgroundColor, divIcon }) {
    return (
        <div>
            <FontAwesomeIcon icon={divIcon} />
        </div>
    );
}

export default PersonalLink;