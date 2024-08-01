import React from 'react';
import './Content.css'

import Titlecard from '../Titlecard/Titlecard'
import Experience from '../Experience/Experience'

function Content ({ experienceRef, contactRef }) {
    return (
        <div className="main-content">
            <Titlecard />
            <Experience experienceRef = {experienceRef} contactRef = {contactRef} />
        </div>
    );
}

export default Content