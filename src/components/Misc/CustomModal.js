import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

export default class CustomModal extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { title, action, actionText, children, showModal, toggle } = this.props;

		return (
			<Modal isOpen={showModal} toggle={() => toggle()} className={this.props.className}>
				<ModalHeader toggle={() => toggle()}>{title}</ModalHeader>
				<ModalBody>{children}</ModalBody>
				<ModalFooter>
					<Button color="primary" onClick={() => action()}>
						{actionText}
					</Button>{' '}
					<Button color="secondary" onClick={() => toggle()}>
						Cancel
					</Button>
				</ModalFooter>
			</Modal>
		);
	}
}
