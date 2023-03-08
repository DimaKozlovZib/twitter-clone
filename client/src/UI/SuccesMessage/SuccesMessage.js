import React from 'react';
import succes from '../../images/succes.svg';
import './SuccesMessage.css';

const SuccesMessage = ({ children }) => {
    return (
        <div className='SuccesMessage'>
            <img className='SuccesMessage-img' src={succes} alt='' />
            <p className='SuccesMessage-message'>{children}</p>
        </div>
    );
}

export default SuccesMessage;
