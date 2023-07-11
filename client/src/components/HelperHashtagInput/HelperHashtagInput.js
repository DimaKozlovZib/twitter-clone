import React, { useState } from 'react';
import './HelperHashtagInput.css';
import hashtagIcon from '../../images/hashtagIcon.svg';
import { getHashtags } from './API';

const HelperHashtagInput = ({ setHashtags, index, hashtags }) => {
    const [hashtagHelper, setHashtagHelper] = useState([]);
    const [timer, setTimer] = useState(null);
    const [hashtagHelperIsActive, setHashtagHelperIsActive] = useState(false);

    const hashtagChange = (e) => {
        try {
            const arr = Array.from(hashtags);
            arr[index].hashtag = e.target.value;
            setHashtags(arr);

            clearTimeout(timer)
            setTimer(null)

            const get = async () => {
                const response = await getHashtags(e.target.value);
                setHashtagHelper(response.data.hashtagsToInput.rows);
                setHashtagHelperIsActive(true)
            }

            setTimer(setTimeout(get, 800))
        } catch (error) {
            console.error(error)
        }

    }

    const closeHashtagHelper = (e) => {
        setTimeout(() => {
            if (hashtagHelperIsActive === true) setHashtagHelperIsActive(false)
        }, 850)
    }

    const chooseHashtag = (e, name) => {
        e.preventDefault();
        const arr = Array.from(hashtags);
        arr[index].hashtag = name;

        setHashtags(arr);
        setHashtagHelperIsActive(false)
    }

    return (
        <div className='input-wrapper'>
            <div className='input'>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.875 11L5.375 1M6.625 11L9.125 1M2.25 4.125H11M1 7.875H9.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

                <input onChange={hashtagChange} onBlur={closeHashtagHelper}
                    value={hashtags[index].hashtag} placeholder='hashtag' maxLength='23' className='hashtag-input' />
            </div>
            {hashtagHelperIsActive && <div className='helpers-hashtag'>
                {
                    hashtagHelper.length > 0 ?
                        hashtagHelper.map(({ id, name }) =>
                            <div onClick={(e) => chooseHashtag(e, name)} className='hashtag-item' key={id}>{`#${name}`}</div>) :
                        <p>Ничего не найдено.</p>
                }
            </div>}
        </div>
    );
}

export default HelperHashtagInput;
