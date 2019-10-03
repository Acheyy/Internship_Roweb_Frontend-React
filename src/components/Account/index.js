import React, { Component } from 'react';
import Layout from '../Layout/Layout';
import http from '../../libs/http';
import CustomModal from '../Misc/CustomModal';
import uniqueId from 'react-html-id';
import { InputGroup, InputGroupAddon, Input, Button } from 'reactstrap';
import { FormGroup, Label } from 'reactstrap';
import Upload from './../Misc/Upload';
import '../../resources/styles/components/profile.scss';
import defaultUser from '../../resources/images/default-user.svg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class Profile extends Component {
	constructor(props) {
		super(props);

		uniqueId.enableUniqueIds(this);

		this.state = {
			showModal: false,
			user: {
				name: '',
				email: '',
				password: '',
				picture: ''
			},
			shownUser: {
				name: '',
				email: '',
				password: '',
				picture: defaultUser
			},
			reRender: false,
			mode: 'add'
		};
	}

	_toggle = () => {
		const { showModal } = this.state;

		this.setState({
			showModal: !showModal
		});
	};

	async componentDidUpdate(prevProps, prevState, snapshot) {
		const { reRender } = this.state;

		if (!prevState.reRender && reRender) {
			await this._getCurrentUser();
		}
	}

	async componentDidMount() {
		await this._getCurrentUser();
	}

	_getCurrentUser = async () => {
		const res = await http.route('profile').get();

		console.log(res);

		if (!res.isError) {
			const user = res.data;
			if (!user.picture) {
				user.picture = defaultUser;
			}

			this.setState({
				shownUser: user,
				reRender: false
			});
		} else {
			//TODO error
		}
	};

	appendToFormData = (formData, key, value) => {
		if (value) {
			formData.append(key, value);
		}
	};

	_save = async () => {
		const { user } = this.state;
		const { name, email, password, picture } = user;

		let formData = new FormData();

		this.appendToFormData(formData, 'name', name);
		this.appendToFormData(formData, 'email', email);
		this.appendToFormData(formData, 'password', password);
		this.appendToFormData(formData, 'picture', picture);

		const result = await http.route(`profile`).post(formData);

		if (!result.isError) {
			toast.success('🚀 Success! Profile updated.', {
				position: 'bottom-right',
				autoClose: 4000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true
			});
			this.setState({
				showModal: false,
				reRender: true
			});
		} else {
			toast.error(`💔 Error! There was a problem processing this request.`, {
				position: 'bottom-right',
				autoClose: 4000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true
			});
		}
	};

	_edit = (item) => {
		this.setState({
			user: item,
			showModal: true,
			mode: 'edit'
		});
	};

	_onChangeUser = (e) => {
		const { user } = this.state;
		const { name, value } = e.target;

		this.setState({
			user: {
				...user,
				[name]: value
			}
		});
	};
	_onUserPhotoUpload = (upload) => {
		const { user: { picture }, user } = this.state;
		this.setState({
			user: {
				...user,
				picture: upload[0]
			}
		});
	};

	render() {
		const { user, mode, showModal, shownUser } = this.state;
		return (
			<Layout>
				<ToastContainer
					position="bottom-right"
					autoClose={4000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnVisibilityChange
					draggable
					pauseOnHover
				/>
				<div className="user-profile-container">
					<div className="profile-card">
						<img
							className="profile-card-avatar"
							src={
								shownUser.picture === defaultUser ? (
									shownUser.picture
								) : (
									`${process.env.API_ROOT}/${shownUser.picture}`
								)
							}
							title={`${shownUser.name}'s avatar`}
							alt={`${shownUser.name}'s avatar`}
							onClick={() => this._edit(shownUser)}
						/>
						<h1 className="profile-card-title">{shownUser.name}</h1>
						<p className="profile-card-subtitle">{shownUser.email}</p>
						<CustomModal
							title={mode === 'add' ? 'Add user' : 'Edit user'}
							toggle={this._toggle}
							showModal={showModal}
							actionText="Save"
							action={this._save}
						>
							<FormGroup>
								<Label for={this.nextUniqueId()}>Name</Label>
								<Input
									type="text"
									name="name"
									value={user.name}
									id={this.lastUniqueId()}
									placeholder="Name..."
									onChange={this._onChangeUser}
								/>
							</FormGroup>
							<FormGroup>
								<Label for={this.nextUniqueId()}>Email</Label>
								<Input
									type="text"
									name="email"
									value={user.email}
									id={this.lastUniqueId()}
									placeholder="E-mail..."
									onChange={this._onChangeUser}
								/>
							</FormGroup>
							<FormGroup>
								<Label for={this.nextUniqueId()}>Password</Label>
								<Input
									type="password"
									name="password"
									value={user.password}
									id={this.lastUniqueId()}
									placeholder="Password..."
									onChange={this._onChangeUser}
								/>
							</FormGroup>
							<FormGroup>
								<FormGroup>
									<Label for={this.nextUniqueId()}>Photo:</Label>
									<Upload uploadedFile={user.picture} onFileUpload={this._onUserPhotoUpload} />
								</FormGroup>
							</FormGroup>
						</CustomModal>
						<Button className="mx-1 my-1 custom-button edit-profile" onClick={() => this._edit(shownUser)}>
							Edit profile
						</Button>
					</div>
				</div>
			</Layout>
		);
	}
}
