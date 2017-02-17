import 'babel-polyfill';
import './styles/main.css';

import React from 'react';
import { render } from 'react-dom';
import throttle from 'lodash/throttle';
import configureStore from './store/configureStore';
import { Provider } from 'react-redux';
import injectTapEventPlugin from "react-tap-event-plugin";

import App from './containers/App'

injectTapEventPlugin();

const store = configureStore({});

/*const state = JSON.parse(localStorage.getItem('state'));
const store = configureStore(state || {});
const saveState = throttle( () => {
	localStorage.setItem('state', JSON.stringify(store.getState()));
}, 1000);
store.subscribe(saveState);*/

render(
	<Provider store={store}>
		<App>
		</App>
	</Provider>,
	document.getElementById('root')
);