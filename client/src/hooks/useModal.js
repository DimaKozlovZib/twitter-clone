import { useDispatch, useSelector } from 'react-redux';
import { setModalAction } from '../store';

const useModal = (modalType) => {
    const dispatch = useDispatch();
    const isAuth = useSelector(state => state.isAuth);

    return () => {
        if (isAuth) {
            const classList = document.querySelector('body').classList
            if (modalType) {
                dispatch(setModalAction(modalType))
                classList.add('modal')
            } else {
                dispatch(setModalAction(null))
                classList.remove('modal')
            }
        } else {
            console.error('error: user is not auth')
        }
    }
}

export default useModal;
