import React from 'react';
import './Hover.css';
import { ReactComponent as GithubLogo } from '../Img/github.svg';
import { ReactComponent as LinkedinLogo } from '../Img/linkedin.svg';
import { ReactComponent as MediumLogo } from '../Img/medium.svg';

function Hover() {
    return (
        <div className="socialContacts">
            <a href = "https://github.com/GarrettAudet" title = "Github" className = "link">
                <GithubLogo className = "bi bi-github bi-icon" />
            </a>
            <a href = "https://www.linkedin.com/in/garrettaudet" title = "LinkedIn" className = "link">
                <LinkedinLogo className = "bi bi-linkedin bi-icon"/>
            </a>
            <a href = "https://garrett-audet.medium.com/" title = "Medium" className = "link">
                <MediumLogo className = "bi bi-medium bi-icon"/>
            </a>
        </div>
    );
}

export default Hover;