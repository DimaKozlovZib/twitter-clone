import React, { useState } from 'react';
import './AddCover.css';
import useModal from '../../hooks/useModal';
import { setCover } from './API';
import { useDispatch } from 'react-redux';
import { setCoverAction } from '../../store';
import ModalLayout from '../../pages/ModalLayout';
import UploadFile from '../../components/UploadFile/UploadFile';

const AddCover = () => {
    const [file, setFile] = useState(null);
    const [closeModal] = useModal(null);
    const dispatch = useDispatch();

    const commonUploadContainer = (
        <>
            <div className='title'>
                <h3>Выберите файл</h3>
            </div>
            <div className='recommendations'>
                <p>Рекомендуемое разрешение 1920 х 768.</p>
                <p>Формат — JPG, WEBP, или PNG.</p>
            </div>
        </>
    )

    const hasFileUploadContainer = (
        <>
            <div className='title'>
                <h3>Загрузить файл</h3>
            </div>
            <div className='recommendations'>
                <p>{file?.name || ''}</p>
            </div>
        </>
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

    const obj = {
        file, setFile,
        firstHtml: commonUploadContainer,
        secondHtml: hasFileUploadContainer
    }

    return (
        <ModalLayout modalTitle='Добавление обложки'>
            <div className='AddCover'>
                <div className='AddCover__placeholder'>
                    <p>Обложка будет отображаться на всех версиях приложения.</p>
                </div>
                <UploadFile {...obj} />
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
