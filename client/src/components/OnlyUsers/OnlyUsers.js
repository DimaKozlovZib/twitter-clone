import React from 'react';
import ButtonBlue from '../../UI/ButtonBlue/ButtonBlue';
import './OnlyUsers.css'
import { useNavigate } from 'react-router-dom';
import { NavigatePath, loginPath, registrationPath } from '../../routes';

const OnlyUsers = () => {
    const History = useNavigate()

    const loginEvent = () => History(NavigatePath(loginPath))

    const registrationEvent = () => History(NavigatePath(registrationPath))

    return (
        <div className='OnlyUsers'>
            <div className='OnlyUsers-title'>
                <p>Простите, но эта страница только для зарегистрированых пользователей. Зарегистрируйтесь или войдите в свой аккаунт.</p>
            </div>
            <div className='OnlyUsers-btns'>
                <ButtonBlue className='toLogin' onClick={loginEvent}>Войти</ButtonBlue>
                <ButtonBlue className='toRegistration' onClick={registrationEvent}>Зарегистрироваться</ButtonBlue>
            </div>
        </div>
    );
}

export default OnlyUsers;
