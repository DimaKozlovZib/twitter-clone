import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { ADD_USER, SET_AVATAR, SET_COVER, SET_DATA, SET_ISAUTH, SET_MODALE, SET_THEME, SET_VIEWED_DATA } from './constans';

const defaultState = {
    user: {},
    isAuth: null,
    openModule: { type: null, data: {} },
    coverImage: null,
    theme: localStorage.getItem('appTheme') || 'light',
    data: {},
    viewedData: []
}

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case ADD_USER:
            return { ...state, user: action.payload }
        case SET_ISAUTH:
            return { ...state, isAuth: action.payload }
        case SET_MODALE:
            return { ...state, openModule: action.payload }
        case SET_THEME:
            return { ...state, theme: action.payload }
        case SET_COVER:
            return { ...state, user: { ...state.user, coverImage: action.payload } }
        case SET_AVATAR:
            return { ...state, user: { ...state.user, img: action.payload } }
        case SET_DATA:
            return { ...state, data: action.payload }
        case SET_VIEWED_DATA:
            return { ...state, viewedData: action.payload }
        default:
            return state;
    }
}

export const setModalAction = (payload) => ({ type: SET_MODALE, payload });
export const setThemeAction = (payload) => ({ type: SET_THEME, payload });
export const setCoverAction = (payload) => ({ type: SET_COVER, payload });
export const setAvatarAction = (payload) => ({ type: SET_AVATAR, payload });
export const setUserAction = (payload) => ({ type: ADD_USER, payload });
export const setAuthAction = (payload) => ({ type: SET_ISAUTH, payload });
export const setDataAction = (payload) => ({ type: SET_DATA, payload });
export const setViewedDataAction = (payload) => ({ type: SET_VIEWED_DATA, payload });

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))

export default store;