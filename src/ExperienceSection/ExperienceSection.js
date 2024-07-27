import React from 'react';
import './ExperienceSection.css';
import SectionContent from '../Section-Content/Section-Content';
import { ReactComponent as MilitaryLogo } from '../Img/military.svg';
import { ReactComponent as WTOLogo } from '../Img/wto.svg';
import { ReactComponent as EducationLogo } from '../Img/education.svg';
import { ReactComponent as ResearchLogo } from '../Img/research.svg';
import { ReactComponent as AwardLogo } from '../Img/scholar.svg';

function ExperienceSection({ number, text }) {
    return (
        <div className="ExperienceSection">
            <h3 className="flex sectionTitle"><span>{number}&nbsp;</span> {text}</h3>
            <SectionContent 
                title="Military Intelligence" 
                description="Graduated as a first generation student with degrees in Business and Computer Science from Queen's University" 
                LogoComponent={MilitaryLogo}
                svgColor="rgb(244, 199, 144)"
                Link="https://forces.ca/en/career/intelligence-operator/"
            />
            <SectionContent 
                title="WTO Representative" 
                description="Graduated as a first generation student with degrees in Business and Computer Science from Queen's University" 
                LogoComponent={WTOLogo}
                svgColor="rgb(244, 144, 145)"
                Link="https://www.youngdiplomats.ca/2018-wto"
            />
            <SectionContent 
                title="Oxford Geopolitics" 
                description="Graduated as a first generation student with degrees in Business and Computer Science from Queen's University" 
                LogoComponent={EducationLogo}
                svgColor="rgb(144, 245, 244)"
                Link="https://www.linkedin.com/company/oxford-diplomacy-and-geopolitics-forum/about/"
            />
            <SectionContent 
                title="Published ML Research Paper" 
                description="Graduated as a first generation student with degrees in Business and Computer Science from Queen's University" 
                LogoComponent={ResearchLogo}
                svgColor="rgb(245, 244, 144)"
                Link="https://ieeexplore.ieee.org/document/9671412"
            />
            <SectionContent 
                title="Cansbridge Scholar" 
                description="Graduated as a first generation student with degrees in Business and Computer Science from Queen's University" 
                LogoComponent={AwardLogo}
                svgColor="rgb(144, 245, 144)"
                Link="https://www.cansbridgefellowship.com/"
            />
        </div>
    );
}

export default ExperienceSection;
