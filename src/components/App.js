import React, {Component} from 'react';

import {Provider} from 'react-redux';
import Router from '../router';
import store from '../store';

import {onResize} from '../actions/responsive';

export default class App extends Component {
    componentDidMount() {
        window.addEventListener('resize', this._onResize);
    }

    _onResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        store.dispatch(onResize({
            width,
            height
        }));
    }

    render() {
        return (
            <Provider store={store}>
                <Router/>
            </Provider>
        );
    }
}
