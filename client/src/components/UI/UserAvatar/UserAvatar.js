import React from 'react';
import { Link } from 'react-router-dom';
import './UserAvatar.css';
import avatar from '../../../images/avatar.svg'

const UserAvatar = ({ url, id, isLink }) => {
    const commonAvatar = (
        <div className='UserAvatar'>
            <img src={url} alt="" />
        </div>
    )
    const nullAvatar = (
        <div className='NullAvatar'>
            <img src={avatar} />
        </div>
    )

    return (
        isLink !== false ?
            <Link to={`/twitter-clone/user/${id}`}>{url ? commonAvatar : nullAvatar}</Link >
            : url ? commonAvatar : nullAvatar
    );
}

export default UserAvatar;