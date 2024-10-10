import React from 'react';
import './Profile.css';
import myImage from '../Img/picture.png'

function ContactProfile() {
    return (
        <div className="Profile">
            <div className="contact-me-left-container flex">
                <div className="contact-me-profile">
                    <div className="contact-me-profile-top flex">
                        <img src={myImage} alt="My Image" className="profile-image" />
                    </div>
                    <div className="contact-me-profile-bottom">
                        <h2 className="name">Maya Nelson</h2>
                        <p className="title">Project Manager</p>
                        <div className="social-links">
                            <a href="#facebook">F</a>
                            <a href="#twitter">T</a>
                            <a href="#linkedin">L</a>
                            <a href="#instagram">I</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="contact-me-right-container">
                <p className="subheader">Here's who I am & what I do</p>
                <div className="buttons">
                    <button className="resume-btn">Resume</button>
                    <button className="projects-btn">Projects</button>
                </div>
                <p className="description">
                    I'm a paragraph. Click here to add your own text and edit me. It's easy.
                    Just click “Edit Text” or double-click me to add your own content and make
                    changes to the font.
                </p>
                <p className="description">
                    I’m a great place for you to tell a story and let your users know a little
                    more about you.
                </p>
            </div>
    </div>
    );
}

export default ContactProfile;