import React, { useState } from 'react';

const AppButton = ({ defaultIcon, hoverIcon, onClick, altText, id }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button 
            id={id}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <img src={isHovered ? hoverIcon : defaultIcon} alt={altText} draggable="false"/>
        </button>
    );
};

export default AppButton;
