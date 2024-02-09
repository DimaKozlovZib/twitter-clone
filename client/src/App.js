import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import './App.css';
import './styles/Modal.css';
import AppRouter from './appRouter';
import LoadModal from './components/LoadModal/LoadModal';
import AddCover from './modules/AddCover/AddCover';
import { getUser } from './store/asyncGetUser';
import { setSavedDataAction } from './store/index';
import DeleteMessage from './modules/DeleteMessage/DeleteMessage';
import ChangeAvatar from './modules/ChangeAvatar/ChangeAvatar';
import LogoutModal from './modules/LogoutModal/LogoutModal';
import { loginPath, registrationPath } from './routes';
import RetweetModal from './modules/RetweetModal/RetweetModal';
import MediaSlider from './modules/MediaSlider/MediaSlider';
import Helmet from "react-helmet"
import logo57 from './images/logo57.png'
import logo72 from './images/logo72.png'
import { DOMAIN, PROJECT_NAME } from './constans';

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
    return () => {
      dispatch(setSavedDataAction({}))
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
      <Helmet htmlAttributes={{ "lang": "ru", "amp": undefined }} // amp takes no value
        base={{ "target": "_blank", "href": DOMAIN }}
        title={`${PROJECT_NAME}`}
        meta={[
          { "name": "description", "content": `${PROJECT_NAME} - cовременная социальная сеть для туристов (school project)` },
          { "property": "og:type", "content": "article" }
        ]}
        link={[
          { "rel": "icon", "type": "image/png", "href": `${logo57}` },
          { "rel": "apple-touch-icon", "href": `${logo57}` },
          { "rel": "apple-touch-icon", "sizes": "72x72", "href": `${logo72}` }
        ]} />
      <LoadModal />
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
