import React, { useState } from 'react';
import './RewiewsMessage.css'
import { likeMessage } from '../../API/messagesApi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setDataAction } from '../../store';
import { useEffect } from 'react';
import { NavigatePath, addRetweetPath, messagePath } from '../../routes';

const RewiewsMessage = ({ data }) => {
    const userId = useSelector(state => state.user.id)
    const isAuth = useSelector(state => state.isAuth)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { commentsCount, retweetCount, likes, likesNum, messageData } = data;
    const { id } = messageData;

    const [likesNumState, setLikesNumState] = useState(likesNum);
    const isLikedByUser = likes && likes.some(like => like.userId === userId && like.messageId === id);
    const [activeLikeClass, setActiveLikeClass] = useState(likes ? isLikedByUser ? 'active' : '' : null);

    useEffect(() => {
        if (!likesNumState && likesNumState !== 0) {
            setLikesNumState(likesNum)
        }
        if (activeLikeClass === null) {
            const isLikedByUser = likes && likes.some(like => like.userId === userId && like.messageId === id);
            setActiveLikeClass(isLikedByUser ? 'active' : '')
        }
    }, [likes]);

    const postLike = async () => {
        if (!isAuth) return;

        const res = await likeMessage(id);

        if (res?.status === 200) {
            setActiveLikeClass(!res.data.likeIsActive ? '' : 'active')
            setLikesNumState(res.data.likesNum)
        }
    }

    const openAddRetweetPage = () => {
        if (!isAuth) return;

        dispatch(setDataAction(messageData))
        navigate(NavigatePath(addRetweetPath(id)))
    }

    const openMessageComments = () => {
        navigate(NavigatePath(messagePath(id)))
    }

    return (
        <div className='message-rewiews'>
            <button className='comments' onClick={openMessageComments}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 7H14.2M7 11.8H11.2M20.2 10.6C20.2 11.98 19.9088 13.292 19.3845 14.478L20.2018 20.1991L15.2989 18.9734C13.9099 19.7545 12.307 20.2 10.6 20.2C5.29807 20.2 1 15.9019 1 10.6C1 5.29807 5.29807 1 10.6 1C15.9019 1 20.2 5.29807 20.2 10.6Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h5>{commentsCount}</h5>
            </button>
            <button className='retweets' onClick={openAddRetweetPage}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill='none' xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.81605 20.5999L1.3999 16.9999M1.3999 16.9999L4.81605 13.3999M1.3999 16.9999H18.1999C19.5254 16.9999 20.5999 15.9254 20.5999 14.5999V10.9999M17.1838 1.3999L20.5999 4.9999M20.5999 4.9999L17.1838 8.5999M20.5999 4.9999L3.7999 4.9999C2.47442 4.9999 1.3999 6.07442 1.3999 7.3999L1.3999 10.9999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h5>{retweetCount}</h5>
            </button>
            <button className={`likes ${activeLikeClass}`} onClick={postLike}>
                <svg width="20" height="18" viewBox="0 0 20 18" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.31804 2.31804C1.90017 2.7359 1.5687 3.23198 1.34255 3.77795C1.1164 4.32392 1 4.90909 1 5.50004C1 6.09099 1.1164 6.67616 1.34255 7.22213C1.5687 7.7681 1.90017 8.26417 2.31804 8.68204L10 16.364L17.682 8.68204C18.526 7.83812 19.0001 6.69352 19.0001 5.50004C19.0001 4.30656 18.526 3.16196 17.682 2.31804C16.8381 1.47412 15.6935 1.00001 14.5 1.00001C13.3066 1.00001 12.162 1.47412 11.318 2.31804L10 3.63604L8.68204 2.31804C8.26417 1.90017 7.7681 1.5687 7.22213 1.34255C6.67616 1.1164 6.09099 1 5.50004 1C4.90909 1 4.32392 1.1164 3.77795 1.34255C3.23198 1.5687 2.7359 1.90017 2.31804 2.31804V2.31804Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill='none' />
                </svg>
                <h5>{likesNumState}</h5>
            </button>
        </div>
    );
}

export default RewiewsMessage;
