import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
//import store from './store'
import './index.scss'
import App from './components/App'

import Amplify from 'aws-amplify';
import config from './config.json';

import * as serviceWorker from './serviceWorker';
import configureStore from './redux/configureStore'

const rootElement = document.getElementById('root')

const store = configureStore();

Amplify.configure({
    Auth: {
        region: config.cognito.region,
        userPoolId: config.cognito.userPoolId,
        userPoolWebClientId: config.cognito.userPoolWebClientId,
        identityPoolId: config.cognito.identityPoolId
    },
});

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    rootElement
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
