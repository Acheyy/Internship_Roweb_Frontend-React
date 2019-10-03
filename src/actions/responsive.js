export const WINDOW_RESIZE = '@window-resize';

export const onResize = (payload = {}) => {
    return {
        payload,
        type: WINDOW_RESIZE
    };
};

export default {
    onResize
};
