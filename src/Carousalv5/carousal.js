import React from 'react';
import { useState } from "react"
import Slider from "react-slick"
import './carousal.css'

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 

import queens from '../Img/demoImage.svg'
import military from '../Img/demoImage.svg'
import wto from '../Img/demoImage.svg'
import oxford from '../Img/demoImage.svg'
import ieee from '../Img/demoImage.svg'
import cansbridge from '../Img/demoImage.svg'

/*
import queens from '../Img/image1.png'
import military from '../Img/image2.png'
import wto from '../Img/image3.png'
import oxford from '../Img/image4.jpeg'
import ieee from '../Img/image5.jpg'
import cansbridge from '../Img/image6.png'
*/

const images = [queens, military, wto, oxford, ieee, cansbridge]

function Carousel() {
    const [imageIndex, setImageIndex] = useState(0);
  
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      centerMode: true,
      centerPadding: '0',
      beforeChange: (current, next) => setImageIndex(next),
      responsive: [
        {
          breakpoint: 768, // Adjust settings for smaller screens
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            centerMode: false,
            centerPadding: '0',
          }
        }
      ]
    };
  
    return (
      <div className="slider-container">
        <Slider {...settings}>
          {images.map((img, idx) => (
            <div key={idx} className={idx === imageIndex ? "slide activeSlide" : "slide"}>
              <img src={img} alt={`Slide ${idx}`} className="slider-image" />
            </div>
          ))}
        </Slider>
      </div>
    );
}

export default Carousel