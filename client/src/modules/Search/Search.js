import React, { memo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { search } from './API';
import SeeMoreSearchItems from '../../components/SeeMoreSearchItems/SeeMoreSearchItems';
import UserElement from '../../components/UserElement/UserElement';
import HashtagElement from '../../components/HashtagElement/HashtagElement';

const Search = memo(() => {
    const params = useParams();
    const smallRequestLimit = 3;
    const commonRequestLimit = 15;

    const [visibleParams, setVisibleParams] = useState({});

    const [searchData, setsearchData] = useState(null);

    const dataGet = async (limit, onlyModel = null) => {
        const res = await search(params.searchText, limit, onlyModel)
        setsearchData(res.data)
    }

    useEffect(() => {
        if (params.model === visibleParams.model && params.searchText === visibleParams.searchText) return;

        setVisibleParams(params)

        switch (params.model) {
            case 'user':
                dataGet(commonRequestLimit, 'user')
                break;
            case 'hashtag':
                dataGet(commonRequestLimit, 'hashtag')
                break;
            default:
                dataGet(smallRequestLimit)
                break;
        }
    }, [params]);

    const generateElements = (object, callbackComponent, title, hasSeeMore) => {
        if (!object) return (<></>)

        const { count, rows } = object;

        return (
            <>
                <SeeMoreSearchItems title={title} hasSeeMore={hasSeeMore}
                    itemsCount={count} link={params.searchText} />
                {count > 0 ?
                    (<div className={`search-items ${title}`} >
                        {rows.map(callbackComponent)}
                    </div>) :
                    (<div className='search-titleNoOne'><h4>
                        --Ничего не найдено--
                    </h4></div>)
                }
            </>
        )
    }
    const usersArguments = [searchData?.users, el => <UserElement user={el} subscribeBtn />, 'user']
    const hashtagsArguments = [searchData?.hashtags, el => <HashtagElement hashtag={el} />, 'hashtag']

    return (
        <div className='searchBox'>
            {params.model === 'all' && (
                <>
                    {generateElements(...usersArguments, true)}
                    {generateElements(...hashtagsArguments, true)}
                </>
            )}
            {params.model !== 'all' && (
                <>
                    {generateElements(...usersArguments, false)}
                    {generateElements(...hashtagsArguments, false)}
                </>
            )}
        </div>
    );
})

export default Search;
