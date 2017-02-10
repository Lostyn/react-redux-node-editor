import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from '../reducers'
import thunkMiddleware from 'redux-thunk'

export default function configureStore(initialState) {
	const store = createStore(
		rootReducer,
		initialState,
		compose(
	      applyMiddleware(
	        thunkMiddleware
	      ),
	      window.devToolsExtension ? window.devToolsExtension() : f => f
	    )
	);

	if (module.hot) {
		module.hot.accept('../reducers', () => {
			const nextReducer = require('../reducers').default
			store.replaceReducer(nextReducer)
		})
	}

	return store;
}