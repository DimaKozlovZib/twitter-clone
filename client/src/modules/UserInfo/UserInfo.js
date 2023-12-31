import React, { useEffect, useState } from 'react';
import UserAvatar from '../../UI/UserAvatar/UserAvatar';
import './UserInfo.css';
import useModal from '../../hooks/useModal';
import { useSelector } from 'react-redux';
import { Subscribe, Unsubscribe, getMessages, getUser } from './API'
import { Link, useParams } from 'react-router-dom';
import '../../styles/changeCover.css';
import { editPath } from '../../routes';
import ButtonBlue from '../../UI/ButtonBlue/ButtonBlue';
import MessagePost from '../../components/messagePost/messagePost';

const UserInfo = () => {
    const { userId } = useParams();
    const userAuthCover = useSelector(state => state.user.coverImage);
    const isAuth = useSelector(state => state.isAuth);

    const [openModal] = useModal('ADD_COVER-MODAL')

    const [user, setUser] = useState({});
    const [infoStatus, setInfoStatus] = useState('loaded');
    const [canEdit, setCanEdit] = useState(null);
    const [friends, setFriends] = useState(null);
    const [messagesArray, setMessagesArray] = useState([]);
    const [page, setPage] = useState(0);
    const [succesDeleteId, setSuccesDeleteId] = useState(null);
    const limit = 20;
    //удаление сообщения
    useEffect(() => {
        if (succesDeleteId) {
            setMessagesArray(messagesArray.filter(item => item.id !== succesDeleteId))
        }
    }, [succesDeleteId]);

    //получение данных
    useEffect(() => {
        const getData = async () => {
            if (isAuth !== null) {
                const userInfo = await getUser(userId, isAuth);
                setUser(userInfo.data.user)
                setCanEdit(userInfo.data.canEdit)
                setInfoStatus('sucsses')
                setFriends(userInfo.data.user?.friends?.length > 0 ? true : false)
            }
        }
        getData()
        if (isAuth !== null && messagesArray.length === 0) {
            getUserMessages()
        }
    }, [isAuth, userId]);

    const getUserMessages = async () => {
        try {
            const res = await getMessages(userId, limit, page)
            if (res) {
                setMessagesArray([...messagesArray, ...res.data])
                setPage(page += 1)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const { name, email, img, countMessages, totalLikesNum, coverImage } = user;

    const onSubscribe = async () => {
        const res = await Subscribe(user.id)
        if (res) {
            setFriends(true)
        }
    }

    const onUnsubscribe = async () => {
        const res = await Unsubscribe(user.id)
        if (res) {
            setFriends(false)
        }
    }

    const changeCoverBtn = (
        <button className='edit-cover' onClick={openModal}>
            <span className='edit-cover__icon'>
                <svg width="18" height="19" viewBox="0 0 18 19" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 15.248V18.9975H3.74948L14.8079 7.93903L11.0585 4.18955L0 15.248ZM17.7075 5.03944C18.0975 4.64949 18.0975 4.01958 17.7075 3.62963L15.3679 1.28996C14.9779 0.900011 14.348 0.900011 13.9581 1.28996L12.1283 3.1197L15.8778 6.86918L17.7075 5.03944Z" />
                </svg>
            </span>
            <span className='edit-cover__title'>изменить обложку</span>
        </button>
    )

    const editBtnHTML = (
        <ButtonBlue>
            <Link to={`/${editPath}`}>Редактировать</Link>
        </ButtonBlue>
    )

    const subscribeBtn = (
        <ButtonBlue className='subscribe-button' onClick={onSubscribe}>
            <h5>Подписаться</h5>
        </ButtonBlue>
    )

    const alreadySubscribeBtn = (
        <ButtonBlue className='subscribe-already-button' onClick={onUnsubscribe}>
            <h5>Вы подписаны</h5>
        </ButtonBlue>
    )

    const classGenerate = (commonClass) => `${commonClass} ${infoStatus}`;
    //{classGenerate()}

    return (
        <>
            <div className='userInfo-wrapper profile-header'>
                <div className={classGenerate('profile-cover')}
                    style={{ 'backgroundImage': `url(http://localhost:5000/${canEdit && userAuthCover ? userAuthCover : coverImage})` }}>
                    {!canEdit || changeCoverBtn}
                </div>
                <div className='userInfo'>
                    <div className='userInfo__avatar'>
                        <UserAvatar isNotLink url={img} />
                    </div>
                    <div className='info-about-user'>
                        <h2 className={classGenerate('user-name')}>{name}</h2>
                        <h3 className={classGenerate('user-email')}>{email}</h3>
                    </div>
                    {canEdit ? editBtnHTML : friends !== null && (friends ? alreadySubscribeBtn : subscribeBtn)}
                </div>
            </div>
            <div className='userMessagesList'>
                {
                    messagesArray && messagesArray.length > 0 ?
                        messagesArray
                            .map(item => <MessagePost setDelete={setSuccesDeleteId} messageObject={item} key={item.id} />)
                        : ''
                }
            </div>
        </>

    );
}

export default UserInfo;
