import React, { useState } from "react";
import '../styles/player.css';

const PlayerInputSlider = ({ max, value, onChange, step, onMouseDown, onMouseUp, id }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <input 
            type="range" 
            id={id} 
            min="0" 
            max={max} 
            value={value} 
            step={step} 
            onChange={onChange} 
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)}
            onMouseDown={onMouseDown} // Додайте обробник onMouseDown
            onMouseUp={onMouseUp} // Додайте обробник onMouseUp
            className={`slider ${isHovered ? 'slider-hovered' : ''}`}
        />
    );
}

export default PlayerInputSlider;
