import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { addMessages } from '../../API/messagesApi';
import UserAvatar from '../UI/UserAvatar/UserAvatar';
import './AddMessage.css'

const AddMessage = () => {
    const { user } = useSelector(state => state.user)
    const [value, setValue] = useState('');
    const [error, setError] = useState(false);

    const onChange = (e) => setValue(e.target.value)

    const AddMessage = async (e) => {
        e.preventDefault()
        try {
            setError(false)
            await addMessages(value)
            e.target.reset();
        } catch (error) {
            console.error(error)
            setError('Ой! Что-то пошло не так. Попробуйте позже.')
        }
    }

    return (
        <div className='AddMessage'>
            <div className='user-avatar'>
                <UserAvatar url={user?.url} />
            </div>
            <form onSubmit={AddMessage} onChange={onChange} className='AddMessage-form'>
                <div className='input-wrapper'>
                    <input type="text" placeholder='Что нового?' />
                    <button className='submit-btn'>
                        <div className='check-mark'>
                            <span></span>
                        </div>
                    </button>
                </div>
                <p className='error-addMessage'>{error || ''}</p>
            </form>
        </div>
    );
}

export default AddMessage;
