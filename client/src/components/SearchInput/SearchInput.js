import React, { memo, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './SearchInput.css';
import UserAvatar from '../../UI/UserAvatar/UserAvatar';
import { getFirstConnectionUsers, getPossibleSearchData } from './API';
import { NavigatePath, hashtagPath, searchPath, userInfoPath } from '../../routes';

const SearchInput = memo(() => {
    const params = useParams();
    const [dataLoad, setDataLoad] = useState(true);
    const [inputValue, setInputValue] = useState('');
    const [dataSearch, setDataSearch] = useState(null);
    const [possibleFriends, setPossibleFriends] = useState([]);
    const [Timer, setTimer] = useState(null);
    const [inputIsActive, setInputIsActive] = useState(false);

    const navigate = useNavigate()

    const inputRef = useRef()

    useEffect(() => {
        if (params?.searchText) setInputValue(params?.searchText)
    }, [params]);

    const onFocus = async () => {
        if (inputValue.trim().length === 0) {

            setInputIsActive(true)
            if (possibleFriends && possibleFriends.length > 0) return

            setDataLoad(true)

            const data = await getFirstConnectionUsers()

            if (data && data.data?.users) {
                setPossibleFriends(data.data)
            } else {//если ошибка то закрываем окно чтобы никто не видел такого позора
                setInputIsActive(false)
            }
            setDataLoad(false)//выключаем крутилку

        } else {

            if (dataSearch.searchString === inputValue) {
                setInputIsActive(true)
            }
        }
    }

    const onBlur = () => {
        setTimeout(() => {
            setInputIsActive(false)
        }, 500);
    }

    const onChange = (e) => {
        const value = e.target.value

        setInputValue(value)

        clearTimeout(Timer)
        setTimer(null)

        const getPossibleResult = async () => {
            setInputIsActive(true)
            setDataLoad(true)

            const result = await getPossibleSearchData(value)

            if (result && result.status === 200) {
                setDataSearch({ data: result.data, searchString: value })
            } else {
                setDataSearch(null)
                setInputIsActive(false)
            }
            setDataLoad(false)
        }

        setTimer(setTimeout(getPossibleResult, 800))
    }

    const onSubmit = (e) => {
        e.preventDefault()
        if ((inputValue !== params.searchText || params.model !== 'all') && inputValue !== '') {
            setInputIsActive(false)
            inputRef.current.blur()
            return navigate(NavigatePath(searchPath(inputValue)))
        }
    }

    const onClick = (uniqueValue, path) => {
        return (e) => {
            e.preventDefault()
            if (!uniqueValue) return;

            setInputIsActive(false)
            return navigate(path)
        }
    }

    const PossibleFriendsJsxEements = memo(() => {
        const users = possibleFriends?.users;
        return (users?.length > 0 && (
            <div className='searchElements-wrapper user'>
                <div className='searchElements-title'>
                    <h4>Люди</h4>
                </div>
                <div className='searchElements'>
                    {users.map(({ user, mutualFriends }) => (
                        <button className='userElement' onClick={onClick(user.id, NavigatePath(userInfoPath(user.id)))} key={user.id}>
                            <div className='userElement-avatar'>
                                <UserAvatar isNotLink url={user.img} />
                            </div>
                            <div className='info-wrapper'>
                                <div className='userElement-info'>
                                    <div className='name'>
                                        <h3>{user.name}</h3>
                                    </div>
                                </div>
                                <div className='mutualFriends'>
                                    <div className='avatar-list'>
                                        {mutualFriends?.rows?.map(el => (<UserAvatar isNotLink url={el.img} key={el.id} />))}
                                    </div>
                                    <h5 className='user-count'>
                                        {mutualFriends?.count > 1 ?
                                            `${mutualFriends?.count} общих друзей` : `${mutualFriends?.count} общий друг`}
                                    </h5>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        ))
    })

    const PossibleSearchResult = memo(() => {
        const users = dataSearch?.data.users;
        const hashtags = dataSearch?.data.hashtags;

        return (dataSearch && (<>{
            (+users?.count || +hashtags?.count) ? (
                <>
                    {users?.count !== 0 && (
                        <div className='searchElements-wrapper user'>
                            <div className='searchElements-title'>
                                <h4>Люди</h4>
                            </div>
                            <div className='searchElements'>
                                {users?.rows.map(i => (
                                    <button className='userElement' key={i.id}
                                        onClick={onClick(i.id, NavigatePath(userInfoPath(i.id)))}>
                                        <div className='userElement-avatar'>
                                            <UserAvatar isNotLink url={i.img} />
                                        </div>
                                        <div className='info-wrapper'>
                                            <div className='userElement-info'>
                                                <div className='name'>
                                                    <h3>{i.name}</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>)}
                    {hashtags?.count !== 0 && (
                        <div className='searchElements-wrapper hashtags'>
                            <div className='searchElements-title'>
                                <h4>Хэштеги</h4>
                            </div>
                            <div className='searchElements'>
                                {hashtags?.rows.map(i => (
                                    <button className='hashtagElement' key={i.id}
                                        onClick={onClick(i.name, NavigatePath(hashtagPath(i.name)))}>
                                        <div className='hashtagElement-icon'>
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M2.875 11L5.375 1M6.625 11L9.125 1M2.25 4.125H11M1 7.875H9.75" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <div className='info-wrapper'>
                                            <div className='hashtagElement-info'>
                                                <div className='name'>
                                                    <h3>{i.name}</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>)}
                </>
            ) : (
                <div className='request-message'>
                    <h5>Ничего не найдено</h5>
                </div>
            )}
        </>))
    })


    const searchOfModel = (
        <div className={`searchOfModel ${inputIsActive ? 'active' : ''}`}>
            {dataLoad ? (<div className='loader-wrapper'><div className='searchOfModel-loader'></div></div>) :
                (<>{inputValue.trim().length === 0 ? <PossibleFriendsJsxEements /> : <PossibleSearchResult />}</>)}
        </div>
    )

    return (
        <form className='SearchComponent--wrapper' id='searchForm' onSubmit={onSubmit}>
            <div className='SearchComponent'>
                <input type='text' value={inputValue} className='SearchComponent-input' form='searchForm'
                    maxLength='15' onChange={onChange} onFocus={onFocus} onBlur={onBlur} ref={inputRef} />
                <button className='SearchComponent-btn' type='submit' form='searchForm' onClick={onSubmit}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M6 2C4.93913 2 3.92172 2.42143 3.17157 3.17158C2.42143 3.92172 2 4.93914 2 6C2 7.06087 2.42143 8.07829 3.17157 8.82843C3.92172 9.57858 4.93913 10 6 10C7.06087 10 8.07828 9.57858 8.82843 8.82843C9.57857 8.07829 10 7.06087 10 6C10 4.93914 9.57857 3.92172 8.82843 3.17158C8.07828 2.42143 7.06087 2 6 2ZM1.13461e-07 6C-0.00012039 5.05571 0.222642 4.12472 0.650171 3.28274C1.0777 2.44077 1.69792 1.7116 2.4604 1.15453C3.22287 0.597457 4.10606 0.228216 5.03815 0.0768364C5.97023 -0.0745427 6.92488 -0.00378543 7.82446 0.283354C8.72405 0.570493 9.54315 1.06591 10.2152 1.7293C10.8872 2.39269 11.3931 3.20534 11.6919 4.10114C11.9906 4.99694 12.0737 5.9506 11.9343 6.88456C11.795 7.81852 11.4372 8.7064 10.89 9.476L15.707 14.293C15.8892 14.4816 15.99 14.7342 15.9877 14.9964C15.9854 15.2586 15.8802 15.5094 15.6948 15.6948C15.5094 15.8802 15.2586 15.9854 14.9964 15.9877C14.7342 15.99 14.4816 15.8892 14.293 15.707L9.477 10.891C8.57936 11.5293 7.52335 11.9082 6.42468 11.9861C5.326 12.0641 4.22707 11.8381 3.2483 11.333C2.26953 10.8278 1.44869 10.063 0.875723 9.12235C0.30276 8.18168 -0.000214051 7.10144 1.13461e-07 6Z" />
                    </svg>
                </button>
            </div>
            {searchOfModel}
        </form>
    );
})

export default SearchInput;
