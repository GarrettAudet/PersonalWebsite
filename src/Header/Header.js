import React from 'react';
import './Header.css'

function Header () {
    return (
        <div className="header">
            <div className="header-left">
                <span className="first-name">garrett</span>
                <span className="collapse-on-hover"> </span>
                <span className="last-name">audet</span>
                <span className="logo-letter-hide delay-75">.</span>
                <span className="logo-letter-hide delay-100">com</span>
            </div>
            <div className="header-right">
                <div>About</div>
                <div>Projects</div>
                <div>Writing</div>
                <div>Contact</div>
            </div>
      </div>
    );
}

export default Header