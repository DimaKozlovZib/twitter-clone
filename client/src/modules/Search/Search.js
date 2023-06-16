import React, { memo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { searchHashtags, searchUsers } from './API';
import SeeMoreSearchItems from '../../components/SeeMoreSearchItems/SeeMoreSearchItems';
import UserElement from '../../components/UserElement/UserElement';
import HashtagElement from '../../components/HashtagElement/HashtagElement';

const Search = memo(() => {
    const params = useParams();
    const smallRequestLimit = 3;
    const commonRequestLimit = 15;

    const [visibleParams, setVisibleParams] = useState({});

    const [users, setUsers] = useState(null);
    const [hashtags, setHashtags] = useState(null);

    const userDataGet = async (limit) => {
        const userObj = await searchUsers(params.searchText, limit)
        setUsers(userObj)
    }

    const hashtagDataGet = async (limit) => {
        const hashtagObj = await searchHashtags(params.searchText, limit)
        setHashtags(hashtagObj)
    }

    useEffect(() => {
        if (params.model === visibleParams.model && params.searchText === visibleParams.searchText) return;

        setVisibleParams(params)

        switch (params.model) {
            case 'all':
                userDataGet(smallRequestLimit)
                hashtagDataGet(smallRequestLimit)
                break;
            case 'user':
                userDataGet(commonRequestLimit)
                break;
            case 'hashtag':
                hashtagDataGet(commonRequestLimit)
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
                    itemsCount={count - smallRequestLimit} link={params.searchText} key={Date.now()} />}
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
        </div>
    );
})

export default Search;
