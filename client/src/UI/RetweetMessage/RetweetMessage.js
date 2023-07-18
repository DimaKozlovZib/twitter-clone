import React from 'react';
import './RetweetMessage.css';
import UserAvatar from '../UserAvatar/UserAvatar';
import { Link } from 'react-router-dom';

const RetweetMessage = ({ retweetMessage }) => {
    const { user, text, id } = retweetMessage;
    const { img, name, email } = user;

    return (
        <div className='RetweetMessage' >
            <div className='RetweetMessage_user-information'>
                <div className='user-image'>
                    <UserAvatar url={img} id={user.id}></UserAvatar>
                </div>
                <div className='user-info'>
                    <div className='user-name'>
                        {name}
                    </div>
                    <div className='user-email'>
                        @{email.match(/^([^@]+)/)[0]}
                    </div>
                </div>
            </div>
            <div className='message-info'>
                <div className='message-text'>
                    <p>{text}</p>
                </div>
            </div>
            {retweetMessage?.hashtags ? (
                <div className='hashtags'>
                    {
                        retweetMessage?.hashtags.map(({ id, name }) =>
                            <Link to={`/twitter-clone/hashtag/${name}`} key={id}>{`#${name}`}</Link>)
                    }
                </div>
            ) : <></>}
        </div >
    );
}

export default RetweetMessage;
