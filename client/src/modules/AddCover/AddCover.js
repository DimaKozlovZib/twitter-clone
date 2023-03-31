import React, { useState } from 'react';
import './AddCover.css';
import upload from '../../images/upload.svg'
import useModal from '../../hooks/useModal';
import { setCover } from './API';
import { useDispatch } from 'react-redux';
import { setCoverAction } from '../../store';
import ModalLayout from '../../pages/ModalLayout';

const AddCover = () => {
    const [inputFocus, setInputFocus] = useState(false);
    const [file, setFile] = useState(null);
    const [closeModal] = useModal(null, '.AddCover-wrapper');
    const dispatch = useDispatch();

    const onDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setInputFocus(true)
    }

    const onDrop = (e) => {
        e.preventDefault();
        const files = [...e.dataTransfer.files]

        if ("image/jpeg,image/png,image/gif,image/webp".split(',').includes(files[0].type)) {
            setFile(files[0])
        } else {
            setInputFocus(false)
            setFile(null)
            console.error('file has wrong type')
        }
    }

    const stopActiveInput = (e) => {
        if (!document.querySelector('#upload').contains(e.relatedTarget)) {
            e.preventDefault();
            e.stopPropagation();
            setInputFocus(false)
        }
    }

    const commonUploadContainer = (
        <div className='upload-container'>
            <div className='add-icon'>
                <span></span>
            </div>
            <div className='title'>
                <h3>Выберите файл</h3>
            </div>
            <div className='recommendations'>
                <p>Рекомендуемое разрешение 1920 х 768.</p>
                <p>Формат — JPG, WEBP, или PNG.</p>
            </div>
        </div>
    )

    const hasFileUploadContainer = (
        <div className='upload-container'>
            <div className='upload-icon'>
                <img src={upload} alt="upload" />
            </div>
            <div className='title'>
                <h3>Загрузить файл</h3>
            </div>
            <div className='recommendations'>
                <p>{file?.name || ''}</p>
            </div>
        </div>
    )

    const sendCover = async () => {
        try {
            const formData = new FormData()
            formData.append('file', file)
            const response = await setCover(formData)
            if (response) {
                dispatch(setCoverAction(response.data.url))
                closeModal()
            }
        } catch (error) {
            console.error(error)
        }

    }

    const changeInput = (e) => {
        const input = document.querySelector('#file-input')
        setFile(input.files[0])
        setInputFocus(true)
    }

    const onDragOver = (e) => e.preventDefault();

    return (
        <ModalLayout modalTitle='Добавление обложки'>
            <div className='AddCover'>
                <div className='AddCover__placeholder'>
                    <p>Обложка будет отображаться на всех версиях приложения.</p>
                </div>
                <input id="file-input" onChange={changeInput} type="file" hidden accept="image/jpeg,image/png,image/gif,image/webp" />

                <label htmlFor="file-input" id="upload" className={`upload ${inputFocus && 'active'}`}
                    onDragEnter={onDragEnter}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragEnd={stopActiveInput}
                    onDragLeave={stopActiveInput}
                >
                    {file ? hasFileUploadContainer : commonUploadContainer}
                </label>
                <div className='upload-btn-container'>
                    <button
                        className={`upload-btn ${file && 'active'}`}
                        disabled={!file}
                        onClick={sendCover}
                    >
                        Загрузить
                    </button>
                </div>
            </div>
        </ModalLayout>
    );
}

export default AddCover;
