import React from 'react';
import './Hover.css';
import { ReactComponent as GithubLogo } from '../Img/github.svg';
import { ReactComponent as LinkedinLogo } from '../Img/linkedin.svg';
import { ReactComponent as MediumLogo } from '../Img/medium.svg';

function Hover() {
    return (
        <div className="socialContacts">
            <a href = "https://www.google.com/" title = "Github" className = "link">
                <GithubLogo className = "bi bi-github" />
            </a>
            <a href = "https://www.google.com/" title = "LinkedIn" className = "link">
                <LinkedinLogo className = "bi bi-linkedin"/>
            </a>
            <a href = "https://www.google.com/" title = "Medium" className = "link">
                <MediumLogo className = "bi bi-medium"/>
            </a>
        </div>
    );
}

export default Hover;