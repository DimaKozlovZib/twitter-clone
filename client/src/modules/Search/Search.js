import React, { memo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { searchHashtags, searchUsers, searchMessages } from './API';
import SeeMoreSearchItems from '../../components/SeeMoreSearchItems/SeeMoreSearchItems';
import UserElement from '../../components/UserElement/UserElement';
import HashtagElement from '../../components/HashtagElement/HashtagElement';
import MessagePost from '../../components/messagePost/messagePost';

const Search = memo(() => {
    const params = useParams();
    const smallRequestLimit = 3;
    const commonRequestLimit = 15;

    const [visibleParams, setVisibleParams] = useState({});

    const [users, setUsers] = useState(null);
    const [hashtags, setHashtags] = useState(null);
    const [messages, setMessages] = useState(null);

    const userDataGet = async (limit) => {
        const userObj = await searchUsers(params.searchText, limit)
        setUsers(userObj)
    }

    const hashtagDataGet = async (limit) => {
        const hashtagObj = await searchHashtags(params.searchText, limit)
        setHashtags(hashtagObj)
    }

    const messageDataGet = async (limit) => {
        const messagesObj = await searchMessages(params.searchText, limit)
        setMessages(messagesObj)
    }

    useEffect(() => {
        if (params.model === visibleParams.model && params.searchText === visibleParams.searchText) return;

        setVisibleParams(params)

        switch (params.model) {
            case 'all':
                userDataGet(smallRequestLimit)
                hashtagDataGet(smallRequestLimit)
                messageDataGet(smallRequestLimit)
                break;
            case 'user':
                userDataGet(commonRequestLimit)
                break;
            case 'hashtag':
                hashtagDataGet(commonRequestLimit)
                break;
            case 'message':
                messageDataGet(commonRequestLimit)
                break;
            default:
                break;
        }
    }, [params]);

    const generateElements = (obj, callbackComponent, hasSeeMore) => {

        if (!obj || String(obj?.status)[0] !== '2' || obj.data?.rows?.length === 0) return <></>

        const { count, rows, responseTitle, responseTitleEng } = obj.data;

        return (
            <>
                {hasSeeMore && <SeeMoreSearchItems title={responseTitle} titleEng={responseTitleEng}
                    itemsCount={count} link={params.searchText} key={Date.now()} />}
                <div className={`search-items ${responseTitleEng}`} >
                    {rows.map(callbackComponent)}
                </div>
            </>
        )
    }

    return (
        <div className='searchBox'>
            {params.model === 'all' && (
                <>
                    {generateElements(users, user => <UserElement user={user} />, true)}
                    {generateElements(hashtags, hashtag => <HashtagElement hashtag={hashtag} />, true)}
                    {generateElements(messages, message => <MessagePost messageObject={message} key={message.id} />, true)}
                </>
            )}
            {params.model === 'user' && (
                <>
                    {generateElements(users, user => <UserElement user={user} />, false)}
                </>
            )}
            {params.model === 'hashtag' && (
                <>
                    {generateElements(hashtags, hashtag => <HashtagElement hashtag={hashtag} />, false)}
                </>
            )}
            {params.model === 'message' && (
                <>
                    {generateElements(messages, message => <MessagePost messageObject={message} key={message.id} />, false)}
                </>
            )}
        </div>
    );
})

export default Search;
