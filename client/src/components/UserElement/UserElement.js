import React from 'react';
import { Link } from 'react-router-dom';
import UserAvatar from '../../UI/UserAvatar/UserAvatar';
import './UserElement.css'

const UserElement = ({ user }) => {
    const { id, img, email, name } = user;

    return (
        <div className='UserElement'>
            <Link to={`/twitter-clone/user/${id}`}>
                <UserAvatar isNotLink url={img} />
                <div className='UserElement__info'>
                    <div className='info__name'>
                        <h3>{name}</h3>
                    </div>
                    <div className='info__email'>
                        <h4>{email}</h4>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default UserElement;
