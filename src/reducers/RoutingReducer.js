import * as RoutingTypes from '../constants/RoutingActionTypes.js'

const initialState = {
	location: ''
}

export default function routing(state = initialState, action){
	switch(action.type) {
		case RoutingTypes.PUSH:
			return Object.assign( {}, state, {
				location: action.value
			});
		default:
			return state;
	}
}