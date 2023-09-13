import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, useLocation } from 'react-router-dom';
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
import { loginPath, registrationPath } from './routes';
import RetweetModal from './modules/RetweetModal/RetweetModal';

function App() {
  const location = useLocation();
  const dispatch = useDispatch()
  const isAuth = useSelector(state => state.isAuth)
  const modalType = useSelector(state => state.openModule);
  const theme = useSelector(state => state.theme);

  const [isLoaderModalActive, setIsLoaderModalActive] = useState(true);

  useEffect(() => {
    const appTheme = localStorage.getItem('appTheme');
    if (!appTheme || !['light', 'dark'].includes(appTheme)) {
      localStorage.setItem('appTheme', 'light');
    }
  }, []);

  useEffect(() => {
    const body = document.querySelector('body');
    body.setAttribute('theme', `${theme}-theme`)
  }, [theme]);

  useEffect(() => {
    if ([registrationPath, loginPath].includes(location.pathname)) return;
    if (isAuth === null) dispatch(getUser(setIsLoaderModalActive))
  }, [location]);

  return (
    <>
      <LoadModal />
      {(modalType.type === 'ADD_COVER-MODAL') && <AddCover />}
      {(modalType.type === 'DELETE_MESSAGE-MODAL') && <DeleteMessage data={modalType.data} />}
      {(modalType.type === 'CHANGE-AVATAR-MODAL') && <ChangeAvatar />}
      {(modalType.type === 'LOGOUT-MODAL') && <LogoutModal />}
      {(modalType.type === 'RETWEET-MODAL') && <RetweetModal retweetMessage={modalType.data} />}
      <AppRouter />
    </>

  );
}

export default App;
