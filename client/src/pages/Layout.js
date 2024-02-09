import React, { useEffect } from 'react';
import Header from '../modules/Header/Header';
import { useSelector } from 'react-redux';
import { NavigatePath, onlyAuthPath } from '../routes';
import { useNavigate } from 'react-router-dom';

const Layout = ({ canClose, isOnlyAuth, children }) => {
    const isAuth = useSelector(state => state.isAuth)
    const Navigate = useNavigate()

    useEffect(() => {
        if (isOnlyAuth && isAuth === false) {
            Navigate(NavigatePath(onlyAuthPath))
        }
    }, []);

    return (
        <>
            <Header canClose={canClose} />
            <main>
                <div className='container'>
                    {children}
                </div>
            </main>
        </>
    );
}

export default Layout;
