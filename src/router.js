import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { Protected } from './components/Misc/Protected';

import Home from './components/Home';
import Categories from './components/Categories';
import Profile from './components/Account';
import Logout from './components/Auth/Logout';
import Login from './components/Auth/Login';
import ForgotPassword from './components/Auth/ForgotPassword';
import Products from './components/Products';
import Sales from './components/Sales';
import Promotions from './components/Promotions';
import Users from './components/Users';

export default class Router extends Component {
	render() {
		return (
			<BrowserRouter>
				<Switch>
					<Route exact path="/login" component={Login} />
					<Route exact path="/forgot-password" component={ForgotPassword} />

					<Route exact path="/" component={Protected(Home)} />
					<Route path="/profile" component={Protected(Profile)} />
					<Route path="/categories" component={Protected(Categories)} />
					<Route path="/products" component={Protected(Products)} />
					<Route path="/sales" component={Protected(Sales)} />
					<Route path="/promotions" component={Protected(Promotions)} />
					<Route path="/users" component={Protected(Users)} />
					{/*<Route path="/profile" component={Protected(Profile)} />*/}

					<Route path="/logout" component={Logout} />
				</Switch>
			</BrowserRouter>
		);
	}
}
