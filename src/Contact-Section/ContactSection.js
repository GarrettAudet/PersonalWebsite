import React from 'react';
import './ContactSection.css';
import ContactForm from '../Contact/Contact';

function ContactSection({ number, text }) {
    return (
        <div className="ExperienceSection">
            <h3 className="flex sectionTitle contactTitle"><span>{number}&nbsp;</span> {text}</h3>
            {/* <ContactForm/> */}
        </div>
    );
}

export default ContactSection;
