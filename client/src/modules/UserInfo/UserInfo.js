import React from 'react';
import UserAvatar from '../../UI/UserAvatar/UserAvatar';
import './UserInfo.css';
import ButtonBlue from '../../UI/ButtonBlue/ButtonBlue';
import useModal from '../../hooks/useModal';
import { useSelector } from 'react-redux';

const UserInfo = ({ user, canEdit }) => {
    const { name, id, email, url, countMessages, totalLikesNum, coverImage } = user;
    const openModal = useModal('ADD_COVER-MODAL')
    const userAuthCover = useSelector(state => state.user.coverImage);

    return (
        <div className='profile-header'>
            <div className='profile-cover'
                style={{ 'backgroundImage': `url(http://localhost:5000/${canEdit && userAuthCover ? userAuthCover : coverImage})` }}>
                <button className='edit-cover' onClick={openModal}>
                    <span className='edit-cover__icon'>
                        <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 15.248V18.9975H3.74948L14.8079 7.93903L11.0585 4.18955L0 15.248ZM17.7075 5.03944C18.0975 4.64949 18.0975 4.01958 17.7075 3.62963L15.3679 1.28996C14.9779 0.900011 14.348 0.900011 13.9581 1.28996L12.1283 3.1197L15.8778 6.86918L17.7075 5.03944Z" fill="black" />
                        </svg>
                    </span>
                    <span className='edit-cover__title'>изменить обложку</span>
                </button>
            </div>
            <div className='userInfo'>
                <div className='userInfo__avatar'>
                    <UserAvatar isLink={false} url={url} />
                </div>
                <div className='info-about-user'>
                    <h2 className='user-name'>{name}</h2>
                    <h3 className='user-email'>{email}</h3>
                </div>
                {canEdit ? <div className='edit-button'><ButtonBlue>Редактировать</ButtonBlue></div> : ''}
            </div>
        </div>
    );
}

export default UserInfo;
