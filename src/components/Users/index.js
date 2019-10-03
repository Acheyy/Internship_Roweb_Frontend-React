import React, {Component} from 'react';
import Layout from '../Layout/Layout';
import Table from '../Misc/Table';
import http from '../../libs/http';
import CustomModal from '../Misc/CustomModal';
import uniqueId from 'react-html-id';
import {Button, FormGroup, Input, Label} from 'reactstrap';
import Upload from '../Misc/Upload';
import '../../resources/styles/components/users.scss';
import {toast, ToastContainer} from 'react-toastify';
import {connect} from "react-redux";

@connect(
    (store) => ({
        user: store.user.user
    })
)
export default class Users extends Component {
    constructor(props) {
        super(props);

        uniqueId.enableUniqueIds(this);

        this.state = {
            users: [],
            showModal: false,
            user: {
                id: '',
                name: '',
                type: '',
                password: '',
                picture: '',
                email: ''
            },
            reRender: false,
            mode: 'add'
        };
    }

    _toggle = () => {
        const {showModal} = this.state;

        this.setState({
            showModal: !showModal
        });
    };

    async componentDidUpdate(prevProps, prevState, snapshot) {
        const {reRender} = this.state;

        if (!prevState.reRender && reRender) {
            await this._getUsers();
        }
    }

    async componentDidMount() {
    	const {user} = this.props;

    	if (user.type === 0) {
			this.props.history.push('/');
		}

        await this._getUsers();
    }

    _getUsers = async () => {
        let res = await http.route('users').get();

        if (!res.isError) {
            let users = res.data;

            this.setState({
                users,
                reRender: false
            });
        } else {
            //TODO error
        }
    };

    _addUser = () => {
        this.setState({
            showModal: true,
            user: {
                id: '',
                name: '',
                type: '',
                password: '',
                picture: '',
                email: ''
            },
            mode: 'add'
        });
    };

    appendToFormData = (formData, key, value) => {
        if (value) {
            formData.append(key, value);
        }
    };

    _save = async () => {
        const {user, mode} = this.state;
        const {id, name, description, type, password, picture, email} = user;
        let formData = new FormData();

        this.appendToFormData(formData, 'id', id);
        this.appendToFormData(formData, 'name', name);
        this.appendToFormData(formData, 'description', description);
        this.appendToFormData(formData, 'type', type);
        this.appendToFormData(formData, 'password', password);
        this.appendToFormData(formData, 'picture', picture);
        this.appendToFormData(formData, 'email', email);

        let result;

        if (user.id !== '') {
            result = await http.route(`users/${user.id}`).post(formData);
            console.log(user);
        } else {
            result = await http.route(`users`).post(formData);
        }

        if (!result.isError) {
            toast.success(`🚀 Success! User ${mode === 'add' ? 'added' : 'updated'}.`, {
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
            user: {...item},
            showModal: true,
            mode: 'edit'
        });
    };

    _delete = async (itemId) => {
        const {users} = this.state;

        const response = await http.route(`users/${itemId}`).delete();
        if (!response.isError) {
            toast.success(`❌ Done! User deleted.`, {
                position: 'bottom-right',
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            const filteredUsers = users.filter((user) => user.id !== itemId);
            this.setState({
                users: filteredUsers,
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

    _onChangeUser = (e) => {
        const {user} = this.state;
        const {name, value} = e.target;

        this.setState({
            user: {
                ...user,
                [name]: value
            }
        });
    };

    _onUsersPictureUpload = (upload) => {
        const {user: {picture}, user} = this.state;
        this.setState({
            user: {
                ...user,
                picture: upload[0]
            }
        });
    };

    render() {
        const {users, showModal, user, mode} = this.state;

        let columns = [
            {
                name: 'Id',
                property: 'id',
                width: '10%'
            },
            {
                name: 'Name',
                property: 'name',
                width: '20%'
            },
            {
                name: 'Email',
                property: 'email',
                width: '20%'
            },
            {
                name: 'Picture',
                property: 'picture',
                width: '25%'
            },
            {
                name: 'Type',
                property: 'type',
                width: '10%',
                isId: true,
                list: [
                    {
                        name: 'Normal User',
                        value: 0
                    },
                    {
                        name: 'Admin',
                        value: 1
                    }
                ]
            },
            {
                name: 'Actions',
                property: 'actions',
                width: '15%'
            }
        ];

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
                <div className="users-container">
                    <div className="actions-container">
                        <Button className="add-button" onClick={this._addUser} size="lg">
                            Add a new user
                        </Button>
                    </div>
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
                                placeholder="email..."
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
                                placeholder="password..."
                                onChange={this._onChangeUser}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for={this.nextUniqueId()}>Picture:</Label>
                            <Upload uploadedFile={users.picture} onFileUpload={this._onUsersPictureUpload}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for={this.nextUniqueId()}>Type</Label>
                            <Input
                                type="select"
                                name="type"
                                id={this.lastUniqueId()}
                                value={user.type}
                                onChange={this._onChangeUser}
                            >
                                <option value={0}>Normal User</option>
                                <option value={1}>Admin</option>
                            </Input>
                        </FormGroup>
                    </CustomModal>
                    <Table columns={columns} items={users} editItem={this._edit} deleteItem={this._delete}/>
                </div>
            </Layout>
        );
    }
}
