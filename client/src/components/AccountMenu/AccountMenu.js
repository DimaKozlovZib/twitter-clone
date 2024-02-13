import React, { memo } from 'react';
import './AccountMenu.css'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { NavigatePath, myFriendsPath, userInfoPath } from '../../routes';
import { setModalAction, setThemeAction } from '../../store';
import UserAvatar from '../../UI/UserAvatar/UserAvatar';

const AccountMenu = memo(({ isActive, setActiveMenu }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const id = useSelector(state => state.user?.id)
    const userImg = useSelector(state => state.user?.img)
    const userName = useSelector(state => state.user?.name)
    const theme = useSelector(state => state.theme)

    const profile = () => navigate(NavigatePath(userInfoPath(id)))

    const openFriendsPage = () => navigate(NavigatePath(myFriendsPath))

    const logout = (e) => {
        const payload = { type: "LOGOUT-MODAL", data: {} }
        dispatch(setModalAction(payload))
        setActiveMenu(false)
    }

    const changeTheme = () => {
        const setTheme = theme === 'light' ? 'dark' : 'light'
        dispatch(setThemeAction(setTheme))
        localStorage.setItem('appTheme', setTheme)
    }

    return (
        <nav className={`AccountMenu ${isActive ? 'active' : ''}`} id='AccountMenu'>
            <div className='profile__wrapper'>
                <button className='AccountMenu--profile' onClick={profile}>
                    <UserAvatar url={userImg} isNotLink />

                    <h5>{userName}</h5>

                    <svg viewBox="0 0 17 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.625 1.25L15.3333 17L1.625 32.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
            <button className='AccountMenu--item' onClick={openFriendsPage}>
                <div className='icon-box'>
                    <svg viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 17H21V15C21 14.3765 20.8057 13.7686 20.4441 13.2606C20.0826 12.7527 19.5718 12.37 18.9827 12.1658C18.3937 11.9615 17.7556 11.9459 17.1573 12.121C16.5589 12.2962 16.03 12.6534 15.644 13.143M16 17H6M16 17V15C16 14.344 15.874 13.717 15.644 13.143M15.644 13.143C15.2726 12.215 14.6318 11.4195 13.804 10.8591C12.9762 10.2988 11.9996 9.9993 11 9.9993C10.0004 9.9993 9.02376 10.2988 8.196 10.8591C7.36825 11.4195 6.72736 12.215 6.356 13.143M6 17H1V15C1.00005 14.3765 1.19434 13.7686 1.55586 13.2606C1.91739 12.7527 2.42819 12.37 3.01725 12.1658C3.60632 11.9615 4.24438 11.9459 4.84274 12.121C5.4411 12.2962 5.97003 12.6534 6.356 13.143M6 17V15C6 14.344 6.126 13.717 6.356 13.143M14 4C14 4.79565 13.6839 5.55871 13.1213 6.12132C12.5587 6.68393 11.7956 7 11 7C10.2044 7 9.44129 6.68393 8.87868 6.12132C8.31607 5.55871 8 4.79565 8 4C8 3.20435 8.31607 2.44129 8.87868 1.87868C9.44129 1.31607 10.2044 1 11 1C11.7956 1 12.5587 1.31607 13.1213 1.87868C13.6839 2.44129 14 3.20435 14 4ZM20 7C20 7.53043 19.7893 8.03914 19.4142 8.41421C19.0391 8.78929 18.5304 9 18 9C17.4696 9 16.9609 8.78929 16.5858 8.41421C16.2107 8.03914 16 7.53043 16 7C16 6.46957 16.2107 5.96086 16.5858 5.58579C16.9609 5.21071 17.4696 5 18 5C18.5304 5 19.0391 5.21071 19.4142 5.58579C19.7893 5.96086 20 6.46957 20 7ZM6 7C6 7.53043 5.78929 8.03914 5.41421 8.41421C5.03914 8.78929 4.53043 9 4 9C3.46957 9 2.96086 8.78929 2.58579 8.41421C2.21071 8.03914 2 7.53043 2 7C2 6.46957 2.21071 5.96086 2.58579 5.58579C2.96086 5.21071 3.46957 5 4 5C4.53043 5 5.03914 5.21071 5.41421 5.58579C5.78929 5.96086 6 6.46957 6 7Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                <h5>Друзья</h5>
            </button>

            <button className='AccountMenu--item' onClick={changeTheme}>
                <div className='icon-box'>
                    {
                        theme === 'light' ?
                            (
                                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 1V2.11111M11 19.8889V21M21 11H19.8889M2.11111 11H1M18.0711 18.0711L17.2856 17.2856M4.71444 4.71444L3.92889 3.92889M18.0711 3.92889L17.2856 4.71444M4.71444 17.2856L3.92889 18.0711M15.4444 11C15.4444 12.1787 14.9762 13.3092 14.1427 14.1427C13.3092 14.9762 12.1787 15.4444 11 15.4444C9.82126 15.4444 8.6908 14.9762 7.8573 14.1427C7.02381 13.3092 6.55556 12.1787 6.55556 11C6.55556 9.82126 7.02381 8.6908 7.8573 7.8573C8.6908 7.02381 9.82126 6.55556 11 6.55556C12.1787 6.55556 13.3092 7.02381 14.1427 7.8573C14.9762 8.6908 15.4444 9.82126 15.4444 11Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ) : (
                                <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21.0068 15.1391C19.1198 15.8977 17.0513 16.0851 15.0585 15.6782C13.0657 15.2712 11.2366 14.2878 9.79836 12.8501C8.36015 11.4125 7.37634 9.58401 6.96922 7.59201C6.56209 5.60001 6.74961 3.53233 7.50847 1.646C5.27377 2.54577 3.42179 4.19456 2.26998 6.30973C1.11817 8.4249 0.738286 10.8747 1.19544 13.2392C1.6526 15.6036 2.91833 17.7355 4.77565 19.2693C6.63297 20.8032 8.96619 21.6434 11.3754 21.646C13.4471 21.6461 15.4714 21.0264 17.1878 19.8668C18.9043 18.7072 20.2343 17.0607 21.0068 15.1391Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )
                    }
                </div>

                <h5>{theme === 'light' ? 'Светлая' : 'Тёмная'}</h5>
            </button>

            <button className='AccountMenu--item carefully' onClick={logout}>
                <div className='icon-box'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill='#00aaec' viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.32 2h.93a.75.75 0 1 1 0 1.5h-.9c-1 0-1.7 0-2.24.04a2.9 2.9 0 0 0-1.1.26A2.75 2.75 0 0 0 3.8 5c-.13.25-.21.57-.26 1.11-.04.55-.04 1.25-.04 2.24v3.3c0 1 0 1.7.04 2.24.05.53.13.86.26 1.1A2.75 2.75 0 0 0 5 16.2c.25.13.57.21 1.11.26.55.04 1.25.04 2.24.04h.9a.75.75 0 0 1 0 1.5h-.93c-.96 0-1.72 0-2.33-.05a4.39 4.39 0 0 1-1.67-.41 4.25 4.25 0 0 1-1.86-1.86A4.38 4.38 0 0 1 2.05 14C2 13.4 2 12.64 2 11.68V8.32c0-.96 0-1.72.05-2.33.05-.63.16-1.17.41-1.67a4.25 4.25 0 0 1 1.86-1.86c.5-.25 1.04-.36 1.67-.41C6.6 2 7.36 2 8.32 2Zm5.9 4.97a.75.75 0 0 1 1.06 0l2.5 2.5a.75.75 0 0 1 0 1.06l-2.5 2.5a.75.75 0 1 1-1.06-1.06l1.22-1.22H8.75a.75.75 0 0 1 0-1.5h6.69l-1.22-1.22a.75.75 0 0 1 0-1.06Z" strokeWidth="0.5" clipRule="evenodd"></path>
                    </svg>
                </div>

                <h5>Выйти</h5>
            </button>
        </nav>
    );
})

export default AccountMenu;
