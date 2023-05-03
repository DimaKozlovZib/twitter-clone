import React, { useState } from 'react';
import './DeleteMessage.css';
import ModalLayout from '../../pages/ModalLayout';
import useModal from '../../hooks/useModal';
import { DeleteFunc } from './API';
import { useSelector } from 'react-redux';
import SuccesMessage from '../../UI/SuccesMessage/SuccesMessage';

const DeleteMessage = ({ data }) => {
    const [closeModal] = useModal()
    const isAuth = useSelector(state => state.isAuth);
    const [isSuccesDelete, setIsSuccesDelete] = useState(null);


    const deleteOnClick = async () => {
        if (isAuth) {
            const res = await DeleteFunc(data.id)
            if (res) {
                data.setDelete(data.id)
                setIsSuccesDelete(true)
            }
        }
    }

    return (
        <ModalLayout modalTitle='УДАЛЕНИЕ СООБЩЕНИЯ'>
            {isSuccesDelete === null && (
                <>
                    <div className='delete-text'>
                        <p>Нажмите "удалить", чтобы полностью удалить сообщение.</p>
                    </div>
                    <div className='delete-btns'>
                        <button className='deleteBtn-item main' onClick={deleteOnClick}>удалить</button>
                        <button className='deleteBtn-item' onClick={closeModal}>отмена</button>
                    </div>
                </>
            )}
            {isSuccesDelete === true && (
                <>
                    <SuccesMessage>Сообщение успешно удалено!</SuccesMessage>
                    <div className='delete-btns'>
                        <button className='deleteBtn-item main' onClick={closeModal}>Закрыть</button>
                    </div>
                </>
            )}
        </ModalLayout>
    );
}

export default DeleteMessage;
