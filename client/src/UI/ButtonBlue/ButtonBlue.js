import React from 'react';
import './ButtonBlue.css';

const ButtonBlue = ({ children, onClick, className, disabled }) =>
    <button onClick={onClick} className={`buttonBlue ${className}`} disabled={disabled}>{children}</button>

export default ButtonBlue;
