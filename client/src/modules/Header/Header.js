import React, { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { useSelector } from 'react-redux';
import LogoIcon from "../../images/LogoIcon.png";
import UserAvatar from '../../UI/UserAvatar/UserAvatar';

const Header = memo(({ children }) => {
    const { isAuth, user } = useSelector(state => state)
    //const History = useNavigate()

    const userIsAuth = (
        <>
            <UserAvatar url={user?.url} id={user.id} />
            <button className='write-message blue-button'>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.414 0.586C15.0389 0.211058 14.5303 0.000427246 14 0.000427246C13.4697 0.000427246 12.9611 0.211058 12.586 0.586L5 8.172V11H7.828L15.414 3.414C15.7889 3.03894 15.9996 2.53033 15.9996 2C15.9996 1.46967 15.7889 0.961056 15.414 0.586Z" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M0 4C0 3.46957 0.210714 2.96086 0.585786 2.58579C0.960859 2.21071 1.46957 2 2 2H6C6.26522 2 6.51957 2.10536 6.70711 2.29289C6.89464 2.48043 7 2.73478 7 3C7 3.26522 6.89464 3.51957 6.70711 3.70711C6.51957 3.89464 6.26522 4 6 4H2V14H12V10C12 9.73478 12.1054 9.48043 12.2929 9.29289C12.4804 9.10536 12.7348 9 13 9C13.2652 9 13.5196 9.10536 13.7071 9.29289C13.8946 9.48043 14 9.73478 14 10V14C14 14.5304 13.7893 15.0391 13.4142 15.4142C13.0391 15.7893 12.5304 16 12 16H2C1.46957 16 0.960859 15.7893 0.585786 15.4142C0.210714 15.0391 0 14.5304 0 14V4Z" />
                </svg>
            </button>
        </>
    )
    const userIsNotAuth = (<Link className='login blue-button'>войти</Link>)

    return (
        <header className='header'>
            <div className='container'>
                <div className='logo-box'>
                    <Link>
                        <img className='logo' src={LogoIcon} alt="" />
                    </Link>
                </div>
                <div className='navItem-wrapper'>
                    {children}
                </div>

                <div className='unite-wrapper'>
                    <form className='search'>
                        <input type='text' />
                        <button >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M6 2C4.93913 2 3.92172 2.42143 3.17157 3.17158C2.42143 3.92172 2 4.93914 2 6C2 7.06087 2.42143 8.07829 3.17157 8.82843C3.92172 9.57858 4.93913 10 6 10C7.06087 10 8.07828 9.57858 8.82843 8.82843C9.57857 8.07829 10 7.06087 10 6C10 4.93914 9.57857 3.92172 8.82843 3.17158C8.07828 2.42143 7.06087 2 6 2ZM1.13461e-07 6C-0.00012039 5.05571 0.222642 4.12472 0.650171 3.28274C1.0777 2.44077 1.69792 1.7116 2.4604 1.15453C3.22287 0.597457 4.10606 0.228216 5.03815 0.0768364C5.97023 -0.0745427 6.92488 -0.00378543 7.82446 0.283354C8.72405 0.570493 9.54315 1.06591 10.2152 1.7293C10.8872 2.39269 11.3931 3.20534 11.6919 4.10114C11.9906 4.99694 12.0737 5.9506 11.9343 6.88456C11.795 7.81852 11.4372 8.7064 10.89 9.476L15.707 14.293C15.8892 14.4816 15.99 14.7342 15.9877 14.9964C15.9854 15.2586 15.8802 15.5094 15.6948 15.6948C15.5094 15.8802 15.2586 15.9854 14.9964 15.9877C14.7342 15.99 14.4816 15.8892 14.293 15.707L9.477 10.891C8.57936 11.5293 7.52335 11.9082 6.42468 11.9861C5.326 12.0641 4.22707 11.8381 3.2483 11.333C2.26953 10.8278 1.44869 10.063 0.875723 9.12235C0.30276 8.18168 -0.000214051 7.10144 1.13461e-07 6Z" fill="black" />
                            </svg>
                        </button>
                    </form>
                    {
                        isAuth ? userIsAuth : userIsNotAuth
                    }
                </div>

            </div>
        </header>
    );
})

export default Header;
