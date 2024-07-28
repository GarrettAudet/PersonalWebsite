import React from 'react';
import './ContactSection.css';
import Hover from '../Hover-Icon/Hover'

function ContactSection({ number, text }) {
    return (
        <div className="ExperienceSection">
            <h3 className="flex sectionTitle contactTitle"><span>{number}&nbsp;</span> {text}</h3>
            <Hover />
        </div>
    );
}

export default ContactSection;
