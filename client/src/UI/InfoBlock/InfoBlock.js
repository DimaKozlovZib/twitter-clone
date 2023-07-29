import React from 'react';
import { useSelector } from 'react-redux';
import './InfoBlock.css'

const InfoBlock = ({ childerenAuth, childerenNotAuth }) => {
    const isAuth = useSelector(state => state.isAuth)

    return (
        <div className='InfoBlock'>
            {isAuth ? childerenAuth : childerenNotAuth}
        </div>
    );
}

export default InfoBlock;
