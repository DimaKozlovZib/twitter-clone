import React, { useState } from 'react';
import ModalLayout from '../../pages/ModalLayout';
import { useDispatch } from 'react-redux';
import useModal from '../../hooks/useModal';
import { setAvatar } from './API';
import { setAvatarAction } from '../../store';
import UploadFile from '../../components/UploadFile/UploadFile';

const ChangeAvatar = () => {
    const [file, setFile] = useState(null);
    const [closeModal] = useModal(null);
    const dispatch = useDispatch();

    const commonUploadContainer = (
        <>
            <div className='title'>
                <h3>Выберите файл</h3>
            </div>
            <div className='recommendations'>
                <p>Рекомендуемое разрешение 1 х 1.</p>
                <p>Формат — JPG, GIF или PNG.</p>
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

    const sendData = async () => {
        try {
            const formData = new FormData()
            formData.append('file', file)
            const response = await setAvatar(formData)

            if (response) {
                dispatch(setAvatarAction(response.data.url))
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
        <ModalLayout modalTitle='Добавление аватара'>
            <div className='AddAvatar'>
                <div className='AddAvatar__placeholder'>
                    <p>Аватар будет отображаться на всех версиях приложения.</p>
                </div>
                <UploadFile {...obj} />
                <div className='upload-btn-container'>
                    <button
                        className={`upload-btn ${file && 'active'}`}
                        disabled={!file}
                        onClick={sendData}
                    >
                        Загрузить
                    </button>
                </div>
            </div>
        </ModalLayout>
    );
}

export default ChangeAvatar;
