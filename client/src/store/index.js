import { createStore } from 'redux';

const defaultState = {
    user: {},
    isAuth: null,
    openModuleType: null,
}

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case 'ADD_USER':
            return { ...state, user: action.payload }
        case 'SET_ISAUTH':
            return { ...state, isAuth: action.payload }
        case 'SET_MODALE':
            return { ...state, openModuleType: action.payload }
        case 'SET_COVER':
            return { ...state, user: { ...state.user, coverImage: action.payload } }
        default:
            return state;
    }
}

const store = createStore(reducer)

export default store;