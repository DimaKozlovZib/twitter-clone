import React, { memo, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './Header.css';
import { useSelector } from 'react-redux';
import LogoIcon from "../../images/LogoIcon.png";
import UserAvatar from '../../UI/UserAvatar/UserAvatar';
import { loginPath, messagesPath, myFriendsPath } from '../../routes';
import useModal from '../../hooks/useModal';
import AccountMenu from '../../components/AccountMenu/AccountMenu';
import SearchInput from '../../components/SearchInput/SearchInput';

const Header = memo(({ canClose, children }) => {
    const user = useSelector(state => state.user)
    const isAuth = useSelector(state => state.isAuth)
    const History = useNavigate()
    const [openModal] = useModal('ADD_MESSAGE-MODAL')
    const [activeMenu, setActiveMenu] = useState(false);

    useEffect(() => {
        if (activeMenu) {
            const closeMenu = (e) => {
                if (activeMenu && e.target.offsetParent?.id !== 'AccountMenu') {
                    e.preventDefault();
                    setActiveMenu(false)
                }
            }

            document.addEventListener('click', closeMenu)
            return () => {
                document.removeEventListener('click', closeMenu)
            }
        }
    }, [activeMenu]);

    const onClickAvatar = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setActiveMenu(activeMenu ? false : true)
    }

    const openMenuOnHover = () => {
        if (!activeMenu) {
            setActiveMenu(true)
        }
    }

    const userIsAuth = (
        <>
            <UserAvatar url={user?.img} isNotLink onClick={onClickAvatar} onFocus={openMenuOnHover} onBlur={onClickAvatar} />
            <AccountMenu isActive={activeMenu} setActiveMenu={setActiveMenu} />
            <button className='write-message blue-button' onClick={openModal}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.414 0.586C15.0389 0.211058 14.5303 0.000427246 14 0.000427246C13.4697 0.000427246 12.9611 0.211058 12.586 0.586L5 8.172V11H7.828L15.414 3.414C15.7889 3.03894 15.9996 2.53033 15.9996 2C15.9996 1.46967 15.7889 0.961056 15.414 0.586Z" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M0 4C0 3.46957 0.210714 2.96086 0.585786 2.58579C0.960859 2.21071 1.46957 2 2 2H6C6.26522 2 6.51957 2.10536 6.70711 2.29289C6.89464 2.48043 7 2.73478 7 3C7 3.26522 6.89464 3.51957 6.70711 3.70711C6.51957 3.89464 6.26522 4 6 4H2V14H12V10C12 9.73478 12.1054 9.48043 12.2929 9.29289C12.4804 9.10536 12.7348 9 13 9C13.2652 9 13.5196 9.10536 13.7071 9.29289C13.8946 9.48043 14 9.73478 14 10V14C14 14.5304 13.7893 15.0391 13.4142 15.4142C13.0391 15.7893 12.5304 16 12 16H2C1.46957 16 0.960859 15.7893 0.585786 15.4142C0.210714 15.0391 0 14.5304 0 14V4Z" />
                </svg>
            </button>
        </>
    )
    const userIsNotAuth = (<Link to={`/${loginPath}`} className='login blue-button'>войти</Link>)

    const goBack = () => History(-1)

    const closeBtn = (
        <button className='go-back-btn' onClick={goBack}>
            <div className='pointer-left'>
                <span></span>
            </div>
            <p className='go-back-btn__text'>назад</p>
        </button>
    )

    return (
        <header className={`header ${canClose && 'canClose'}`}>
            <div className='container'>
                {canClose && closeBtn}
                <div className='logo-box'>
                    <Link to={`/${messagesPath}`}>
                        <img className='logo' src={LogoIcon} alt="" />
                    </Link>
                </div>
                <div className='unite-wrapper'>
                    <SearchInput />
                    {
                        isAuth ? userIsAuth : userIsNotAuth
                    }
                </div>
            </div>
        </header>
    );
})

export default Header;
