import React, { useEffect, useState } from 'react';
import './MessageList.css';
import MessagePost from '../../components/messagePost/messagePost';
import useMessages from '../../hooks/useMessages.js';

const MessageList = () => {
    const [pageNum, setPageNum] = useState(1);
    const limit = 20;
    const [messagesArray, setMessagesArray] = useMessages(pageNum, limit)
    const [succesDeleteId, setSuccesDeleteId] = useState(null);

    useEffect(() => {
        if (succesDeleteId) {
            setMessagesArray(messagesArray.filter(item => item.id !== succesDeleteId))
        }
    }, [succesDeleteId]);

    return (
        <div className='messagesList'>
            {
                messagesArray && messagesArray.length > 0 ?
                    messagesArray
                        .map(item => <MessagePost setDelete={setSuccesDeleteId} messageObject={item} key={item.id} />)
                    : ''
            }
        </div>
    );
}

export default MessageList;
