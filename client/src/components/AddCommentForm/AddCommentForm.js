import React, { useState } from 'react';
import './AddCommentForm.css';
import UserAvatar from '../../UI/UserAvatar/UserAvatar';
import { useSelector } from 'react-redux';
import ButtonBlue from '../../UI/ButtonBlue/ButtonBlue'
import { addComment, setCommentMood } from './API';

const AddCommentForm = ({ setNewComment, messageId }) => {
    const user = useSelector(state => state.user)
    const isAuth = useSelector(state => state.isAuth)
    const [value, setValue] = useState('');
    const maxLength = 200;

    const onChange = (e) => {
        setValue(e.target.value)
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        const valueCondition = !value || value > maxLength
        if (!isAuth || valueCondition) return;

        const newComment = await addComment(value, messageId)
        if (newComment) {
            setNewComment(newComment.data)
            setValue('')

            await setCommentMood(value, messageId)
        }
    }

    return (
        <div className='AddCommentForm'>
            <form className='AddCommentForm__form' id='AddCommentForm' onSubmit={onSubmit}>
                <div className='AddCommentForm__userAvatar'>
                    <UserAvatar url={user.img} isNotLink />
                </div>
                <input maxLength={maxLength} onChange={onChange} value={value} placeholder='Напишите комментарий к этому сообщению.' />
            </form>
            <ButtonBlue onClick={onSubmit}>Сохранить</ButtonBlue>
        </div>
    );
}

export default AddCommentForm;
