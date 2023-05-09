import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import './UserAvatar.css';
import avatar from '../../images/avatar.svg';

const UserAvatar = memo(({ url, id, isNotLink, ...events }) => {
    const EventObj = {
        onFocus: events.onFocus,
        onClick: events.onClick,
        onMouseLeave: events.onMouseLeave,
        onBlur: events.onBlur,
        onMouseEnter: events.onMouseEnter
    }

    const commonAvatar = (
        <div className='UserAvatar avatar'  {...EventObj}>
            <img src={url} alt="" />
        </div>
    )
    const nullAvatar = (
        <div className='NullAvatar avatar' {...EventObj}>
            <img src={avatar} alt='' />
        </div>
    )

    return (
        isNotLink ?
            url ? commonAvatar : nullAvatar
            : <Link to={`/twitter-clone/user/${id}`}>{url ? commonAvatar : nullAvatar}</Link >
    );
})

export default UserAvatar;