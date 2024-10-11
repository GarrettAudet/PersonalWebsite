import React, { useEffect } from 'react';
import './header.css';
import { Link } from 'react-router-dom';  // Import Link

function Header({ scrollToSection, experienceRef, contactRef }) {
    useEffect(() => {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let interval = null;
        let isOriginal = true;

        const firstNameElement = document.querySelector(".first-name");

        firstNameElement.onmouseover = event => {
            let iteration = 0;
            const originalName = "garrettaudet.com";
            const fullName = "garrett audet";
            const targetText = isOriginal ? fullName : originalName;

            clearInterval(interval);
            interval = setInterval(() => {
                event.target.innerText = targetText
                    .split("")
                    .map((letter, index) => {
                        if (index < iteration) {
                            return targetText[index];
                        }
                        return letters[Math.floor(Math.random() * 26)];
                    })
                    .join("");

                if (iteration >= targetText.length) {
                    clearInterval(interval);
                    isOriginal = !isOriginal;
                }
                iteration += 1 / 3;
            }, 30);
        };

        return () => clearInterval(interval); 
    }, []);

    return (
        <div className="header">
            <div className="header-left">
                <span className="first-name" data-value="garrettaudet.com">garrettaudet.com</span>
            </div>
            <div className="header-right">
                <a href="#experience" onClick={() => scrollToSection(experienceRef)}>About</a>
                <Link to="/content">Experience</Link>
                <a href="https://garrett-audet.medium.com/">Writing</a>
                <a href="#contact" onClick={() => scrollToSection(contactRef)}>Contact</a>
            </div>
        </div>
    );
}

export default Header;