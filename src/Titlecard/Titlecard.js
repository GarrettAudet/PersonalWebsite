import React from 'react';
import './Titlecard.css';

const TitleCard = () => {
  return (
    <a href="about">
      <div className="header-container">
        <h2>
          <span className="inline-block">I'm a developer and business practitioner who believes</span>
          <span className="inline-block">that <span className="text-decoration"> bridging perspectives</span> unlocks business opportunities
          </span>
        </h2>
      </div>
    </a>
  );
};

export default TitleCard;
