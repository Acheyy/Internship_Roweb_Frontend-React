import { combineReducers } from 'redux';

import responsive from './responsive';
import user from './user';
import error from './error';
import toggleNavItem from './toggleNavItem';

const reducers = {
	responsive,
	user,
	error,
	toggleNavItem
};

export default combineReducers(reducers);
