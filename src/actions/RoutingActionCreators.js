import * as RoutingTypes from '../constants/RoutingActionTypes.js'

export function push(value) {
	return {
		type: RoutingTypes.PUSH,
		value
	};
}