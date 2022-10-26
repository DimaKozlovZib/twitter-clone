import React, { useEffect, useState } from 'react';
import { getMessages } from '../../API/getMessages';
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


    console.log(messagesList)
    return (
        <div>
            {
                messagesList.length > 0 ? <><MessagePost messageObject={messagesList[2]} /></> : ''
            }
        </div>
    );
}

export default MessageList;
