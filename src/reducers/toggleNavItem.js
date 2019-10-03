import { TOGGLE_NAV_ITEM } from '../actions/toggleNavItem';

export default (
	state = {
		visible: false
	},
	action
) => {
	switch (action.type) {
		case TOGGLE_NAV_ITEM:
			state = { ...state, visible: action.payload };
			break;
	}

	return state;
};
