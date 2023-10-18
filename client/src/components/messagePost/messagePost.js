import React, { useEffect, useRef, useState } from 'react';
import { messageShown } from './API';
import UserAvatar from '../../UI/UserAvatar/UserAvatar';
import "./messagePost.css";
import { useNavigate } from 'react-router-dom';
import SlimBurgerMenu from '../../UI/SlimBurgerMenu/SlimBurgerMenu';
import useModal from '../../hooks/useModal';
import { useSelector } from 'react-redux';
import RetweetMessage from '../../UI/RetweetMessage/RetweetMessage';
import { likeMessage } from '../../API/messagesApi';
import RewiewsMessage from '../../UI/RewiewsMessage/RewiewsMessage';
import TextMessageContent from '../../UI/TextMessageContent/TextMessageContent';
import ImageMessageContent from '../../UI/ImageMessageContent/ImageMessageContent';

const MessagePost = ({ messageObject, setDelete }) => {
    const { user, text, likesNum, id, likes, hashtags, retweet, retweetId, retweetCount, commentsCount, images } = messageObject;
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

    // rewiews props objects
    const events = {
        comments: {
            onClick: openMessageComments
        }, retweets: {
            onClick: retweetMessage
        }, likes: {
            onClick: postLike
        }
    }

    const data = {
        commentsCount, retweetCount, likesNumState, activeLikeClass
    }
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

                <TextMessageContent originalText={text} hashtags={hashtags} />
                {retweetId ? <RetweetMessage retweetMessage={retweet} /> : <></>}

                <ImageMessageContent images={images} />

                <RewiewsMessage events={events} data={data} />

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
