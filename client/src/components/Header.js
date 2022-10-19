import React from 'react';
import { Link } from 'react-router-dom'

const Header = () => {
    return (
        <header>
            <div className='container-header'>
                <button className='user-avatar'>
                    <img src={''} />
                </button>
                <Link>
                    logo
                </Link>
            </div>
        </header>
    );
}

export default Header;
