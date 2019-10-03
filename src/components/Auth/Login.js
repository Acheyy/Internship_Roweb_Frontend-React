import React, { Component } from 'react';
import AuthCard from '../Misc/AuthCard';
import { Button, FormGroup, Input, Label } from 'reactstrap';
import uniqueId from 'react-html-id';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import userActions from '../../actions/user';

@connect(
	(store) => ({
		user: store.user.user,
		errors: store.user.errors
	}),
	(dispatch) => ({
		...bindActionCreators({ ...userActions }, dispatch)
	})
)
export default class Login extends Component {
	constructor(props) {
		super(props);

		const jwt = sessionStorage.getItem('jwt');

		if (props.user || jwt) {
			this.props.history.push('/');
		}

		uniqueId.enableUniqueIds(this);

		this.state = {
			email: '',
			password: '',
			remember: false
		};
	}

	componentDidUpdate() {
		const { user } = this.props;

		if (user) {
			this.props.history.push('/');
		}
	}

	_onChange = (e) => {
		const { name, value } = e.target;

		this.setState({
			[name]: value
		});
	};

	_remember = (e) => {
		const { name, checked } = e.target;

		this.setState({
			[name]: checked
		});
	};

	_login = async () => {
		const { loginUser } = this.props;
		const { email, password, remember } = this.state;

		let data = {
			email,
			password
		};

		if (remember) {
			data.remember = true;
		}

		await loginUser(data);
	};

	render() {
		const { email, password, remember } = this.state;

		return (
			<AuthCard title="Login">
				<FormGroup>
					<Label for={this.nextUniqueId()}>Email</Label>
					<Input
						type="email"
						name="email"
						value={email}
						id={this.lastUniqueId()}
						placeholder="Email..."
						onChange={this._onChange}
					/>
				</FormGroup>
				<FormGroup>
					<Label for={this.nextUniqueId()}>Password</Label>
					<Input
						type="password"
						name="password"
						value={password}
						id={this.lastUniqueId()}
						placeholder="Password..."
						onChange={this._onChange}
					/>
				</FormGroup>
				<FormGroup check>
					<Label check>
						<Input name="remember" type="checkbox" checked={remember} onChange={this._remember} /> Remember
						me
					</Label>
				</FormGroup>
				<Button className="login-button" onClick={this._login}>
					Submit
				</Button>
				<Link to={'forgot-password'}>Forgot Password?</Link>
			</AuthCard>
		);
	}
}
