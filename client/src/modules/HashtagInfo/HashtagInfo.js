import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getHashtag, getMessages } from './API';
import './HashtagInfo.css'
import MessagePost from '../../components/messagePost/messagePost';
import usePage from '../../hooks/usePage';
import { useSelector } from 'react-redux';
import LoaderHorizontally from '../../UI/LoaderHorizontally/LoaderHorizontally';
import { NotFoundPath } from '../../routes';

const HashtagInfo = () => {
    const { hashtagName } = useParams()
    const [hashtag, setHashtag] = useState({});
    const [messagesData, setMessagesData] = useState([]);//[{page: num, data: []}]
    const limit = 10;
    const [succesDeleteId, setSuccesDeleteId] = useState(null);
    const [page, setPage, changePageElement, event, deleteEvent] =
        usePage(messagesData, setMessagesData, limit, succesDeleteId, setSuccesDeleteId)

    const viewedData = useSelector(state => state.viewedData);
    const [isMessagesLoading, setIsMessagesLoading] = useState(true);
    const Navigate = useNavigate()

    //получение данных
    const getData = async () => {
        if (hashtag?.name !== hashtagName) {
            const hashtagInfo = await getHashtag(hashtagName);

            if (+hashtagInfo?.response?.status === 404) return Navigate(`/${NotFoundPath}`)

            setHashtag(hashtagInfo.data)
            //setInfoStatus('sucsses')
            setPage(0)

            if (hashtagInfo.data?.countMessages > 0) {
                getHashtagMessages([], 0, hashtagInfo.data.id)
            }
        }
    }

    useEffect(() => { getData() }, [hashtagName]);

    useEffect(() => {
        if (messagesData[messagesData.length - 1]?.page !== page && page !== 0) {
            setIsMessagesLoading(true)
            getHashtagMessages(messagesData, page, hashtag.id)
        }
    }, [page]);

    const getHashtagMessages = async (oldArr, pageNum, id) => {
        try {
            const res = await getMessages(id, limit, pageNum, viewedData)
            if (res) {
                const newData = res.data.map(i => i.message)
                setMessagesData([...oldArr, { data: newData, page: pageNum }])
            }
        } catch (error) {
            console.error(error)
        }
        setIsMessagesLoading(false)
    }

    //событие удаления
    useEffect(deleteEvent, [succesDeleteId]);

    useEffect(event, [changePageElement.current, event]);

    return (
        <>
            <div className='HashtagInfo--wrapper'>
                <div className='HashtagInfo-info'>
                    <div className='hashtag-name'>
                        <div className='hashtag-icon-wrapper'>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.875 11L5.375 1M6.625 11L9.125 1M2.25 4.125H11M1 7.875H9.75" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h2>{hashtag ? hashtag.name : ''}</h2>
                    </div>
                    <div className='messages-count'>
                        <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 5H15M5 9H9M10 17L6 13H3C2.46957 13 1.96086 12.7893 1.58579 12.4142C1.21071 12.0391 1 11.5304 1 11V3C1 2.46957 1.21071 1.96086 1.58579 1.58579C1.96086 1.21071 2.46957 1 3 1H17C17.5304 1 18.0391 1.21071 18.4142 1.58579C18.7893 1.96086 19 2.46957 19 3V11C19 11.5304 18.7893 12.0391 18.4142 12.4142C18.0391 12.7893 17.5304 13 17 13H14L10 17Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <h5>{hashtag?.countMessages}</h5>
                    </div>
                </div>
            </div>
            <div className='hashtagList'>
                {
                    messagesData.length > 0 ?
                        messagesData.map(({ page, data }) =>
                            data.map(item => <MessagePost setDelete={(id) =>
                                setSuccesDeleteId([id, page])} messageObject={item} key={item.id} />))

                        : ''
                }
                <div className='changePageElement' ref={changePageElement}></div>
            </div>
            {isMessagesLoading && (<div className='moduleData_loader-wrapper'><LoaderHorizontally /></div>)}
        </>
    );
}



export default HashtagInfo;
