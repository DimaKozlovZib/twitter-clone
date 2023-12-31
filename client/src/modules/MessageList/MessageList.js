import React, { useEffect, useState } from 'react';
import './MessageList.css';
import { messageShown } from './API';
import MessagePost from '../../components/messagePost/messagePost';
import useMessages from '../../hooks/useMessages.js';

const MessageList = () => {
    const [pageNum, setPageNum] = useState(1);
    const limit = 20;
    const [messagesArray, setMessagesArray] = useMessages(pageNum, limit)
    const [succesDeleteId, setSuccesDeleteId] = useState(null);
    const [viewedMessages, setViewedMessages] = useState([]);

    useEffect(() => {
        if (succesDeleteId) {
            setMessagesArray(messagesArray.filter(item => item.id !== succesDeleteId))
        }
    }, [succesDeleteId]);

    const addViewedMessage = (id) => {
        setViewedMessages((oldData) => {
            if (viewedMessages.includes(id)) return;
            return [...oldData, id]
        })
    }

    useEffect(() => {
        const maxElementCount = 5;
        if (viewedMessages.length < maxElementCount) return;

        const f = async () => {
            await messageShown(viewedMessages)
            setViewedMessages([])
        }
        f()
    }, [viewedMessages]);

    return (
        <div className='messagesList'>
            {
                messagesArray && messagesArray.length > 0 ?
                    messagesArray
                        .map(item => <MessagePost addViewedMessage={addViewedMessage}
                            setDelete={setSuccesDeleteId} messageObject={item} key={item.id} />)
                    : ''
            }
        </div>
    );
}

export default MessageList;
