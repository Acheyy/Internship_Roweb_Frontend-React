export const SET_ERROR = '@set-error';

export const setError = (payload = false) => {
    return {
        type: SET_ERROR,
        payload
    };
};

export default {
    setError
};
