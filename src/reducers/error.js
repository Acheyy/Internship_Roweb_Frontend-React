import {SET_ERROR} from "../actions/error";

export default (state = false, action) => {
    switch (action.type) {
        case SET_ERROR:
            state = action.payload;
            break;
    }

    return state;
};
