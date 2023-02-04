import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getMessages } from '../../API/messagesApi.js';
import MessagePost from '../../components/messagePost/messagePost';
import useMessages from '../../hooks/useMessages.js';

const MessageList = () => {
    const [pageNum, setPageNum] = useState(1);
    const params = useParams();
    const { isAuth, user } = useSelector(state => state)
    const limit = 20;
    const { messagesArray } = useMessages(pageNum, limit, isAuth, params)

    return (
        <div className='messagesList'>
            {
                messagesArray.length > 0 ?
                    messagesArray
                        .map(item => <MessagePost userId={user.id} messageObject={item} isAuth={isAuth} key={item.id} />)
                    : ''
            }
        </div>
    );
}

export default MessageList;
