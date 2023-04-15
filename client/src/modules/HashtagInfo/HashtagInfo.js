import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getHashtag } from './API';
import './HashtagInfo.css'

const HashtagInfo = () => {
    const params = useParams()
    const isAuth = useSelector(state => state.isAuth)
    const [hashtag, setHashtag] = useState({});
    const navigate = useNavigate()

    useEffect(() => {
        const getHashtagInfo = async () => {
            const response = await getHashtag(params.hashtagId)

            setHashtag(response.data)
        }
        getHashtagInfo()
    }, []);

    const goBack = () => {
        navigate(-1)
    }

    return (
        <></>
    );
}
//<div className='HashtagInfo-info'>
//                <div className='messages-count'>
//                    <img src='' alt='' />
//                    <h5>{hashtag?.countMessages}</h5>
//                </div>
//            </div>


export default HashtagInfo;
