import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Container, Modal } from 'reactstrap';

import Header from './Header';
import Footer from './Footer';
import '../../resources/styles/layout/layout.scss';

@connect(
	(store) => ({
		error: store.error
	}),
	(dispatch) => ({})
)
export default class Layout extends Component {
	render() {
		const { error } = this.props;

		return (
			<Container fluid={true} className={'layout'}>
				{error && <div>{error}</div>}
				<Header />
				<div className={'content'}>{this.props.children}</div>
				<Footer />
			</Container>
		);
	}
}
