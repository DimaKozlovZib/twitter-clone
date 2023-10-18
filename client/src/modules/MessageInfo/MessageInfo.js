import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import './MessageInfo.css';
import { useParams } from 'react-router-dom';
import { findOneMessage } from './API';
import UserAvatar from '../../UI/UserAvatar/UserAvatar';
import SlimBurgerMenu from '../../UI/SlimBurgerMenu/SlimBurgerMenu';
import RetweetMessage from '../../UI/RetweetMessage/RetweetMessage';
import useModal from '../../hooks/useModal';
import { likeMessage } from '../../API/messagesApi';
import AddCommentForm from '../../components/AddCommentForm/AddCommentForm';
import Comment from '../../UI/Comment/Comment';
import InfoBlock from '../../UI/InfoBlock/InfoBlock';
import RewiewsMessage from '../../UI/RewiewsMessage/RewiewsMessage';
import TextMessageContent from '../../UI/TextMessageContent/TextMessageContent';
import ImageMessageContent from '../../UI/ImageMessageContent/ImageMessageContent';

const MessageInfo = () => {
    const userId = useSelector(state => state.user.id)
    const isAuth = useSelector(state => state.isAuth)

    const [message, setMessage] = useState({});
    const [comments, setComments] = useState([]);
    const [deleteSucces, setDeleteSucces] = useState(null);
    const [newComment, setNewComment] = useState(null);

    const params = useParams()

    const { user, text, likesNum, id, likes, hashtags,
        retweet, retweetId, retweetCount, createdAt, commentsCount, images } = message;

    const isLikedByUser = likes && likes.some(like => like.userId === userId && like.messageId === id);

    const [likesNumState, setLikesNumState] = useState(likesNum);
    const [hiddenMenu, setHiddenMenu] = useState(false);

    const [activeLikeClass, setActiveLikeClass] = useState(isLikedByUser);

    const loadStatus = 'loaded';
    const [infoStatus, setInfoStatus] = useState(loadStatus);

    const menu = useRef();
    const [openModal] = useModal('DELETE_MESSAGE-MODAL', null, { setDelete: setDeleteSucces, id })
    const [openModalToWriteMess] = useModal('RETWEET-MODAL', null, { user, text, id })

    useEffect(() => {
        if (!newComment) return

        setComments([newComment, ...comments])
    }, [newComment]);

    useEffect(() => {
        const mesIdNum = Number(params.id)
        if (!params.id || !mesIdNum) return;
        getData()
    }, []);

    const getData = async () => {
        const response = await findOneMessage(params.id)

        if (response?.status === 200) {
            setInfoStatus('success')
            setMessage(response.data.message)
            setComments(response?.data?.comments?.rows)
        }
    }
    // оценка сообщения лайком

    useEffect(() => {
        const classState = isLikedByUser ? 'active' : '';
        if (!likesNumState && likesNumState !== 0) {
            setLikesNumState(likesNum)
            setActiveLikeClass(classState)
        }
    }, [likesNum, activeLikeClass]);

    const postLike = async () => {
        if (!isAuth) return false;

        const res = await likeMessage(id);

        if (res?.status === 200) {
            setActiveLikeClass(!res.data.likeIsActive ? '' : 'active')
            setLikesNumState(res.data.likesNum)
        }
    }

    // всплывающее меню \/
    const closeOnClickWrapper = (e) => {
        stopDefault(e)
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

    //модальные окна (удаление и ретвит)
    const openModalToDelete = (e) => {
        setHiddenMenu(false)
        openModal()
    }

    const retweetMessage = () => { if (isAuth) openModalToWriteMess() }

    const stopDefault = (e) => {
        e.stopPropagation();
        e.preventDefault();
    }

    const classGenerate = (commonClass) => `${commonClass} ${infoStatus}`;

    const dateCreated = id ? createdAt.match(/\d+/g).slice(0, -2).reverse() : '';


    // rewiews props objects
    const events = {
        comments: {
            onClick: null
        }, retweets: {
            onClick: retweetMessage
        }, likes: {
            onClick: postLike
        }
    }

    const data = {
        commentsCount, retweetCount, likesNumState, activeLikeClass: activeLikeClass ? 'active' : ''
    }

    return (
        <>
            <div className='MessageInfo'>
                <div className='user-info'>
                    <div className='user-image'>
                        <UserAvatar url={user?.img} id={user?.id}></UserAvatar>
                    </div>
                    <div className='user-box'>
                        <div className={classGenerate('user-name')}>
                            {user?.name}
                        </div>
                        <div className={classGenerate('user-email')}>
                            {user && '@' + user?.email.match(/^([^@]+)/)[0]}
                        </div>
                    </div>

                    {(userId === user?.id) && <SlimBurgerMenu onClickFunc={openMenu} />}
                </div>
                <div className='message-contant'>
                    <div className='message-info'>
                        <div className={classGenerate('message-text')}>
                            {text && <TextMessageContent originalText={text} hashtags={hashtags} />}
                        </div>

                        <ImageMessageContent images={images} />

                        {retweetId ? <RetweetMessage retweetMessage={retweet} /> : <></>}
                    </div>

                    <div className={classGenerate('dateOfCreate')}>
                        <h6>{user &&
                            `${dateCreated[1]}:${dateCreated[0]} · ${dateCreated[2]}/${dateCreated[3]}/${dateCreated[4]}`}</h6>
                        {/*hour:min · day/month/year*/}
                    </div>
                    <RewiewsMessage events={events} data={data} />
                    {(userId === user?.id) && (<div className={`hiddenMenu ${hiddenMenu && 'active'}`} ref={menu} onClick={stopDefault}>
                        <div className='hiddenMenu-item delete' onClick={openModalToDelete}>
                            <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.25 4.11111L11.5997 13.5549C11.5728 13.9473 11.4035 14.3146 11.1258 14.5828C10.8482 14.8509 10.4829 15 10.1035 15H3.8965C3.5171 15 3.1518 14.8509 2.87416 14.5828C2.59653 14.3146 2.42719 13.9473 2.40025 13.5549L1.75 4.11111M5.5 7.22222V11.8889M8.5 7.22222V11.8889M9.25 4.11111V1.77778C9.25 1.5715 9.17098 1.37367 9.03033 1.22781C8.88968 1.08194 8.69891 1 8.5 1H5.5C5.30109 1 5.11032 1.08194 4.96967 1.22781C4.82902 1.37367 4.75 1.5715 4.75 1.77778V4.11111M1 4.11111H13" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <h5>удалить</h5>
                        </div>
                    </div>)}
                </div>
            </div >
            {isAuth && <AddCommentForm messageId={id} setNewComment={setNewComment} />}
            {comments?.length > 0 && comments.map(item => <Comment CommentMessage={item} key={item?.id} />)}
            {comments?.length === 0 &&
                <InfoBlock childerenAuth={(<p>Тут ещё нету комментариев. Напишите первый!</p>)}
                    childerenNotAuth={(<p>Тут ещё нету комментариев.</p>)}
                />}
        </>
    );
}

export default MessageInfo;
