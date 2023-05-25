import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getHashtag } from './API';
import './HashtagInfo.css'
import { getMessagesByHashtag } from '../../API/messagesApi';
import MessagePost from '../../components/messagePost/messagePost';

const HashtagInfo = () => {
    const params = useParams()
    const isAuth = useSelector(state => state.isAuth)
    const [hashtag, setHashtag] = useState({});
    const [messagesArray, setMessagesArray] = useState([]);
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const limit = 20;
    const [succesDeleteId, setSuccesDeleteId] = useState(null);

    useEffect(() => {
        if (succesDeleteId) {
            setMessagesArray(messagesArray.filter(item => item.id !== succesDeleteId))
        }
    }, [succesDeleteId]);

    useEffect(() => {
        const getHashtagInfo = async () => {
            const response = await getHashtag(params.hashtagId)

            setHashtag(response.data)
        }
        getHashtagInfo()
    }, []);

    const goBack = () => {
        navigate(-1)
    }

    const getData = async (messages) => {

        if (messages.map(i => i.page).includes(page)) return;

        const res = await getMessagesByHashtag(params.hashtagName, {
            userId: params?.userId,
            limit, page
        })

        if (res) {
            if (page === 1) setMessagesArray([{ data: res.data.messages.rows.map(i => i.message), page }])
            setMessagesArray([...messages, { data: res.data.messages.rows.map(i => i.message), page }])
        }
    }

    useEffect(() => {
        if (isAuth !== null) getData(messagesArray)
    }, [page, isAuth]);

    useEffect(() => {
        setMessagesArray([])
        setPage(1);
        if (isAuth !== null) getData([])
    }, [params]);

    return (
        <div className='hashtagList'>
            {
                messagesArray && messagesArray.length > 0 ?
                    messagesArray.reduce((result, item) => [...result, ...item.data], [])
                        .map(item => <MessagePost setDelete={setSuccesDeleteId} messageObject={item} key={item.id} />)
                    : ''
            }
        </div>
    );
}
//<div className='HashtagInfo-info'>
//                <div className='messages-count'>
//                    <img src='' alt='' />
//                    <h5>{hashtag?.countMessages}</h5>
//                </div>
//            </div>


export default HashtagInfo;
