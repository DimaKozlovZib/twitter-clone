import { createStore } from 'redux';

const defaultState = {
    user: {

    },
    isAuth: null
}

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case 'ADD_USER':
            return { ...state, user: action.payload }
        case 'SET_ISAUTH':
            return { ...state, isAuth: action.payload }
        default:
            return state;
    }
}

const store = createStore(reducer)

export default store;