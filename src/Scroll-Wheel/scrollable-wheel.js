import React from 'react';
import 'simplebar/dist/simplebar.css'; 
import SimpleBar from 'simplebar-react'; 

const ScrollableComponent = () => {
    return (
        <SimpleBar style={{ maxHeight: '400px' }}> </SimpleBar>
    );
};

export default ScrollableComponent;
