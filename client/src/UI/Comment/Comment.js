import React from 'react';
import './Comment.css';
import UserAvatar from '../UserAvatar/UserAvatar';

const Comment = ({ CommentMessage }) => {
    const { user, text, id } = CommentMessage;
    const { img, name, email } = user;

    return (
        <div className='CommentMessage' >
            <div className='user-image'>
                <UserAvatar url={img} id={user.id}></UserAvatar>
            </div>
            <div className='message-info'>
                <div className='user-info'>
                    <div className='user-name'>
                        {name}
                    </div>
                    <div className='user-email'>
                        @{email.match(/^([^@]+)/)[0]}
                    </div>
                </div>
                <div className='message-text'>
                    <p>{text}</p>
                </div>
            </div>
        </div >
    );
}

export default Comment;
