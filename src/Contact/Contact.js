import React from 'react';
import './Contact.css';

function ContactForm() {
    return (
        <div className="ContactFormContainer">
            <div className="contact">Write me an e-mail at: </div>
            <h2 className="email">garrett.audet@gmail.com</h2>
            <div className="separator">OR</div>
            <div>Reach me through social media: </div>
        </div>
    );
}

export default ContactForm;
