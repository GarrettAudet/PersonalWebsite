import React from 'react';
import './experience-section.css';
import SectionContent from './experience-item';
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
                description="Served as the youngest ever selected member of the Military Intelligence unit in the Canadian Armed Forces"
                LogoComponent={MilitaryLogo}
                svgColor="rgb(244, 199, 144)"
                Link="https://forces.ca/en/career/intelligence-operator/"
            />
            <SectionContent 
                title="WTO Representative" 
                description="Selected as 1 of 5 Canadians to represent Canada at the World Trade Organization Public Forum 2018 in Geneva, Switzerland." 
                LogoComponent={WTOLogo}
                svgColor="rgb(244, 144, 145)"
                Link="https://www.youngdiplomats.ca/2018-wto"
            />
            <SectionContent 
                title="Oxford Geopolitics" 
                description="Selected among ~20 individuals globally to attend the Oxford Summer Programme on International Affairs and present public policy recommendations to NATO/UK officials." 
                LogoComponent={EducationLogo}
                svgColor="rgb(144, 245, 244)"
                Link="https://www.linkedin.com/company/oxford-diplomacy-and-geopolitics-forum/about/"
            />
            <SectionContent 
                title="Published ML Research Paper" 
                description="Published a machine learning advancement in Natural Language Processing at the Institute of Electrical and Electronics Engineers International Conference on Big Data." 
                LogoComponent={ResearchLogo}
                svgColor="rgb(245, 244, 144)"
                Link="https://ieeexplore.ieee.org/document/9671412"
            />
            <SectionContent 
                title="Cansbridge Scholar" 
                description="Selected for the Cansbridge Fellowship, featuring Forbes 30U30, Thiel Fellows, and YC alumni, representing future Canadian business leaders." 
                LogoComponent={AwardLogo}
                svgColor="rgb(144, 245, 144)"
                Link="https://www.cansbridgefellowship.com/"
            />
        </div>
    );
}

export default ExperienceSection;
