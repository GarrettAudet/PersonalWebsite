import React from 'react';
import './Contact.css';

function ContactForm() {
    return (
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
                
                <button type="submit" className="submit-button">Submit</button>
            </form>
        </div>
    );
}

export default ContactForm;

