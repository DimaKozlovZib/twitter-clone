import React, { useState } from 'react';
import ModalLayout from '../../pages/ModalLayout';
import { useSelector } from 'react-redux';
import './RetweetModal.css';
import ButtonBlue from '../../UI/ButtonBlue/ButtonBlue';
import { addRetweet } from './API';
import RetweetMessage from '../../UI/RetweetMessage/RetweetMessage';

const RetweetModal = ({ retweetMessage }) => {
    const [value, setValue] = useState('');
    const [error, setError] = useState('');
    const isAuth = useSelector(state => state.isAuth)
    const maxLenght = 140;
    const { id } = retweetMessage;

    const onChange = (e) => {
        const excessLimit = value.length >= maxLenght
        if (excessLimit) setError('Комментарий превышает лимит символов (140).')
        if (!excessLimit || error) setError('')

        setValue(e.target.value)
    }

    const onSubmit = async (e) => {
        try {
            e.preventDefault();
            if (!isAuth || value.length > maxLenght) return setError('Комментарий превышает лимит символов (140).')
            const response = await addRetweet(value, id);
        } catch (error) {

        }
    }
    return (
        <ModalLayout modalTitle='Раскажите своё мнение'>
            <form id='retweetForm' className='retweetForm' onSubmit={onSubmit}>
                <textarea onChange={onChange} form='retweetForm'
                    maxLength={maxLenght}
                    placeholder='Напишите текст для вашего комментария здесь.' value={value}></textarea>

            </form>
            <RetweetMessage retweetMessage={retweetMessage} />
            <div className='retweetForm-submit-btn'>
                <ButtonBlue onClick={onSubmit}>Прокомментировать</ButtonBlue>
            </div>
            {error &&
                <div className='error-wrapper'>
                    <p className='error'>{error}</p>
                </div>
            }
        </ModalLayout>
    );
}

export default RetweetModal;
