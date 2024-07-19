import React from 'react';
import './carousal.css'
import image1 from '../Img/image1.png'
import image2 from '../Img/image2.png'
import image3 from '../Img/image3.png'
import image4 from '../Img/image4.jpeg'
import image5 from '../Img/image5.jpg'
import image6 from '../Img/image6.png'

function Carousal () {
    return (
        <div className="banner">
            <div className = "slider" style = {{ '--quantity': 6}}>
                <div class = "item" style = {{ '--position': 1}}><img src ={image1} alt="personal"/></div>
                <div class = "item" style = {{ '--position': 2}}><img src ={image2} alt="personal"/></div>
                <div class = "item" style = {{ '--position': 3}}><img src ={image3} alt="personal"/></div>
                <div class = "item" style = {{ '--position': 4}}><img src ={image4} alt="personal"/></div>
                <div class = "item" style = {{ '--position': 5}}><img src ={image5} alt="personal"/></div>
                <div class = "item" style = {{ '--position': 6}}><img src ={image6} alt="personal"/></div>
            </div>
        </div>

    );
}

export default Carousal