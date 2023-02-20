import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { login } from './API/userApi';
import './App.css';
import AppRouter from './appRouter';
import AddCover from './modules/AddCover/AddCover';

function App() {
  const dispatch = useDispatch()
  const isAuth = useSelector(state => state.isAuth)
  const modalType = useSelector(state => state.openModuleType)

  const getToken = async () => {
    try {
      if (!isAuth) {
        let response = await login()
        console.log(response)
        if (response && response.status === 200) {
          dispatch({ type: 'ADD_USER', payload: response.data.user })
          dispatch({ type: 'SET_ISAUTH', payload: true })
          return;
        }
        dispatch({ type: 'set_ISAUTH', payload: false })
      }
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    getToken()
  }, []);

  return (
    <>
      {!(modalType === 'ADD_COVER-MODAL') || <AddCover />}
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </>

  );
}

export default App;
