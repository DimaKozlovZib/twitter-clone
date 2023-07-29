import React, { useEffect, useRef, useState } from 'react';
import { messageShown } from './API';
import UserAvatar from '../../UI/UserAvatar/UserAvatar';
import "./messagePost.css";
import { Link, useNavigate } from 'react-router-dom';
import SlimBurgerMenu from '../../UI/SlimBurgerMenu/SlimBurgerMenu';
import useModal from '../../hooks/useModal';
import { useSelector } from 'react-redux';
import RetweetMessage from '../../UI/RetweetMessage/RetweetMessage';
import { likeMessage } from '../../API/messagesApi';

const MessagePost = ({ messageObject, setDelete }) => {
    const { user, text, likesNum, id, likes, hashtags, retweet, retweetId, retweetCount, commentsCount } = messageObject;
    const { img, name, email } = user;

    const userId = useSelector(state => state.user.id)
    const isAuth = useSelector(state => state.isAuth)

    const navigate = useNavigate()
    const mesageElement = useRef();

    const [likesNumState, setLikesNumState] = useState(likesNum);
    const [hiddenMenu, setHiddenMenu] = useState(false);

    const menu = useRef();

    const [openModal] = useModal('DELETE_MESSAGE-MODAL', null, { setDelete, id })
    const [openModalToWriteMess] = useModal('RETWEET-MODAL', null, { user, text, id })

    const isLikedByUser = likes && likes.some(like => like.userId === userId && like.messageId === id);

    const [activeLikeClass, setActiveLikeClass] = useState(isLikedByUser ? 'active' : '');

    const postLike = async () => {
        if (!isAuth) return false;

        const res = await likeMessage(id);

        if (res?.status === 200) {
            setActiveLikeClass(!res.data.likeIsActive ? '' : 'active')
            setLikesNumState(res.data.likesNum)
        }
    }

    const closeOnClickWrapper = (e) => {
        if (e.target === menu.current || e.target.className === 'SlimBurgerMenu') return;
        setHiddenMenu(false)
    }

    useEffect(() => {
        window.addEventListener('click', closeOnClickWrapper)
        return () => window.removeEventListener('click', closeOnClickWrapper)
    }, []);

    const openMenu = (e) => {
        stopDefault(e)
        setHiddenMenu(true)
    }

    const openModalToDelete = (e) => {
        stopDefault(e)
        setHiddenMenu(false)
        openModal()
    }

    const retweetMessage = () => { if (isAuth) openModalToWriteMess() }

    const stopDefault = (e) => {
        e.stopPropagation();
        e.preventDefault();
    }

    const openMessageComments = () => {
        navigate(`/twitter-clone/message/${id}`)
    }

    useEffect(() => {
        const callback = (entries, observer) => {
            entries.forEach(async (entry) => {
                // Текст блока полностью видим на экране
                if (entry.intersectionRatio !== 1 || !isAuth) return;

                const res = await messageShown(id)

                // Остановка отслеживания после первого срабатывания
                observer.unobserve(entry.target);
            })
        };
        const observer = new IntersectionObserver(callback, {
            threshold: 1,
        });

        observer.observe(mesageElement.current);
    }, []);


    return (
        <div className='messagePost' ref={mesageElement}>
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
                    {(userId === user.id) && <SlimBurgerMenu onClickFunc={openMenu} />}
                </div>

                <div className='message-info'>
                    <div className='message-text'>
                        <p>{text}</p>
                    </div>
                    {retweetId ? <RetweetMessage retweetMessage={retweet} /> : <></>}
                </div>

                <div className='hashtags'>
                    {
                        hashtags.map(({ id, name }) =>
                            <Link to={`/twitter-clone/hashtag/${name}`} key={id}>{`#${name}`}</Link>)
                    }
                </div>

                <div className='message-rewiews'>
                    <button className='comments' onClick={openMessageComments}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.0001 9H7.00011C6.73489 9 6.48054 9.10536 6.293 9.29289C6.10547 9.48043 6.00011 9.73478 6.00011 10C6.00011 10.2652 6.10547 10.5196 6.293 10.7071C6.48054 10.8946 6.73489 11 7.00011 11H17.0001C17.2653 11 17.5197 10.8946 17.7072 10.7071C17.8948 10.5196 18.0001 10.2652 18.0001 10C18.0001 9.73478 17.8948 9.48043 17.7072 9.29289C17.5197 9.10536 17.2653 9 17.0001 9ZM13.0001 13H7.00011C6.73489 13 6.48054 13.1054 6.293 13.2929C6.10547 13.4804 6.00011 13.7348 6.00011 14C6.00011 14.2652 6.10547 14.5196 6.293 14.7071C6.48054 14.8946 6.73489 15 7.00011 15H13.0001C13.2653 15 13.5197 14.8946 13.7072 14.7071C13.8948 14.5196 14.0001 14.2652 14.0001 14C14.0001 13.7348 13.8948 13.4804 13.7072 13.2929C13.5197 13.1054 13.2653 13 13.0001 13ZM12.0001 2C10.6869 2 9.38653 2.25866 8.17328 2.7612C6.96002 3.26375 5.85763 4.00035 4.92904 4.92893C3.05368 6.8043 2.00011 9.34784 2.00011 12C1.99137 14.3091 2.7909 16.5485 4.26011 18.33L2.26011 20.33C2.12135 20.4706 2.02736 20.6492 1.98998 20.8432C1.95261 21.0372 1.97353 21.2379 2.05011 21.42C2.13317 21.5999 2.26781 21.7511 2.43696 21.8544C2.6061 21.9577 2.80211 22.0083 3.00011 22H12.0001C14.6523 22 17.1958 20.9464 19.0712 19.0711C20.9465 17.1957 22.0001 14.6522 22.0001 12C22.0001 9.34784 20.9465 6.8043 19.0712 4.92893C17.1958 3.05357 14.6523 2 12.0001 2ZM12.0001 20H5.41011L6.34011 19.07C6.52636 18.8826 6.6309 18.6292 6.6309 18.365C6.6309 18.1008 6.52636 17.8474 6.34011 17.66C5.0307 16.352 4.21528 14.6305 4.0328 12.7888C3.85032 10.947 4.31205 9.09901 5.33934 7.55952C6.36662 6.02004 7.8959 4.88436 9.66663 4.34597C11.4374 3.80759 13.34 3.8998 15.0503 4.60691C16.7607 5.31402 18.173 6.59227 19.0465 8.22389C19.9201 9.85551 20.201 11.7395 19.8412 13.555C19.4815 15.3705 18.5034 17.005 17.0736 18.1802C15.6439 19.3554 13.8509 19.9985 12.0001 20Z" stroke='none' />
                        </svg>
                        <h5>{commentsCount}</h5>
                    </button>
                    <button className='retweets' onClick={retweetMessage}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 7.75H11C13.1217 7.75 15.1566 8.69821 16.6569 10.386C18.1571 12.0739 19 14.3631 19 16.75V19M1 7.75L7 14.5M1 7.75L7 1" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill='none' />
                        </svg>
                        <h5>{retweetCount}</h5>
                    </button>
                    <button className={`likes ${activeLikeClass}`} onClick={postLike}>
                        <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.31804 2.31804C1.90017 2.7359 1.5687 3.23198 1.34255 3.77795C1.1164 4.32392 1 4.90909 1 5.50004C1 6.09099 1.1164 6.67616 1.34255 7.22213C1.5687 7.7681 1.90017 8.26417 2.31804 8.68204L10 16.364L17.682 8.68204C18.526 7.83812 19.0001 6.69352 19.0001 5.50004C19.0001 4.30656 18.526 3.16196 17.682 2.31804C16.8381 1.47412 15.6935 1.00001 14.5 1.00001C13.3066 1.00001 12.162 1.47412 11.318 2.31804L10 3.63604L8.68204 2.31804C8.26417 1.90017 7.7681 1.5687 7.22213 1.34255C6.67616 1.1164 6.09099 1 5.50004 1C4.90909 1 4.32392 1.1164 3.77795 1.34255C3.23198 1.5687 2.7359 1.90017 2.31804 2.31804V2.31804Z" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill='none' />
                        </svg>
                        <h5>{likesNumState}</h5>
                    </button>
                </div>

                {(userId === user.id) && (<div className={`hiddenMenu ${hiddenMenu && 'active'}`} ref={menu} onClick={stopDefault}>
                    <div className='hiddenMenu-item delete' onClick={openModalToDelete}>
                        <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.25 4.11111L11.5997 13.5549C11.5728 13.9473 11.4035 14.3146 11.1258 14.5828C10.8482 14.8509 10.4829 15 10.1035 15H3.8965C3.5171 15 3.1518 14.8509 2.87416 14.5828C2.59653 14.3146 2.42719 13.9473 2.40025 13.5549L1.75 4.11111M5.5 7.22222V11.8889M8.5 7.22222V11.8889M9.25 4.11111V1.77778C9.25 1.5715 9.17098 1.37367 9.03033 1.22781C8.88968 1.08194 8.69891 1 8.5 1H5.5C5.30109 1 5.11032 1.08194 4.96967 1.22781C4.82902 1.37367 4.75 1.5715 4.75 1.77778V4.11111M1 4.11111H13" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <h5>удалить</h5>
                    </div>
                </div>)}
            </div>
        </div >
    );
}

export default MessagePost;
