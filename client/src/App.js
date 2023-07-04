import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import './styles/Modal.css';
import AppRouter from './appRouter';
import LoadModal from './components/LoadModal/LoadModal';
import AddCover from './modules/AddCover/AddCover';
import AddMessage from './modules/AddMessage/AddMessage';
import { getUser } from './store/asyncGetUser';
import DeleteMessage from './modules/DeleteMessage/DeleteMessage';
import ChangeAvatar from './modules/ChangeAvatar/ChangeAvatar';
import LogoutModal from './modules/LogoutModal/LogoutModal';

function App() {
  const dispatch = useDispatch()
  const isAuth = useSelector(state => state.isAuth)
  const modalType = useSelector(state => state.openModule);
  const [isLoaderModalActive, setIsLoaderModalActive] = useState(true);

  useEffect(() => {
    if (isAuth === null) dispatch(getUser(setIsLoaderModalActive))
  }, []);

  return (
    <>
      <LoadModal />
      <BrowserRouter>
        {(modalType.type === 'ADD_COVER-MODAL') && <AddCover />}
        {(modalType.type === 'ADD_MESSAGE-MODAL') && <AddMessage />}
        {(modalType.type === 'DELETE_MESSAGE-MODAL') && <DeleteMessage data={modalType.data} />}
        {(modalType.type === 'CHANGE-AVATAR-MODAL') && <ChangeAvatar />}
        {(modalType.type === 'LOGOUT-MODAL') && <LogoutModal />}
        <AppRouter />
      </BrowserRouter>
    </>

  );
}

export default App;
