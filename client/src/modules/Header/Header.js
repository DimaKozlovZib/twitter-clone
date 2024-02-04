import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { useSelector } from 'react-redux';
import UserAvatar from '../../UI/UserAvatar/UserAvatar';
import { addMessagePath, loginPath, messagesPath } from '../../routes';
import AccountMenu from '../../components/AccountMenu/AccountMenu';
import SearchInput from '../../components/SearchInput/SearchInput';
import ButtonBlue from '../../UI/ButtonBlue/ButtonBlue';

const Header = ({ canClose }) => {
    const user = useSelector(state => state.user)
    const isAuth = useSelector(state => state.isAuth)
    const History = useNavigate()
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

    const goToAddMessagePage = () => {
        History(`/${addMessagePath}`)
    }

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
            <ButtonBlue className='write-message' onClick={goToAddMessagePage}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.414 0.586C15.0389 0.211058 14.5303 0.000427246 14 0.000427246C13.4697 0.000427246 12.9611 0.211058 12.586 0.586L5 8.172V11H7.828L15.414 3.414C15.7889 3.03894 15.9996 2.53033 15.9996 2C15.9996 1.46967 15.7889 0.961056 15.414 0.586Z" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M0 4C0 3.46957 0.210714 2.96086 0.585786 2.58579C0.960859 2.21071 1.46957 2 2 2H6C6.26522 2 6.51957 2.10536 6.70711 2.29289C6.89464 2.48043 7 2.73478 7 3C7 3.26522 6.89464 3.51957 6.70711 3.70711C6.51957 3.89464 6.26522 4 6 4H2V14H12V10C12 9.73478 12.1054 9.48043 12.2929 9.29289C12.4804 9.10536 12.7348 9 13 9C13.2652 9 13.5196 9.10536 13.7071 9.29289C13.8946 9.48043 14 9.73478 14 10V14C14 14.5304 13.7893 15.0391 13.4142 15.4142C13.0391 15.7893 12.5304 16 12 16H2C1.46957 16 0.960859 15.7893 0.585786 15.4142C0.210714 15.0391 0 14.5304 0 14V4Z" />
                </svg>
            </ButtonBlue>
        </>
    )
    const userIsNotAuth = (<button onClick={() => History(`/${loginPath}`)} className='login buttonBlue'>войти</button>)

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
                        <svg viewBox="0 0 113 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M76.3774 29.6694C76.3774 32.196 83.9234 33.6003 85.3208 36.4071C86.7182 39.2139 78.8928 42.0219 76.3774 41.7412C73.8621 41.4605 68.2725 46.7945 68.2725 58.5856C68.2725 70.3767 65.4777 66.1656 63.2418 62.7967C61.006 59.4278 58.2111 60.8316 53.7394 58.5856C49.2677 56.3397 42.0012 62.2353 43.6781 66.1656C45.355 70.096 45.355 74.0263 47.3114 76.8337C49.2678 79.6412 50.3857 76.8337 53.7394 78.5182C56.4225 79.8657 57.8385 83.7587 58.2111 85.5367C59.4222 82.6357 63.13 76.2723 68.2725 74.0263C74.7005 71.2189 69.9494 78.2374 78.8928 76.8337C82.7619 76.2265 85.4279 78.0888 87.2303 80.5112M87.2303 80.5112C93.0994 72.5389 96.5695 62.6765 96.5695 52C96.5695 43.9378 94.5908 36.3398 91.0945 29.6694M87.2303 80.5112C78.5266 92.334 64.5469 100 48.7848 100C45.9786 100 43.2289 99.757 40.5554 99.2909M40.5554 99.2909C40.9166 97.2025 41.3891 95.4769 42.0012 94.5204C44.5166 90.59 52.901 93.3974 53.7394 91.4322C54.5779 89.4671 50.9446 87.2211 47.3114 85.5367C43.6781 83.8522 37.5295 82.1678 36.6911 74.0263C35.8526 65.8849 31.9399 67.2886 31.1015 66.1656C30.263 65.0427 20.4812 61.9545 17.406 56.3397C14.3309 50.7249 17.4069 41.1797 17.406 38.6531C17.4054 36.867 9.69569 34.9497 4.49497 33.9467M40.5554 99.2909C18.0861 95.3731 1 75.6909 1 52C1 45.6143 2.24138 39.5198 4.49497 33.9467M4.49497 33.9467C11.5969 16.384 28.7511 4 48.7848 4C53.1027 4 57.2869 4.5753 61.2656 5.65377M61.2656 5.65377C57.7786 7.11335 54.682 7.92336 53.7394 7.49328C50.6652 6.09047 43.6781 9.17683 42.0012 8.89609C40.3243 8.61535 39.4859 15.6339 36.6911 15.6339C33.8963 15.6339 34.7347 25.179 34.7347 29.6694C34.7347 34.1597 49.2677 29.6694 53.7394 26.8635C58.2111 24.0575 49.8026 19.8458 49.8026 17.5999C49.8026 15.354 51.7831 12.8256 58.2111 12.2642C60.0793 12.101 63.1837 12.4146 65.2108 13M61.2656 5.65377C62.7487 6.0558 65.2817 6.95514 66.704 7.49328M66.704 7.49328L68.2725 1H112V29.6694H91.0945M66.704 7.49328L65.2108 13M65.2108 13L56.7489 42.5L68.2725 29.6694H91.0945M71.1839 8H107.52M71.1839 22.5H107.52M71.1839 15H107.52" stroke="#00AAEC" strokeWidth="4" strokeLinecap="square" strokeLinejoin="round" />
                        </svg>
                    </Link>
                </div>
                <div className='unite-wrapper'>
                    <SearchInput />
                    {
                        isAuth ? userIsAuth : userIsNotAuth
                    }
                </div>
                {isAuth && <AccountMenu isActive={activeMenu} setActiveMenu={setActiveMenu} />}
            </div>
        </header>
    );
}

export default Header;
