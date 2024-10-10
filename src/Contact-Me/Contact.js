import React from 'react';
import './Contact.css';
import ContactProfile from './Profile.js'


function ContactForm() {
    return (
        <div className="contact-me-container flex">
            <ContactProfile />
        </div>
    );
}
export default ContactForm;