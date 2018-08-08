import React from 'react';
import { render } from 'react-dom';
import App from './modules/App/App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter, Route } from 'react-router-dom'
import './index.css'

render(
	<BrowserRouter>
		<Route path={'/'} component={App} />
	</BrowserRouter>,
	document.getElementById('root')
);

registerServiceWorker();
