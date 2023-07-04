import React from 'react';
import ModalLayout from '../../pages/ModalLayout';
import { useDispatch, useSelector } from 'react-redux';
import useModal from '../../hooks/useModal';
import './LogoutModal.css';
import { setModalAction, setUserAction } from '../../store';
import { logout } from './API';
import { loginPath } from '../../routes';
import { useNavigate } from 'react-router-dom';

const LogoutModal = () => {
    const [closeModal] = useModal()
    const isAuth = useSelector(state => state.isAuth);
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const logoutOnClick = () => {
        if (!isAuth) return;
        logout()
        localStorage.setItem('accessToken', '')
        dispatch(setUserAction({}))
        navigate(`/${loginPath}`)
        dispatch(setModalAction({ type: '', data: {} }))
    }

    return (
        <ModalLayout modalTitle='Выход из аккаунта'>
            <div className='modal-text'>
                <p>Чтобы войти в аккаунт вам нужно будет снова ввести почту и пароль.</p>
            </div>
            <div className='logout-btns'>
                <button className='logout-item main' onClick={logoutOnClick}>выйти</button>
                <button className='logout-item' onClick={closeModal}>отмена</button>
            </div>
        </ModalLayout>
    );
}

export default LogoutModal;
