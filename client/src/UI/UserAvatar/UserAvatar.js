import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import './UserAvatar.css';
import nullAvatar from '../../images/nullAvatar.jpg';
import { REACT_STATIC_URL } from '../../API/constants';
import { NavigatePath, userInfoPath } from '../../routes';


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
            <img onDragStart={(e) => e.preventDefault()}
                src={url ? `${REACT_STATIC_URL}/${url}` : nullAvatar} alt="" />
        </div>
    )

    return (
        isNotLink ?
            Avatar
            : <Link to={NavigatePath(userInfoPath(id))}>{Avatar}</Link >
    );
})

export default UserAvatar;