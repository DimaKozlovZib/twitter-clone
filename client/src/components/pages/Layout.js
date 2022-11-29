import React from 'react';
import Header from '../Header/Header';

const Layout = ({ navPageName, children }) => {
    return (
        <>
            <Header>
                {navPageName}
            </Header>
            <main>
                {children}
            </main>
        </>
    );
}

export default Layout;
