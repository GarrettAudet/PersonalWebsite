import React from 'react';
import './Hover.css';

function Hover({ contactLogo }) {
    return (
        <div className="socialContacts">
            <a href = "https://www.google.com/" title = "Github" className = "link">
                <i className = "bi bi-youtube">x</i>
            </a>
            <a href = "https://www.google.com/" title = "LinkedIn" className = "link">
                <i className = "bi bi-linkedin">y</i>
            </a>
            <a href = "https://www.google.com/" title = "Medium" className = "link">
                <i className = "bi bi-medium">z</i>
            </a>
        </div>
    );
}

export default Hover;