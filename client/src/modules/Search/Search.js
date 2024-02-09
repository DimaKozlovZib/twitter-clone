import React, { memo, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { search } from './API';
import SeeMoreSearchItems from '../../components/SeeMoreSearchItems/SeeMoreSearchItems';
import UserElement from '../../components/UserElement/UserElement';
import HashtagElement from '../../components/HashtagElement/HashtagElement';
import './Search.css'
import PageChanger from '../../components/PageChanger/PageChanger';
import LoaderHorizontally from '../../UI/LoaderHorizontally/LoaderHorizontally';
import { NavigatePath, NotFoundPath } from '../../routes';

const Search = memo(() => {
    const params = useParams();
    const smallRequestLimit = 3;
    const commonRequestLimit = 15;

    const [isLoadData, setIsLoadData] = useState(false);
    const [page, setPage] = useState(0);
    const [searchData, setSearchData] = useState({ users: {}, hashtags: {} });

    const navigate = useNavigate()

    const dataGet = async (limit, pageindex, onlyModel = null) => {
        setIsLoadData(false)
        const res = await search(params.searchText, limit, pageindex, onlyModel)

        if (res) {
            setSearchData(res.data)
        }
        setIsLoadData(true)
    }

    useEffect(() => {
        setSearchData({ users: {}, hashtags: {} })
        switch (params.model) {
            case 'user':
                dataGet(commonRequestLimit, page, 'user')
                break;
            case 'hashtag':
                dataGet(commonRequestLimit, page, 'hashtag')
                break;
            case 'all':
                dataGet(smallRequestLimit, 0)
                break;
            default:
                navigate(NavigatePath(NotFoundPath))
        }
    }, [params, page]);

    const generateElements = (object, callbackComponent, title, hasSeeMore) => {
        if (!object) return (<></>)

        const { count, rows } = object;

        return (
            <>
                <div className='search-box'>
                    <SeeMoreSearchItems title={title} hasSeeMore={hasSeeMore}
                        itemsCount={count || 0} link={params.searchText} />
                    <div className='search-box__list'>
                        {isLoadData ?
                            (count > 0 ?
                                (<div className={`search-items ${title}`} >
                                    {rows.map(callbackComponent)}
                                </div>) :
                                (<div className='search-titleNoOne'><h4>
                                    --Ничего не найдено--
                                </h4></div>)
                            ) : <LoaderHorizontally />
                        }
                    </div>
                </div>
                {(count > commonRequestLimit && hasSeeMore === false) &&
                    <PageChanger page={page} setpage={setPage} limit={commonRequestLimit} count={count} />
                }
            </>
        )
    }
    const usersArguments = [searchData?.users, el => <UserElement user={el} subscribeBtn />, 'user']
    const hashtagsArguments = [searchData?.hashtags, el => <HashtagElement hashtag={el} />, 'hashtag']

    return (
        <div className='search-wrapper'>
            {params.model === 'all' && (
                <>
                    {generateElements(...usersArguments, true)}
                    {generateElements(...hashtagsArguments, true)}
                </>
            )}
            {params.model === 'hashtag' && (
                <>
                    {generateElements(...hashtagsArguments, false)}
                </>
            )}
            {params.model === 'user' && (
                <>
                    {generateElements(...usersArguments, false)}
                </>
            )}
        </div>
    );
})

export default Search;
