import React, { memo, useEffect, useRef, useState } from 'react';
import UserAvatar from '../../UI/UserAvatar/UserAvatar';
import "./messagePost.css";
import SlimBurgerMenu from '../../UI/SlimBurgerMenu/SlimBurgerMenu';
import useModal from '../../hooks/useModal';
import { useSelector } from 'react-redux';
import RetweetMessage from '../../UI/RetweetMessage/RetweetMessage';
import RewiewsMessage from '../../UI/RewiewsMessage/RewiewsMessage';
import TextMessageContent from '../../UI/TextMessageContent/TextMessageContent';
import ImageMessageContent from '../../UI/ImageMessageContent/ImageMessageContent';
import MessageMenu from '../../UI/MessageMenu/MessageMenu';

const MessagePost = memo(({ messageObject, setDelete, addViewedMessage }) => {
    const { user, text, likesNum, id, likes, hashtags, retweet, retweetId, retweetCount, commentsCount, media } = messageObject;
    const { img, name, email } = user;

    const userId = useSelector(state => state.user.id)
    const isAuth = useSelector(state => state.isAuth)

    const mesageElement = useRef();

    const [hiddenMenu, setHiddenMenu] = useState(false);

    const menu = useRef();

    const [openModal] = useModal('DELETE_MESSAGE-MODAL', null, { setDelete, id })

    const closeOnClickWrapper = (e) => {
        if (e.target === menu.current || e.target.className === 'SlimBurgerMenu') return;
        setHiddenMenu(false)
    }

    useEffect(() => {
        window.addEventListener('click', closeOnClickWrapper)
        return () => window.removeEventListener('click', closeOnClickWrapper)
    }, []);

    const changeMenuStatus = (e) => {
        stopDefault(e)
        setHiddenMenu(hiddenMenu ? false : true)
    }

    const openModalToDelete = (e) => {
        stopDefault(e)
        setHiddenMenu(false)
        openModal()
    }

    const stopDefault = (e) => {
        e.stopPropagation();
        e.preventDefault();
    }

    useEffect(() => {
        if (userId === user.Id) return

        const callback = (entries, observer) => {
            entries.forEach(async (entry) => {
                // Текст блока полностью видим на экране
                if (entry.intersectionRatio !== 1 || !isAuth || userId === user.id) return;

                addViewedMessage(id)

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
    const data = {
        commentsCount, retweetCount, likes, likesNum,
        messageData: { user, text, id, media, hashtags, retweet: null }
    }
    // события для меню твита
    const clickEvents = {
        OnDelete: openModalToDelete
    }

    return (
        <article className='messagePost' ref={mesageElement}>
            <div className='user-image computer'>
                <UserAvatar url={img} id={user.id}></UserAvatar>
            </div>
            <div className='message-contant'>
                <div className='user-info'>
                    <div className='user-image mobile'>
                        <UserAvatar url={img} id={user.id}></UserAvatar>
                    </div>
                    <div className='user-name'>
                        {name}
                    </div>
                    <div className='user-email'>
                        @{email.match(/^([^@]+)/)[0]}
                    </div>
                    {(userId === user.id) && <>
                        <SlimBurgerMenu onClickFunc={changeMenuStatus} />
                        <MessageMenu isVisible={hiddenMenu} ref={menu} clickEvents={clickEvents} />
                    </>}
                </div>

                <TextMessageContent originalText={text} hashtags={hashtags} />

                <ImageMessageContent messageData={{ media }} />

                {retweetId ? <RetweetMessage retweetMessage={retweet} /> : <></>}

                <RewiewsMessage data={data} />


            </div>
        </article >
    );
})

export default MessagePost;
