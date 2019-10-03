import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
	Collapse,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	NavItem,
	NavLink,
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Row
} from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';
import '../../resources/styles/layout/header.scss';
import { connect } from 'react-redux';

@connect((store) => ({
	user: store.user.user,
	visible: store.toggleNavItem.visible
}))
export default class Header extends React.Component {
	constructor(props) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.state = {
			isOpen: false
		};
	}
	toggle() {
		this.setState({
			isOpen: !this.state.isOpen
		});
	}
	render() {
		const { user, visible } = this.props;

		return (
			<div className="application-header">
				<Row>
					<Navbar color="light" light expand="md">
						<NavLink className="home-link" tag={RRNavLink} to="/" exact>
							Home
						</NavLink>
						<NavLink className="logout-link" tag={RRNavLink} to="/logout" exact>
							Logout
						</NavLink>
						<NavbarToggler onClick={this.toggle} />
						<Collapse isOpen={this.state.isOpen} navbar>
							<Nav className="ml-auto" navbar>
								<NavItem>
									<NavLink tag={RRNavLink} to="/products">
										Products
									</NavLink>
								</NavItem>
								{visible && (
									<NavItem>
										<NavLink tag={RRNavLink} to="#">
											TEST
										</NavLink>
									</NavItem>
								)}
								<NavItem>
									<NavLink tag={RRNavLink} to="/promotions">
										Promotions
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink tag={RRNavLink} to="/categories">
										Categories
									</NavLink>
								</NavItem>
								{user.type === 1 && (
									<NavItem>
										<NavLink tag={RRNavLink} to="/users">
											Users
										</NavLink>
									</NavItem>
								)}
								<NavItem>
									<NavLink tag={RRNavLink} to="/profile">
										Profile
									</NavLink>
								</NavItem>
							</Nav>
						</Collapse>
					</Navbar>
				</Row>
			</div>
		);
	}
}
