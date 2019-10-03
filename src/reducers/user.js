import {SET_USER, SET_USER_ERRORS, SET_LOADING} from '../actions/user';

export default (state = {
    user: false,
    errors: false,
    loading: true
}, action) => {
    switch (action.type) {
        case SET_USER:
            if (action.payload) {
                state = {...state, user: Object.assign({}, action.payload)};
            } else {
                state = {...state, user: false};
            }
            break;
        case SET_USER_ERRORS:
            if (action.payload) {
                state = {...state, errors: Object.assign({}, action.payload)};
            } else {
                state = {...state, errors: false};
            }
            break;
        case SET_LOADING:
            state = {...state, loading: action.payload};
            break;
    }

    return state;
};
