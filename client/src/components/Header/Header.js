import React, { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import LogoIcon from "../../images/LogoIcon.png";
import account from "../../images/account.svg"

const Header = memo(() => {
    const [menu, setMenu] = useState('');

    const openMobileMenu = () => setMenu(menu === 'active' ? '' : 'active')

    return (
        <header className='header'>
            <div className='container'>
                <Link className='user-avatar'>
                    <img src={account} alt="" />
                </Link>
                <Link>
                    <img className='logo' src={LogoIcon} alt="" />
                </Link>
                <button className={`burger-menu ${menu}`} onClick={openMobileMenu}>
                    <span></span>
                </button>
            </div>
        </header>
    );
})

export default Header;
