import React, { useEffect, useRef } from 'react';
import { TypeAnimation } from 'react-type-animation';
import './Titlecard.css';

const TitleCard = () => {
  return (
    <a href="about">
      <div className="header-container">
        <h2>
          <span className="inline-block">I'm a developer and business practitioner who believes</span>
          <span className="inline-block">that <span className="text-decoration"> bridging perspectives </span> facilitates <span className="text-animation">
            <TypeAnimation
              sequence={[
                'economic potential.', 3000,
                'professional success.', 3000,
                'individual growth.', 3000
              ]}
              wrapper="span"
              speed={10}
              style={{ fontSize: '1em', display: 'inline-block' }}
              repeat={Infinity}
            />
          </span></span>
        </h2>
      </div>
    </a>
  );
};

export default TitleCard;
