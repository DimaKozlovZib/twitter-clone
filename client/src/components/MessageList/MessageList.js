import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getMessages } from '../../API/messagesApi.js';
import MessagePost from '../UI/messagePost/messagePost';

const MessageList = ({ onlyThisUserId }) => {
    const [pageNum, setPageNum] = useState(1);
    const [messagesList, setMessagesList] = useState([]);
    const { isAuth, user } = useSelector(state => state)

    useEffect(() => {
        async function getData() {
            if (isAuth !== null) {
                const fetchResult = await getMessages({ pageNum, onlyThisUserId, isAuth })
                const messagesLimitList = fetchResult?.data.rows;
                setMessagesList([...messagesList, ...messagesLimitList])
            }
        }
        getData()
    }, [pageNum, isAuth]);

    return (
        <div className='messagesList'>
            {
                messagesList.length > 0 ?
                    messagesList.map(item => <MessagePost userId={user.id} messageObject={item} isAuth={isAuth} key={item.id} />) : ''
            }
        </div>
    );
}

export default MessageList;
