import React, { useEffect, useRef, useState } from 'react';
import { likeMessage } from './API';
import UserAvatar from '../../UI/UserAvatar/UserAvatar';
import "./messagePost.css";
import { Link } from 'react-router-dom';
import SlimBurgerMenu from '../../UI/SlimBurgerMenu/SlimBurgerMenu';
import useModal from '../../hooks/useModal';
import { useSelector } from 'react-redux';

const MessagePost = ({ messageObject, setDelete }) => {
    const { user, text, likesNum, id, likes, hashtags } = messageObject;
    const { img, name, email } = user;

    const userId = useSelector(state => state.user.id)
    const isAuth = useSelector(state => state.isAuth)

    const [likesNumState, setLikesNumState] = useState(likesNum);
    const [hiddenMenu, setHiddenMenu] = useState(false);
    const menu = useRef();
    const [openModal] = useModal('DELETE_MESSAGE-MODAL', null, { setDelete, id: messageObject.id })

    const condition = likes && likes.length !== 0 && likes[0].userId === userId && likes[0].messageId === id;

    const [activeLikeClass, setActiveLikeClass] = useState(condition ? 'active' : '');

    const postLike = async () => {
        if (!isAuth) return false;

        const res = await likeMessage(id);

        if (res && res.status === 200) {
            setActiveLikeClass(!res.data.likeIsActive ? '' : 'active')
            setLikesNumState(res.data.likesNum)
        }
    }

    const closeOnClickWrapper = (e) => {
        stopDefault(e)
        if (e.target === menu.current || e.target.className === 'SlimBurgerMenu') return
        setHiddenMenu(false)
    }

    const stopDefault = (e) => {
        e.stopPropagation();
        e.preventDefault();
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
                    {(userId === user.id) && <SlimBurgerMenu onClickFunc={openMenu} />}
                </div>

                <div className='message-info'>
                    <div className='message-text'>
                        <p>{text}</p>
                    </div>
                </div>

                <div className='hashtags'>
                    {
                        hashtags.map(({ id, name }) =>
                            <Link to={`/twitter-clone/hashtag/${name}`} key={id}>{`#${name}`}</Link>)
                    }
                </div>

                <div className='message-rewiews'>
                    <button className={`likes ${activeLikeClass}`} onClick={postLike}>
                        <svg className='svg' width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.31804 2.31804C1.90017 2.7359 1.5687 3.23198 1.34255 3.77795C1.1164 4.32392 1 4.90909 1 5.50004C1 6.09099 1.1164 6.67616 1.34255 7.22213C1.5687 7.7681 1.90017 8.26417 2.31804 8.68204L10 16.364L17.682 8.68204C18.526 7.83812 19.0001 6.69352 19.0001 5.50004C19.0001 4.30656 18.526 3.16196 17.682 2.31804C16.8381 1.47412 15.6935 1.00001 14.5 1.00001C13.3066 1.00001 12.162 1.47412 11.318 2.31804L10 3.63604L8.68204 2.31804C8.26417 1.90017 7.7681 1.5687 7.22213 1.34255C6.67616 1.1164 6.09099 1 5.50004 1C4.90909 1 4.32392 1.1164 3.77795 1.34255C3.23198 1.5687 2.7359 1.90017 2.31804 2.31804V2.31804Z" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
