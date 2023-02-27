import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './MessageList.css';
import MessagePost from '../../components/messagePost/messagePost';
import useMessages from '../../hooks/useMessages.js';

const MessageList = () => {
    const [pageNum, setPageNum] = useState(1);
    const { isAuth, user } = useSelector(state => state)
    const limit = 20;
    const { messagesArray } = useMessages(pageNum, limit)

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
