import { useDispatch, useSelector } from 'react-redux';

const useModal = (modalType) => {
    const dispatch = useDispatch();
    const isAuth = useSelector(state => state.isAuth);

    return () => {
        if (isAuth) {
            const classList = document.querySelector('body').classList
            if (modalType) {
                dispatch({ type: 'SET_MODALE', payload: modalType })
                classList.add('modal')
            } else {
                dispatch({ type: 'SET_MODALE', payload: null })
                classList.remove('modal')
            }
        } else {
            console.error('error: user is not auth')
        }
    }
}

export default useModal;
