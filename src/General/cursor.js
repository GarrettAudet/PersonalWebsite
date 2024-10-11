import React, { useEffect } from 'react';
import './cursor.css';

const Cursor = () => {
    useEffect(() => {
        const cursor = document.querySelector('.cursor');

        const moveCursor = (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        };

        const handleMouseEnter = () => {
            cursor.classList.add('hover');
        };

        const handleMouseLeave = () => {
            cursor.classList.remove('hover');
        };

        window.addEventListener('mousemove', moveCursor);
        document.querySelectorAll('a').forEach(link => {
            link.addEventListener('mouseenter', handleMouseEnter);
            link.addEventListener('mouseleave', handleMouseLeave);
        });

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            document.querySelectorAll('a').forEach(link => {
                link.removeEventListener('mouseenter', handleMouseEnter);
                link.removeEventListener('mouseleave', handleMouseLeave);
            });
        };
    }, []);

    return <div className="cursor"></div>;
};

export default Cursor;
