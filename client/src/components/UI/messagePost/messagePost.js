import React, { useState } from 'react';
import { likeMessage } from '../../../API/messagesApi';
import UserAvatar from '../UserAvatar/UserAvatar';
import "./messagePost.css";

const MessagePost = ({ messageObject, isAuth, userId }) => {
    const { user, text, likesNum, id, likes } = messageObject;
    const { img, name, email } = user;
    const [likesNumState, setLikesNumState] = useState(likesNum);

    const condition = likes && likes.length !== 0 && likes[0].userId === userId && likes[0].messageId === id;

    const [activeLikeClass, setActiveLikeClass] = useState(condition ? 'active' : '');

    const postLike = async () => {
        if (isAuth) {
            const type = activeLikeClass === 'active' ? 'delete' : 'add';
            const res = await likeMessage(type, id);

            if (res && res.status === 200) {
                setActiveLikeClass(!res.data.likeIsActive ? '' : 'active')
                setLikesNumState(res.data.likeIsActive ? likesNumState + 1 : likesNumState - 1)
            }
        }
    }

    return (
        <div className='messagePost'>
            <div className='user-image'>
                <UserAvatar url={img} id={user.id}></UserAvatar>
            </div>
            <div className='message-contant'>
                <div className='user-info'>
                    <div className='user-name'>
                        {name}
                    </div>
                    <div className='user-email'>
                        @{email.match(/^([^@]+)/)[0]}
                    </div>
                </div>
                <div className='message-info'>
                    <div className='message-text'>
                        <p>{text}</p>
                    </div>
                </div>
                <div className='message-rewiews'>
                    <button className={`likes ${activeLikeClass}`} onClick={postLike}>
                        <svg className='svg' width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.31804 2.31804C1.90017 2.7359 1.5687 3.23198 1.34255 3.77795C1.1164 4.32392 1 4.90909 1 5.50004C1 6.09099 1.1164 6.67616 1.34255 7.22213C1.5687 7.7681 1.90017 8.26417 2.31804 8.68204L10 16.364L17.682 8.68204C18.526 7.83812 19.0001 6.69352 19.0001 5.50004C19.0001 4.30656 18.526 3.16196 17.682 2.31804C16.8381 1.47412 15.6935 1.00001 14.5 1.00001C13.3066 1.00001 12.162 1.47412 11.318 2.31804L10 3.63604L8.68204 2.31804C8.26417 1.90017 7.7681 1.5687 7.22213 1.34255C6.67616 1.1164 6.09099 1 5.50004 1C4.90909 1 4.32392 1.1164 3.77795 1.34255C3.23198 1.5687 2.7359 1.90017 2.31804 2.31804V2.31804Z" stroke="black" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <h5>{likesNumState}</h5>
                    </button>
                </div>
            </div>
        </div >
    );
}

export default MessagePost;
