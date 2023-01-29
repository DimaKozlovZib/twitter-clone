import React from 'react';
import UserAvatar from '../UI/UserAvatar/UserAvatar';
import './UserInfo.css';
import ButtonBlue from '../UI/ButtonBlue/ButtonBlue';

const UserInfo = ({ user, canEdit }) => {
    const { name, id, email, url, countMessages, totalLikesNum } = user;

    return (
        <div className='profile-header'>
            <div className='profile-cover' style={{ 'background-image': 'url(http://localhost:5000/static-header-image-0.jpg)' }}></div>
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
