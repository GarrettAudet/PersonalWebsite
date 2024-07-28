import React from 'react';
import './Hover.css';

function Hover({ contactLogo }) {
    return (
        <div className="socialContacts">
            <a href = "#" title = "Github" className = "link">
                <i className = "bi bi-youtube">x</i>
            </a>
            <a href = "#" title = "LinkedIn" className = "link">
                <i className = "bi bi-linkedin">y</i>
            </a>
            <a href = "#" title = "Medium" className = "link">
                <i className = "bi bi-medium">z</i>
            </a>
        </div>
    );
}

export default Hover;