import http from '../libs/http';

import { setError } from './error';

export const SET_USER = '@set-user';
export const SET_USER_ERRORS = '@set-user-errors';
export const SET_LOADING = '@set-loading';

export const loginUser = (payload = {}) => {
	return async (dispatch) => {
		try {
			const res = await http.route('login').post({ ...payload });

			if (!res.isError) {
				sessionStorage.setItem('jwt', res.data.token);

				if (
					payload.hasOwnProperty('remember') &&
					payload.remember &&
					res.data.hasOwnProperty('rememberToken')
				) {
					localStorage.setItem('rememberToken', res.data.rememberToken);
				}

				dispatch(setUser(res.data.user));
				dispatch(setUserErrors(false));
				dispatch(setLoading(false));
			} else {
				dispatch(setUserErrors(res.errorMessage));
			}
		} catch (e) {
			dispatch(setError(e.message));
		}
	};
};

export const logoutUser = () => {
	return async (dispatch) => {
		try {
			const rememberToken = localStorage.getItem('rememberToken');

			let logoutParams = {};

			if (rememberToken) {
				logoutParams = Object.assign({}, { rememberToken });
			}

			const res = await http.route('logout').post(logoutParams, true);

			if (!res.isError) {
				sessionStorage.clear();
				localStorage.removeItem('rememberToken');
				dispatch(setUser(false));
			} else {
				dispatch(setUserErrors(res.errorMessage));
			}
		} catch (e) {
			dispatch(setError(e.message));
		}
	};
};

export const setUser = (payload) => {
	return {
		payload,
		type: SET_USER
	};
};

export const getUser = () => {
	return async (dispatch) => {
		try {
			const res = await http.route('user').get();

			if (!res.isError) {
				dispatch(setUser(res.data));
				dispatch(setUserErrors(false));
				dispatch(setLoading(false));
			} else {
				dispatch(setUserErrors(res.errorMessage));
			}
		} catch (e) {
			dispatch(setError(e.message));
		}
	};
};

export const setUserErrors = (payload) => {
	return {
		payload,
		type: SET_USER_ERRORS
	};
};

export const setLoading = (payload) => {
	return {
		payload,
		type: SET_LOADING
	};
};

export default {
	loginUser,
	logoutUser,
	setUser,
	getUser,
	setUserErrors,
	setLoading
};
