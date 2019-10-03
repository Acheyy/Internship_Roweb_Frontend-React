import {WINDOW_RESIZE} from '../actions/responsive';

export default (state = {
    width: window.innerWidth,
    height: window.innerHeight
}, action) => {
    switch (action.type) {
        case WINDOW_RESIZE:
            state = {...state, ...action.payload};
            break;
    }

    return state;
};
