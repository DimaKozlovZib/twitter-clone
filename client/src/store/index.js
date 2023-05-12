import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { ADD_USER, SET_AVATAR, SET_COVER, SET_ISAUTH, SET_MODALE } from './constans';

const defaultState = {
    user: {},
    isAuth: null,
    openModule: { type: null, data: {} },
    coverImage: null
}

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case ADD_USER:
            return { ...state, user: action.payload }
        case SET_ISAUTH:
            return { ...state, isAuth: action.payload }
        case SET_MODALE:
            return { ...state, openModule: action.payload }
        case SET_COVER:
            return { ...state, user: { ...state.user, coverImage: action.payload } }
        case SET_AVATAR:
            return { ...state, user: { ...state.user, img: action.payload } }
        default:
            return state;
    }
}

export const setModalAction = (payload) => ({ type: SET_MODALE, payload });
export const setCoverAction = (payload) => ({ type: SET_COVER, payload });
export const setAvatarAction = (payload) => ({ type: SET_AVATAR, payload });
export const setUserAction = (payload) => ({ type: ADD_USER, payload });
export const setAuthAction = (payload) => ({ type: SET_ISAUTH, payload });

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))

export default store;