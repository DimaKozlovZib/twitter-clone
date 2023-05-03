import { useDispatch, useSelector } from 'react-redux';
import { setModalAction } from '../store';

const useModal = (modalType, wrapperSelector, data) => {
    const dispatch = useDispatch();
    const isAuth = useSelector(state => state.isAuth);

    const setModal = () => {
        if (isAuth) {
            dispatch(setModalAction({ type: modalType, data }))
            const classList = document.querySelector('body').classList;

            modalType && !classList.contains('modalActive') ? classList.add('modalActive') : classList.remove('modalActive')

        } else {
            console.error('error: user is not auth')
        }
    }

    const closeOnClickWrapper = (e) => {
        const wrapper = document.querySelector(wrapperSelector)
        if (e.target === wrapper) {
            e.preventDefault();
            e.stopPropagation();
            setModal()
        }
    }

    return [setModal, closeOnClickWrapper]
}

export default useModal;
