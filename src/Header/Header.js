import React from 'react';
import './Header.css'

function Header () {
    return (
        <div class = "Header">
            <div className = "HeaderLeft">Garrett Audet</div>
            <div className = "HeaderRight">
                <div>Header</div>
                <div>Projects</div>
                <div>Writing</div>
                <div>Contact</div>
            </div>
        </div>
    );
}

export default Header;