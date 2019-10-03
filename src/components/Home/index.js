import React, { Component } from 'react';
import Layout from '../Layout/Layout';
import { Link } from 'react-router-dom';
import { STORAGE_CATEGORIES } from '../../constants';
import http from '../../libs/http';
import {connect} from "react-redux";

@connect(
	(store) => ({
		user: store.user.user
	})
)
export default class Home extends Component {
	constructor(props) {
		super(props);
	}

	// Categories are needed for the products page.
	// Currently, there's no way to communicate between Products and Categories pages. So we use sessionStorage.
	_getCategories = async () => {
		const res = await http.route('categories').get();

		if (!res.isError) {
			const categories = res.data;
			sessionStorage.setItem(STORAGE_CATEGORIES, JSON.stringify(categories));
		} else {
			//TODO error
		}
	};

	async componentDidMount() {
		// Set the categories for sessionStorage. Don't repeat this process if they're already set.
		if (!sessionStorage.getItem(STORAGE_CATEGORIES)) {
			await this._getCategories();
		}
	}

	render() {
		const {user} = this.props;

		return (
			<Layout>
				<div className="cards-container">
					<Link className="link-container" to="/products">
						<div className="card">
							<div className="card-container">
								<img
									className="card-image"
									src={`${process.env.API_ROOT}/uploads/products-image.jpg`}
								/>
								<h3 className="card-title">
									<b>Products</b>
								</h3>
								<p className="card-text">Manage all products available in the application.</p>
							</div>
						</div>
					</Link>
					<Link className="link-container" to="/categories">
						<div className="card">
							<div className="card-container">
								<img
									className="card-image"
									src={`${process.env.API_ROOT}/uploads/categories-image.jpg`}
								/>
								<h3 className="card-title">
									<b>Categories</b>
								</h3>{' '}
								<p className="card-text">Manage all categories available in the application.</p>
							</div>
						</div>
					</Link>
					{user.type === 1 && <Link className="link-container" to="/users">
						<div className="card">
							<div className="card-container">
								<img className="card-image" src={`${process.env.API_ROOT}/uploads/users-image.jpg`} />
								<h3 className="card-title">
									<b>Users</b>
								</h3>{' '}
								<p className="card-text">Manage all users registered in the application.</p>
							</div>
						</div>
					</Link>}
					<Link className="link-container" to="/profile">
						<div className="card">
							<div className="card-container">
								<img className="card-image" src={`${process.env.API_ROOT}/uploads/profile-image.jpg`} />
								<h3 className="card-title">
									<b>Profile</b>
								</h3>
								<p className="card-text">Manage your profile.</p>
							</div>
						</div>
					</Link>
				</div>
			</Layout>
		);
	}
}
