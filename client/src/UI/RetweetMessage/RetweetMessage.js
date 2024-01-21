import React from 'react';
import './RetweetMessage.css';
import UserAvatar from '../UserAvatar/UserAvatar';
import TextMessageContent from '../TextMessageContent/TextMessageContent';
import ImageMessageContent from '../ImageMessageContent/ImageMessageContent';

const RetweetMessage = ({ retweetMessage }) => {
    const { user, text, id, hashtags, media } = retweetMessage;
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
                <TextMessageContent originalText={text} hashtags={hashtags} />
                <ImageMessageContent messageData={{ media }} />
            </div>
        </div >
    );
}

export default RetweetMessage;
