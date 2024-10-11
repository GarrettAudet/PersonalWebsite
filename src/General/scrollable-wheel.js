import React from 'react';
import './scrollable-wheel.css'
import 'simplebar/dist/simplebar.css'; 
import SimpleBar from 'simplebar-react'; 

const ScrollableComponent = () => {
    return (
        <SimpleBar style={{ maxHeight: '400px' }}> </SimpleBar>
    );
};

export default ScrollableComponent;
