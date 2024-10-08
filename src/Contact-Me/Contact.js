import React from 'react';
import './Contact.css';
import { ReactComponent as GithubLogo } from '../Img/github.svg';
import { ReactComponent as LinkedinLogo } from '../Img/linkedin.svg';
import { ReactComponent as MediumLogo } from '../Img/medium.svg';

function ContactForm() {
    return (
        <div className="contact-me-container">
            <div className="contact-form-container">
            <div className="contact-form-header">
                <div className="contact-section-line"></div>
                <h3 className="contact-section-title">Contact</h3>
                <div className="contact-section-line"></div>
            </div>
            <form className="contact-form">
                <div className="contact-form-name">
                    <div className="contact-form-first-name">
                        <input type="text" id="first-name" name="first-name" placeholder="First Name" required />
                    </div>
                    
                    <div className="contact-form-last-name">
                        <input type="text" id="last-name" name="last-name" placeholder="Last Name" required />
                    </div>
                </div>
                <div className="form-group">
                    <textarea id="message" name="message" rows="5" placeholder="Message" required></textarea>
                </div>
                <div className="submit-button-container flex">
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
                    <button type="submit" className="submit-button">Submit</button>
                </div>
                </form>
            </div>
        </div>
    );
}

export default ContactForm;