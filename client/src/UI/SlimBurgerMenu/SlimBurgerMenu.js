import React from 'react';
import './SlimBurgerMenu.css'

const SlimBurgerMenu = ({ onClickFunc }) => {
    return (
        <div className='SlimBurgerMenu' onClick={onClickFunc}>
            <span></span>
        </div>
    );
}

export default SlimBurgerMenu;
