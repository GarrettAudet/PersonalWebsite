import React from 'react';
import './Section.css'

function Section ({ number, text }) {
    return (
      <h3 className="flex"><span>{number}&nbsp;</span> {text}</h3>
    );
}

export default Section