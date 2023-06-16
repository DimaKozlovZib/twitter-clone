import React, { memo, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './SearchInput.css';

const SearchInput = memo(() => {
    const params = useParams();
    const [inputValue, setInputValue] = useState(params?.hashtagName || '');
    const [inputIsActive, setInputIsActive] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        if (params?.searchText) setInputValue(params?.searchText)
    }, [params]);

    const setModelRequest = (model) => {
        return () => {
            if (params.model === model && params.searchText === inputValue) {
                return;
            }
            navigate(`/twitter-clone/search/${model}/${inputValue}`)
        }
    }

    const onFocus = () => {
        setInputIsActive(true)
    }

    const onBlur = () => {
        setTimeout(() => {
            setInputIsActive(false)
        }, 500);

    }

    const onChange = (e) => {
        setInputValue(e.target.value)
    }

    const onSubmit = (e) => {
        e.preventDefault()
        if (inputValue !== params.searchText && inputValue !== '') {
            return navigate(`/twitter-clone/search/all/${inputValue}`)
        }
    }
    const searchOfModel = (
        <div className={`searchOfModel ${inputIsActive && inputValue.length > 0 ? 'active' : ''}`}>
            <button className='searchOfModel-item' onClick={setModelRequest('hashtag')}>
                <div className='item-icon'>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.875 11L5.375 1M6.625 11L9.125 1M2.25 4.125H11M1 7.875H9.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div className='item-text'>
                    <h5>Хэштеги с "{inputValue}"</h5>
                </div>
            </button>
            <button className='searchOfModel-item' onClick={setModelRequest('user')}>
                <div className='item-icon'>
                    <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.1429 5.88889C15.1429 7.1855 14.601 8.42901 13.6365 9.34586C12.6721 10.2627 11.364 10.7778 10 10.7778C8.63603 10.7778 7.32792 10.2627 6.36345 9.34586C5.39898 8.42901 4.85714 7.1855 4.85714 5.88889C4.85714 4.59227 5.39898 3.34877 6.36345 2.43192C7.32792 1.51508 8.63603 1 10 1C11.364 1 12.6721 1.51508 13.6365 2.43192C14.601 3.34877 15.1429 4.59227 15.1429 5.88889ZM10 14.4444C7.61305 14.4444 5.32387 15.3458 3.63604 16.9503C1.94821 18.5548 1 20.7309 1 23H19C19 20.7309 18.0518 18.5548 16.364 16.9503C14.6761 15.3458 12.3869 14.4444 10 14.4444Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div className='item-text'>
                    <h5>Пользователи с "{inputValue}"</h5>
                </div>
            </button>
        </div>
    )

    return (
        <form className='SearchComponent--wrapper' onSubmit={onSubmit}>
            <div className='SearchComponent'>
                <input type='text' value={inputValue} className='SearchComponent-input' maxLength='15' onChange={onChange} onFocus={onFocus} onBlur={onBlur} />
                <button className='SearchComponent-btn' type='submit'>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M6 2C4.93913 2 3.92172 2.42143 3.17157 3.17158C2.42143 3.92172 2 4.93914 2 6C2 7.06087 2.42143 8.07829 3.17157 8.82843C3.92172 9.57858 4.93913 10 6 10C7.06087 10 8.07828 9.57858 8.82843 8.82843C9.57857 8.07829 10 7.06087 10 6C10 4.93914 9.57857 3.92172 8.82843 3.17158C8.07828 2.42143 7.06087 2 6 2ZM1.13461e-07 6C-0.00012039 5.05571 0.222642 4.12472 0.650171 3.28274C1.0777 2.44077 1.69792 1.7116 2.4604 1.15453C3.22287 0.597457 4.10606 0.228216 5.03815 0.0768364C5.97023 -0.0745427 6.92488 -0.00378543 7.82446 0.283354C8.72405 0.570493 9.54315 1.06591 10.2152 1.7293C10.8872 2.39269 11.3931 3.20534 11.6919 4.10114C11.9906 4.99694 12.0737 5.9506 11.9343 6.88456C11.795 7.81852 11.4372 8.7064 10.89 9.476L15.707 14.293C15.8892 14.4816 15.99 14.7342 15.9877 14.9964C15.9854 15.2586 15.8802 15.5094 15.6948 15.6948C15.5094 15.8802 15.2586 15.9854 14.9964 15.9877C14.7342 15.99 14.4816 15.8892 14.293 15.707L9.477 10.891C8.57936 11.5293 7.52335 11.9082 6.42468 11.9861C5.326 12.0641 4.22707 11.8381 3.2483 11.333C2.26953 10.8278 1.44869 10.063 0.875723 9.12235C0.30276 8.18168 -0.000214051 7.10144 1.13461e-07 6Z" fill="black" />
                    </svg>
                </button>
            </div>
            {searchOfModel}
        </form>
    );
})

export default SearchInput;
