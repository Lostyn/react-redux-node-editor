import { combineReducers } from 'redux';
import editor from './EditorReducer';
import routing from './RoutingReducer';

const rootReducer = combineReducers({
	editor,
	routing
});

export default rootReducer