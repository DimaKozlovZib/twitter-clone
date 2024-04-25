import React, { memo, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { addMediaRequest, addMessages } from './API';
import './AddMessage.css';
import MessageAddInput from '../../components/MessageAddInput/MessageAddInput';
import ImageTable from '../../components/ImageTable/ImageTable';
import RetweetMessage from '../../UI/RetweetMessage/RetweetMessage';
import { useParams } from 'react-router-dom';
import { getMessageContent } from '../../API/messagesApi';
import LoaderHorizontally from '../../UI/LoaderHorizontally/LoaderHorizontally';
import { EditorState } from 'draft-js';
import { compositeDecorator } from '../../components/MessageAddInput/decorators';
import ButtonBlue from '../../UI/ButtonBlue/ButtonBlue';

const AddMessage = memo(({ isRetweet }) => {
    const isAuth = useSelector(state => state.isAuth)
    const [customOrderedFiles, setCustomOrderedFiles] = useState([]);
    const maxMediaCount = 6;

    const [isLoad, setIsLoad] = useState(null);
    const [messageRetweetData, setMessageRetweetData] = useState(null);
    const storageData = useSelector(i => i.data)
    const params = useParams()
    const [editorState, setEditorState] = React.useState(() => EditorState.createEmpty(compositeDecorator));

    useEffect(() => {
        if (!isRetweet) return;
        const messId = +params.id

        if (storageData?.id === messId) {
            setMessageRetweetData(storageData)
            setIsLoad(true)
        } else {
            const getContent = async () => {
                const res = await getMessageContent(messId, false, false)
                if (res) {
                    setMessageRetweetData(res.data.message)
                    setIsLoad(true)
                }
            }
            getContent()
        }
    }, [storageData]);

    const addMedia = e => {
        const files = e.target.files
        if (
            files.length > maxMediaCount
            || customOrderedFiles.length + files.length > maxMediaCount
        )
            return e.preventDefault();

        setCustomOrderedFiles([...customOrderedFiles, ...files])
    }

    const deleteMedia = (e, index) => {
        e.preventDefault();
        e.stopPropagation();

        const arrFiles = [...customOrderedFiles]
        arrFiles.splice(index, 1)
        setCustomOrderedFiles(arrFiles)
    }

    const disabled = useMemo(() => {
        const contentState = editorState.getCurrentContent();
        const value = contentState.getPlainText();
        return value.trim().length === 0 || value.length > 500
    }, [editorState])

    const postMessage = async e => {
        e.preventDefault();
        try {
            const contentState = editorState.getCurrentContent();
            const value = contentState.getPlainText();

            if (value.trim().length === 0 || value.length > 500) return;
            //получаем хэштеги
            const hashtags = document.querySelectorAll(`.MessageAddInput .hashtag`)

            const hashtagNames = []

            for (let index = 0; index < hashtags.length; index++) {
                const element = hashtags[index];
                hashtagNames.push(element.textContent)
            }
            const hashtagsInText = Array.from(new Set(hashtagNames)).join(',')

            //запрос
            const response = await addMessages(value, hashtagsInText, messageRetweetData?.id || null)

            if (response) {
                //передаем данные в форму
                for (let index = 0; index < customOrderedFiles.length; index++) {
                    const formData = new FormData()
                    const element = customOrderedFiles[index];
                    formData.append('file', element)

                    await addMediaRequest(formData, index, response?.data.id)
                }

                setEditorState(() => EditorState.createEmpty(compositeDecorator))
                setCustomOrderedFiles([])
                setMessageRetweetData(null)
                setIsLoad(null)
            }
        } catch (error) {
            console.error(error)
        }
    }

    return isAuth && (
        <div className='AddMessage'>
            {isRetweet &&
                (isLoad && messageRetweetData ?
                    <RetweetMessage retweetMessage={messageRetweetData} /> : <LoaderHorizontally />)
            }
            <form id='form' onSubmit={e => e.preventDefault()} className='AddMessage-form'>
                <MessageAddInput editorState={editorState} setEditorState={setEditorState} />
                <ImageTable customOrderedFiles={customOrderedFiles} deleteImage={deleteMedia} />
                <div className='form-wrapper'>
                    <div className='additionalСontent'>
                        <div className='additionalСontent__item'>
                            <input id="addImage"
                                type="file" hidden
                                accept="image/jpeg,image/png,image/gif,image/webp,video/mp4"
                                onChange={addMedia} maxLength={maxMediaCount}
                                multiple={customOrderedFiles.length < maxMediaCount - 1} />

                            <label htmlFor='addImage' id="addImage-label">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.41789 16.6054C1.02737 16.9959 1.02737 17.6291 1.41789 18.0196C1.80842 18.4101 2.44158 18.4101 2.83211 18.0196L1.41789 16.6054ZM6.625 12.8125L7.33211 12.1054C6.94158 11.7149 6.30842 11.7149 5.91789 12.1054L6.625 12.8125ZM8.875 15.0625L8.16789 15.7696C8.55842 16.1601 9.19158 16.1601 9.58211 15.7696L8.875 15.0625ZM13.9375 10L14.6446 9.29289C14.2541 8.90237 13.6209 8.90237 13.2304 9.29289L13.9375 10ZM17.7304 15.2071C18.1209 15.5976 18.7541 15.5976 19.1446 15.2071C19.5351 14.8166 19.5351 14.1834 19.1446 13.7929L17.7304 15.2071ZM2.83211 18.0196L7.33211 13.5196L5.91789 12.1054L1.41789 16.6054L2.83211 18.0196ZM5.91789 13.5196L8.16789 15.7696L9.58211 14.3554L7.33211 12.1054L5.91789 13.5196ZM9.58211 15.7696L14.6446 10.7071L13.2304 9.29289L8.16789 14.3554L9.58211 15.7696ZM13.2304 10.7071L17.7304 15.2071L19.1446 13.7929L14.6446 9.29289L13.2304 10.7071ZM4.375 2H15.625V0H4.375V2ZM18 4.375V15.625H20V4.375H18ZM15.625 18H4.375V20H15.625V18ZM2 15.625V4.375H0V15.625H2ZM4.375 18C3.06332 18 2 16.9367 2 15.625H0C0 18.0412 1.95875 20 4.375 20V18ZM18 15.625C18 16.9367 16.9367 18 15.625 18V20C18.0412 20 20 18.0412 20 15.625H18ZM15.625 2C16.9367 2 18 3.06332 18 4.375H20C20 1.95875 18.0412 0 15.625 0V2ZM4.375 0C1.95875 0 0 1.95875 0 4.375H2C2 3.06332 3.06332 2 4.375 2V0ZM6.75 6.0625C6.75 6.4422 6.4422 6.75 6.0625 6.75V8.75C7.54677 8.75 8.75 7.54677 8.75 6.0625H6.75ZM6.0625 6.75C5.6828 6.75 5.375 6.4422 5.375 6.0625H3.375C3.375 7.54677 4.57823 8.75 6.0625 8.75V6.75ZM5.375 6.0625C5.375 5.6828 5.6828 5.375 6.0625 5.375V3.375C4.57823 3.375 3.375 4.57823 3.375 6.0625H5.375ZM6.0625 5.375C6.4422 5.375 6.75 5.6828 6.75 6.0625H8.75C8.75 4.57823 7.54677 3.375 6.0625 3.375V5.375Z" />
                                </svg>
                            </label>
                        </div>
                    </div>
                    <ButtonBlue className='submit-btn' onClick={postMessage} disabled={disabled}>
                        Сохранить
                    </ButtonBlue>
                </div>
            </form>
        </div>

    );
})

export default AddMessage;
