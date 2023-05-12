import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import './UserAvatar.css';
import nullAvatar from '../../images/nullAvatar.jpg';


const UserAvatar = memo(({ url, id, isNotLink, ...events }) => {
    const EventObj = {
        onFocus: events.onFocus,
        onClick: events.onClick,
        onMouseLeave: events.onMouseLeave,
        onBlur: events.onBlur,
        onMouseEnter: events.onMouseEnter
    }

    const Avatar = (
        <div className='UserAvatar avatar'  {...EventObj}>
            <img src={url ? `http://localhost:5000/${url}` : nullAvatar} alt="" />
        </div>
    )

    return (
        isNotLink ?
            Avatar
            : <Link to={`/twitter-clone/user/${id}`}>{Avatar}</Link >
    );
})

export default UserAvatar;