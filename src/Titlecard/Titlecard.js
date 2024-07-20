import React, { useEffect, useRef } from 'react';
import { TypeAnimation } from 'react-type-animation';
import './Titlecard.css';

const TitleCard = () => {
  return (
    <a href="about">
      <div className="header-container">
        <h2>
          <span className="inline-block appearIn">I'm a developer and business practitioner who believes that </span>
          <span className="inline-block appearIn"><span className="text-decoration"> bridging diverse perspectives </span> unlocks <span className="text-animation">
            <TypeAnimation
              sequence={[
                'economic potential.', 3000,
                'professional opportunities.', 3000,
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
