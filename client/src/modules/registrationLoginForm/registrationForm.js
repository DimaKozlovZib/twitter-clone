import React, { useState } from 'react';
import FormInput from '../../components/FormInput/FormInput';
import './Form.css';
import nameFormInput from '../../images/nameFormImg.svg';
import emailFormInput from '../../images/emailFormImg.svg';
import passwordFormInput from '../../images/passwordFormImg.svg';
import { validationsEmail, validationsName, validationsPassword } from './validations';
import { registration } from '../../API/userApi';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { messagesPath } from '../../routes';


const RegistrationForm = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const History = useNavigate()

    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [date, setDate] = useState('');

    const [errorPassword, setErrorPassword] = useState(null);
    const [errorName, setErrorName] = useState(null);
    const [errorEmail, setErrorEmail] = useState(null);

    const [errorFromServer, setErrorFromServer] = useState(null);

    const onSubmit = async (e) => {
        e.preventDefault()

        const errorsCount = [errorEmail, errorName, errorPassword].filter(i => i !== null).length;

        if (errorsCount === 0) {
            setErrorFromServer(null)

            const result = await registration(name, email, password, date)

            if (result.status === 200 || result.response.status === 200) {
                localStorage.setItem('accessToken', result.data.accessToken)
                dispatch({ type: 'ADD_USER', payload: result.data.user })
                History(`/${messagesPath}`)
            } else {
                setErrorFromServer(result.response.data.message)
            }
        }
    }

    return (
        <div className='RegistrationForm'>
            <div className='RegistrationForm-title'>
                <h2>Регистрация</h2>
            </div>
            <form onSubmit={onSubmit} className='RegistrationForm-form'>
                <div className='RegistrationForm-form_name'>
                    <h5>Имя</h5>
                    <FormInput
                        placeholder='введите имя'
                        type='text'
                        imgUrl={nameFormInput}
                        state={name}
                        setState={setName}
                        validations={validationsName}
                        setError={setErrorName}
                    />
                </div>
                <div className='RegistrationForm-form_email'>
                    <h5>Почта</h5>
                    <FormInput
                        placeholder='введите почту'
                        type='email'
                        imgUrl={emailFormInput}
                        state={email}
                        setState={setEmail}
                        validations={validationsEmail}
                        setError={setErrorEmail}
                    />
                </div>
                <div className='RegistrationForm-form_password'>
                    <h5>Пароль</h5>
                    <FormInput
                        placeholder='введите пароль'
                        type='password'
                        imgUrl={passwordFormInput}
                        state={password}
                        setState={setPassword}
                        validations={validationsPassword}
                        setError={setErrorPassword}
                    />
                </div>
                <div className='RegistrationForm-form_date'>
                    <h5>Дата рождения</h5>
                    <FormInput
                        type='date'
                        state={date}
                        setState={setDate}
                    />
                </div>
                {
                    errorFromServer ?
                        <p className='error errorFromServer'>{errorFromServer}</p> : <></>
                }
                <div className='RegistrationForm_submit-button'>
                    <button>Зарегистрироваться</button>
                </div>
                <div className='login'>
                    <Link>
                        Уже есть аккаунт? Войти.
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default RegistrationForm;
