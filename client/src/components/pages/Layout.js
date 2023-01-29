import React from 'react';
import Header from '../Header/Header';

const Layout = ({ navPageName, children }) => {
    return (
        <>
            <Header>
                {navPageName}
            </Header>
            <main>
                <div className='container'>
                    {children}
                </div>
            </main>
        </>
    );
}

export default Layout;
