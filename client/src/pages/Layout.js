import React from 'react';
import Header from '../modules/Header/Header';

const Layout = ({ canClose, navPageName, children }) => {
    return (
        <>
            <Header canClose={canClose}>
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
