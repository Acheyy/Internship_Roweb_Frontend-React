import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import userActions from '../../actions/user';

export const Protected = (WrappedComponent) => {
	return connect(
		(store) => ({
			user: store.user.user,
			loading: store.user.loading
		}),
		(dispatch) => ({
			...bindActionCreators(userActions, dispatch)
		})
	)(
		class extends Component {
			constructor(props) {
				super(props);

				const rememberToken = localStorage.getItem('rememberToken');

				const jwt = sessionStorage.getItem('jwt');

				if (rememberToken && !this.props.user) {
					const { loginUser } = this.props;

					let credentials = {
						rememberToken
					};

					loginUser(credentials);
				} else if (!this.props.user && jwt) {
					const { getUser } = this.props;

					getUser();
				} else if (!jwt && props.location.pathname !== '/login') {
					console.log('redirected');
					this.props.history.push('/login');
				}
			}

			render() {
				const { loading } = this.props;

				if (loading) {
					return null;
				}

				return <WrappedComponent {...this.props} />;
			}
		}
	);
};
