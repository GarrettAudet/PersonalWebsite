import React from 'react';
import ExperienceSection from '../ExperienceSection/ExperienceSection'
import ContactSection from '../Contact-Section/ContactSection'
import './Experience.css'

function Experience () {
    return (
      <div className="flex experience-container">
        <ExperienceSection number="01." text="Experience"/>
        <ContactSection number="02." text="Contact"/>
      </div>
    );
}

export default Experience