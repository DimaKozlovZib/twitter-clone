import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import './styles/Modal.css';
import AppRouter from './appRouter';
import LoadModal from './components/LoadModal/LoadModal';
import AddCover from './modules/AddCover/AddCover';
import { getUser } from './store/asyncGetUser';
import { setClearStore, setSavedDataAction } from './store/index';
import DeleteMessage from './modules/DeleteMessage/DeleteMessage';
import ChangeAvatar from './modules/ChangeAvatar/ChangeAvatar';
import LogoutModal from './modules/LogoutModal/LogoutModal';
import { loginPath, NavigatePath, registrationPath } from './routes';
import RetweetModal from './modules/RetweetModal/RetweetModal';
import MediaSlider from './modules/MediaSlider/MediaSlider';
import { $authHost, $host } from './API';
import { Helmet } from 'react-helmet-async';
import { DOMAIN } from './constans';

function App() {
  const location = useLocation();
  const dispatch = useDispatch()
  const isAuth = useSelector(state => state.isAuth)
  const modalType = useSelector(state => state.openModule);
  const theme = useSelector(state => state.theme);
  const navigate = useNavigate()

  const [isLoaderModalActive, setIsLoaderModalActive] = useState(true);

  useEffect(() => {
    const appTheme = localStorage.getItem('appTheme');
    if (!appTheme || !['light', 'dark'].includes(appTheme)) {
      localStorage.setItem('appTheme', 'light');
    }

    $authHost.interceptors.response.use((config) => config,
      async (error) => {
        if (error.response.status === 401) {
          try {
            const responseGetToken = await $host.get('/user/auth');
            localStorage.setItem('accessToken', responseGetToken.data.accessToken)

            return $authHost.request(error.config);
          } catch (error) {
            console.error('не авторизован')
            localStorage.removeItem('accessToken')

            dispatch(setClearStore())
          }
        }
      })

    if (isAuth === null) dispatch(getUser())

    return () => {
      dispatch(setSavedDataAction({}))
    }
  }, []);

  useEffect(() => {
    const body = document.querySelector('body');
    body.setAttribute('theme', `${theme}-theme`)
  }, [theme]);

  useEffect(() => {
    if (isAuth === null) return;

    if (
      isAuth === true ||
      [registrationPath, loginPath].includes(location.pathname.slice(1))
    ) return setIsLoaderModalActive(false);

    navigate(NavigatePath(registrationPath))
    setIsLoaderModalActive(false)
  }, [location?.pathname, isAuth]);

  return (
    <>
      <Helmet>
        <base target="_blank" href={DOMAIN} />
      </Helmet>
      {isLoaderModalActive ? <LoadModal /> : <></>}

      {(modalType.type === 'ADD_COVER-MODAL') && <AddCover />}
      {(modalType.type === 'DELETE_MESSAGE-MODAL') && <DeleteMessage data={modalType.data} />}
      {(modalType.type === 'CHANGE-AVATAR-MODAL') && <ChangeAvatar />}
      {(modalType.type === 'LOGOUT-MODAL') && <LogoutModal />}
      {(modalType.type === 'RETWEET-MODAL') && <RetweetModal retweetMessage={modalType.data} />}
      {(modalType.type === 'MEDIA-SLIDER-MODAL') && <MediaSlider data={modalType.data} />}
      <AppRouter />
    </>

  );
}

export default App;
