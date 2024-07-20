import React from 'react';
import './Content.css'

import Titlecard from '../Titlecard/Titlecard'
import Experience from '../Experience/Experience'

function Content ({ number, text }) {
    return (
        <div>
            <Titlecard />
            <Experience />
        </div>
    );
}

export default Content