import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { addMessages } from './API';
import './AddMessage.css';
import HelperHashtagInput from '../../components/HelperHashtagInput/HelperHashtagInput';
import ModalLayout from '../../pages/ModalLayout';

const AddMessage = () => {
    const isAuth = useSelector(state => state.isAuth)
    const [value, setValue] = useState('');
    const [error, setError] = useState(null);
    const [hashtags, setHashtags] = useState([{ hashtag: '' }]);

    const onChange = (e) => setValue(e.target.value)

    const AddMessage = async (e) => {
        e.preventDefault()
        try {
            if (!isAuth) return;

            setError(false)

            const requestHashtags = hashtags.map(({ hashtag }) => hashtag).filter(item => item.length > 0)
            const response = await addMessages(value, requestHashtags)

            document.querySelector('#form').reset()
        } catch (error) {
            console.error(error)
            setError('Ой! Что-то пошло не так. Попробуйте позже.')
        }
    }

    useEffect(() => setError(null), [hashtags]);

    const createInput = (e) => {
        if (hashtags.length === 4) {
            return setError('Превышено максимальное количество полей ввода.')
        }

        if (hashtags.filter(({ hashtag }) => hashtag === '').length === 0) {
            return setHashtags([...hashtags, { hashtag: '' }])
        }
        setError('Заполните прошлое поле, чтобы создать новое.');
    }

    return isAuth && (
        <ModalLayout modalTitle='Создание твита'>
            <form id='form' onSubmit={e => e.preventDefault()} className='AddMessage-form'>
                <div className='form-wrapper'>
                    <textarea onChange={onChange}
                        maxLength='200'
                        placeholder='Напишите текст для вашего твитта здесь.' value={value}></textarea>

                    <div className='hashtag-box'>
                        <button className='hashtagAddBtn' onClick={createInput}>
                            <span></span>
                        </button>
                        {
                            hashtags.map((item, index) => (
                                <HelperHashtagInput
                                    setHashtags={setHashtags} key={index} index={index} hashtags={hashtags} />
                            ))
                        }
                    </div>
                    <button className='submit-btn' onClick={AddMessage}>
                        Сохранить
                    </button>
                </div>
                {error && <p className='error-addMessage'>{error}</p>}
            </form>
        </ModalLayout>
    );
}

export default AddMessage;
