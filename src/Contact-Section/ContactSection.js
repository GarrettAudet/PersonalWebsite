import React from 'react';
import './ContactSection.css';

function ContactSection({ number, text }) {
    return (
        <div className="ExperienceSection">
            <h3 className="flex sectionTitle contactTitle"><span>{number}&nbsp;</span> {text}</h3>
        </div>
    );
}

export default ContactSection;
