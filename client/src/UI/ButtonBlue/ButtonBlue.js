import React from 'react';
import './ButtonBlue.css';

const ButtonBlue = ({ children, onClick, className }) => <button onClick={onClick} className={`buttonBlue ${className}`}>{children}</button>

export default ButtonBlue;
