import React from 'react';
import './ContactSection.css';
import Hover from '../Hover-Icon/Hover'
import ContactForm from '../Contact/Contact';

function ContactSection({ number, text }) {
    return (
        <div className="ExperienceSection">
            <h3 className="flex sectionTitle contactTitle"><span>{number}&nbsp;</span> {text}</h3>
            <ContactForm/>
            <Hover/>
        </div>
    );
}

export default ContactSection;
