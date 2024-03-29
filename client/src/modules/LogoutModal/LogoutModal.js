import React from 'react';
import ModalLayout from '../../pages/ModalLayout';
import { useDispatch, useSelector } from 'react-redux';
import useModal from '../../hooks/useModal';
import './LogoutModal.css';
import { setAuthAction, setModalAction, setUserAction } from '../../store';
import { logout } from './API';
import { NavigatePath, loginPath } from '../../routes';
import { useNavigate } from 'react-router-dom';

const LogoutModal = () => {
    const [closeModal] = useModal()
    const isAuth = useSelector(state => state.isAuth);
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const logoutOnClick = async () => {
        try {
            if (!isAuth) return;
            await logout()

            localStorage.removeItem('accessToken')

            dispatch(setUserAction({}))
            dispatch(setAuthAction(null))
            navigate(NavigatePath(loginPath))
            dispatch(setModalAction({ type: '', data: {} }))
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <ModalLayout modalTitle='Выход из аккаунта'>
            <div className='modal-text'>
                <p>Чтобы войти в аккаунт вам нужно будет снова ввести почту и пароль.</p>
            </div>
            <div className='logout-btns'>
                <button className='logout-item main commonButton' onClick={logoutOnClick}>выйти</button>
                <button className='logout-item commonButton' onClick={closeModal}>отмена</button>
            </div>
        </ModalLayout>
    );
}

export default LogoutModal;
