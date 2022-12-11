import React, { useEffect, useState } from 'react';
import { getMessages } from '../../API/messagesApi.js';
import MessagePost from '../UI/messagePost/messagePost';

const MessageList = () => {
    const [pageNum, setPageNum] = useState(1);
    const [messagesList, setMessagesList] = useState([]);

    useEffect(() => {
        async function getData() {
            const fetchResult = await getMessages(pageNum)
            const messagesLimitList = fetchResult?.data.rows;
            setMessagesList([...messagesList, ...messagesLimitList])
        }
        getData()
    }, [pageNum]);

    return (
        <div className='messagesList'>
            {
                messagesList.length > 0 ?
                    messagesList.map(item => <MessagePost messageObject={item} alt={item.id} />) : ''
            }
        </div>
    );
}

export default MessageList;
