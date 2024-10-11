import React from 'react';
import './contact-section.css';
import ContactLinks from './contact-me';

function ContactSection({ number, text }) {
    return (
        <div className="ExperienceSection">
            <h3 className="flex sectionTitle contactTitle"><span>{number}&nbsp;</span> {text}</h3>
            <ContactLinks />
        </div>
    );
}

export default ContactSection;
