import React from 'react';
import './Contact.css';
import { ReactComponent as GithubLogo } from '../Img/github.svg';
import { ReactComponent as LinkedinLogo } from '../Img/linkedin.svg';
import { ReactComponent as MediumLogo } from '../Img/medium.svg';

function ContactForm() {
    return (
        <div className="socialContacts">
            <a href = "https://github.com/GarrettAudet" title = "Github" className = "link border">
                <GithubLogo className = "bi-icon" />
            </a>
            <a href = "https://www.linkedin.com/in/garrettaudet" title = "LinkedIn" className = "link border">
                <LinkedinLogo className = "bi-icon"/>
            </a>
            <a href = "https://garrett-audet.medium.com/" title = "Medium" className = "link border">
                <MediumLogo className = "bi-icon"/>
            </a>
        </div>
    );
}

export default ContactForm;

