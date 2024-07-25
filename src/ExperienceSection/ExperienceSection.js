import React from 'react';
import './ExperienceSection.css';
import SectionContent from '../Section-Content/Section-Content';
import { ReactComponent as EducationLogo } from '../Img/education.svg';

function ExperienceSection({ number, text }) {
    return (
        <div className="ExperienceSection">
            <h3 className="flex sectionTitle"><span>{number}&nbsp;</span> {text}</h3>
            <SectionContent 
                title="Computer Science and Business Graduate" 
                description="Graduated as a first generation student with dual degrees in Business and Computing" 
                LogoComponent={EducationLogo} 
            />
        </div>
    );
}

export default ExperienceSection;
