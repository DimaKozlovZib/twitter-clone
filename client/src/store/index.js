import { createStore } from 'redux';

const defaultState = {
    user: {

    }
}

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case 'ADD_USER':
            return { ...state, user: action.payload }
        default:
            return state;
    }
}

const store = createStore(reducer)

export default store;