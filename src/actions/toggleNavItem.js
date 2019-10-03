export const TOGGLE_NAV_ITEM = '@toggle-item';

export const toggleNavItem = (payload = {}) => {
	return {
		payload,
		type: TOGGLE_NAV_ITEM
	};
};

export default {
	toggleNavItem
};
