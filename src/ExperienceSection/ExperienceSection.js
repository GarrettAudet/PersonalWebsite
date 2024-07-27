import React from 'react';
import './ExperienceSection.css';
import SectionContent from '../Section-Content/Section-Content';
import { ReactComponent as EducationLogo } from '../Img/education.svg';

function ExperienceSection({ number, text }) {
    return (
        <div className="ExperienceSection">
            <h3 className="flex sectionTitle"><span>{number}&nbsp;</span> {text}</h3>
            <SectionContent 
                title="Dual Degree Graduate" 
                description="Graduated as a first generation student with degrees in Business and Computer Science from Queen's University" 
                LogoComponent={EducationLogo}
                svgColor="rgb(144, 245, 244)"
            />
        </div>
    );
}

export default ExperienceSection;
