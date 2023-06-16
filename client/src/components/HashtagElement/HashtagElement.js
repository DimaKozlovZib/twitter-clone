import React from 'react';
import './HashtagElement.css';
import { useNavigate } from 'react-router-dom';

const HashtagElement = ({ hashtag }) => {
    const { name, countMessages } = hashtag
    const navigate = useNavigate()

    const openPage = () => {
        navigate(`/twitter-clone/hashtag/${name}`)
    }

    return (
        <button className='HashtagElement' onClick={openPage}>
            <div className='HashtagElement-icon'>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.875 11L5.375 1M6.625 11L9.125 1M2.25 4.125H11M1 7.875H9.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <div className='HashtagElement-title'>
                <h3>{name}</h3>
            </div>
            <div className='HashtagElement-mesCount'>
                <h4>( {countMessages} )</h4>
            </div>
        </button>
    );
}

export default HashtagElement;
