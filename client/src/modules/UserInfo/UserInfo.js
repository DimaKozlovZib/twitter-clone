import React, { useEffect, useState } from 'react';
import UserAvatar from '../../UI/UserAvatar/UserAvatar';
import './UserInfo.css';
import useModal from '../../hooks/useModal';
import { useSelector } from 'react-redux';
import { Subscribe, Unsubscribe, getMessages, getUser } from './API'
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../../styles/changeCover.css';
import { addMessagePath, editPath } from '../../routes';
import ButtonBlue from '../../UI/ButtonBlue/ButtonBlue';
import MessagePost from '../../components/messagePost/messagePost';
import usePage from '../../hooks/usePage';
import LoaderHorizontally from '../../UI/LoaderHorizontally/LoaderHorizontally'

const UserInfo = () => {
    const { userId } = useParams();
    const userAuthCover = useSelector(state => state.user.coverImage);
    const isAuth = useSelector(state => state.isAuth);
    const viewedData = useSelector(state => state.viewedData);

    const [openModal] = useModal('ADD_COVER-MODAL')
    const History = useNavigate()

    const [user, setUser] = useState({});
    const [infoStatus, setInfoStatus] = useState('loaded');
    const [isMessagesLoading, setIsMessagesLoading] = useState(true);

    const [canEdit, setCanEdit] = useState(null);
    const [friends, setFriends] = useState(null);
    const [messagesArray, setMessagesArray] = useState([]);
    const [succesDeleteId, setSuccesDeleteId] = useState(null);
    const limit = 10;

    const [page, setPage, changePageElement, event, deleteEvent] =
        usePage(messagesArray, setMessagesArray, limit, succesDeleteId, setSuccesDeleteId)

    //удаление сообщения
    useEffect(deleteEvent, [succesDeleteId]);

    //получение данных
    useEffect(() => { getData() }, [isAuth, userId]);

    const getData = async () => {
        if (isAuth !== null && user?.id != userId) {
            const userInfo = await getUser(userId, isAuth);
            setUser(userInfo.data.user)
            setCanEdit(userInfo.data.canEdit)
            setInfoStatus('sucsses')
            setFriends(userInfo.data.user?.friends?.length > 0 ? true : false)
            setPage(0)

            if (userInfo.data.user.countMessages > 0) {
                getUserMessages([], 0)
            }
        }
    }

    useEffect(() => {
        if (messagesArray[messagesArray.length - 1]?.page !== page) {
            setIsMessagesLoading(true)
            getUserMessages(messagesArray, page)
        }
    }, [page]);

    const getUserMessages = async (oldArr, pageNum) => {
        try {
            const res = await getMessages(userId, limit, pageNum, viewedData)
            if (res) {
                setMessagesArray([...oldArr, { data: res.data, page: pageNum }])
            }
        } catch (error) {
            console.error(error)
        }
        setIsMessagesLoading(false)
    }

    const { name, email, img, countMessages, totalLikesNum, coverImage, shortInfo } = user;

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
    //смена индекса страницы
    useEffect(event, [changePageElement.current]);

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

    const goToAddMessagePage = () => {
        if (isAuth) return History(`/${addMessagePath}`)
    }

    const noOneMessage = (countMessages && countMessages === 0) && ((isAuth === true && canEdit) ? (
        <div className='noOneMessageTitle'><h4>У вас нет сообщений... Начните писать.</h4></div>
    ) : (
        <div className='noOneMessageTitle'><h4>У пользователя ещё нет сообщений.</h4></div>
    ))

    return (
        <>
            <div className='userInfo-wrapper profile-header'>
                <div className={classGenerate('profile-cover')}
                    style={{ 'backgroundImage': `url(http://localhost:5000/${canEdit && userAuthCover ? userAuthCover : coverImage})` }}>
                    {!canEdit || changeCoverBtn}
                </div>
                <div className='userInfo-insideWrapper'>
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
                    {Boolean(shortInfo) && (<h3 className={classGenerate('user-shortInfo')}>{shortInfo}</h3>)}
                </div>
            </div>

            {(canEdit && isAuth) &&
                (<div className='addMessage'>
                    <div className='title'>
                        <h4>Расскажите что-то новое</h4>
                    </div>
                    <button className='write-message-btn' onClick={goToAddMessagePage}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.414 0.586C15.0389 0.211058 14.5303 0.000427246 14 0.000427246C13.4697 0.000427246 12.9611 0.211058 12.586 0.586L5 8.172V11H7.828L15.414 3.414C15.7889 3.03894 15.9996 2.53033 15.9996 2C15.9996 1.46967 15.7889 0.961056 15.414 0.586Z" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M0 4C0 3.46957 0.210714 2.96086 0.585786 2.58579C0.960859 2.21071 1.46957 2 2 2H6C6.26522 2 6.51957 2.10536 6.70711 2.29289C6.89464 2.48043 7 2.73478 7 3C7 3.26522 6.89464 3.51957 6.70711 3.70711C6.51957 3.89464 6.26522 4 6 4H2V14H12V10C12 9.73478 12.1054 9.48043 12.2929 9.29289C12.4804 9.10536 12.7348 9 13 9C13.2652 9 13.5196 9.10536 13.7071 9.29289C13.8946 9.48043 14 9.73478 14 10V14C14 14.5304 13.7893 15.0391 13.4142 15.4142C13.0391 15.7893 12.5304 16 12 16H2C1.46957 16 0.960859 15.7893 0.585786 15.4142C0.210714 15.0391 0 14.5304 0 14V4Z" />
                        </svg>
                    </button>
                </div>)}

            {messagesArray?.length > 0 ?
                <div className='userMessagesList'>
                    {
                        messagesArray.map(({ page, data }) =>
                            data.map(item => <MessagePost setDelete={(id) =>
                                setSuccesDeleteId([id, page])} messageObject={item} key={item.id} />))
                    }
                    <div className='changePageElement' ref={changePageElement}></div>
                </div> : noOneMessage
            }
            {isMessagesLoading && (<div className='moduleData_loader-wrapper'><LoaderHorizontally /></div>)}
        </>
    );
}

export default UserInfo;
