import React from 'react';
import Loader from '../../UI/Loader/Loader';
import './LoadModal.css';
import LogoIcon from '../../images/LogoIcon.svg'
import { PROJECT_NAME } from '../../constans';

const LoadModal = () => {
    return (
        <div className='LoadModal'>
            <div className='logo-box'>
                <img src={LogoIcon} />
                <h1>{PROJECT_NAME}</h1>
            </div>
            <Loader />
        </div>
    );
}

export default LoadModal;
