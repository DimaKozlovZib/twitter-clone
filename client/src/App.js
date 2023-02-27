import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import AppRouter from './appRouter';
import AddCover from './modules/AddCover/AddCover';
import { getUser } from './store/asyncGetUser';

function App() {
  const dispatch = useDispatch()
  const isAuth = useSelector(state => state.isAuth)
  const modalType = useSelector(state => state.openModuleType)

  useEffect(() => {
    if (isAuth === null) dispatch(getUser())
  }, []);

  return (
    <>
      {(modalType === 'ADD_COVER-MODAL') && <AddCover />}
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </>

  );
}

export default App;
