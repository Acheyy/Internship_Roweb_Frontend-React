import React, { Component } from 'react';
import Layout from '../Layout/Layout';
import Table from '../Misc/Table';
import http from '../../libs/http';
import CustomModal from '../Misc/CustomModal';
import uniqueId from 'react-html-id';
import { Button, FormGroup, Input, Label } from 'reactstrap';
import { STORAGE_CATEGORIES } from '../../constants';
import '../../resources/styles/components/categories.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import toggleNavItemActions from '../../actions/toggleNavItem';

@connect(
	(store) => ({
		visible: store.toggleNavItem.visible
	}),
	(dispatch) => ({
		...bindActionCreators({ ...toggleNavItemActions }, dispatch)
	})
)
export default class Categories extends Component {
	constructor(props) {
		super(props);

		uniqueId.enableUniqueIds(this);

		this.state = {
			parentCategories: [],
			categories: [],
			showModal: false,
			category: {
				id: '',
				name: '',
				parent_id: ''
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
			await this._getCategories();
		}
	}

	async componentDidMount() {
		await this._getCategories();
	}

	_getCategories = async () => {
		const res = await http.route('categories').get();

		if (!res.isError) {
			const categories = res.data;
			let parentCategories = [];

			sessionStorage.setItem(STORAGE_CATEGORIES, JSON.stringify(categories));

			categories.length > 0 &&
				categories.map((item, k) => {
					if (item.parent_id == 0) {
						parentCategories.push(item);
					}
				});

			this.setState({
				categories,
				parentCategories,
				reRender: false
			});
		} else {
			//TODO error
		}
	};

	_addCategory = () => {
		this.setState({
			showModal: true,
			category: {
				id: '',
				name: '',
				parent_id: ''
			},
			mode: 'add'
		});
	};

	_save = async () => {
		const { category, mode } = this.state;

		let request = {
			name: category.name
		};
		if (category.parent_id != '' && category.parent_id != 0) {
			request.parent_id = category.parent_id;
		}

		let result;

		if (category.id !== '') {
			result = await http.route(`category/${category.id}`).patch(request);
		} else {
			result = await http.route(`category`).post(request);
		}

		if (!result.isError) {
			toast.success(`🚀 Success! Category ${mode === 'add' ? 'added' : 'updated'}.`, {
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
			//TODO mesaj, alte chestii*
		}
	};

	_edit = (item) => {
		this.setState({
			category: { ...item },
			showModal: true,
			mode: 'edit'
		});
	};

	_delete = async (itemId) => {
		const { categories } = this.state;

		const response = await http.route(`category/${itemId}`).delete();
		if (!response.isError) {
			toast.success(`❌ Done! Category deleted.`, {
				position: 'bottom-right',
				autoClose: 4000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true
			});
			const filteredCategories = categories.filter((category) => category.id !== itemId);
			this.setState({
				categories: filteredCategories,
				reRender: true
			});
		} else {
			toast.error(
				`💔 Error! There was a problem processing this request. Please make sure there are no products linked to this category.`,
				{
					position: 'bottom-right',
					autoClose: 7000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true
				}
			);
		}
	};

	_onChangeCategory = (e) => {
		const { category } = this.state;
		const { name, value } = e.target;

		this.setState({
			category: {
				...category,
				[name]: value
			}
		});
	};

	toggleTest = () => {
		const { toggleNavItem, visible } = this.props;

		toggleNavItem(!visible);
	};

	render() {
		const { categories, showModal, category, parentCategories, mode } = this.state;
		const { visible } = this.props;
		console.log(visible);
		let listCategories = [];

		categories.length > 0 &&
			categories.map((cat) => {
				if (category.parent_id == 0) {
					listCategories.push({
						name: cat.name,
						value: cat.id
					});
				}
			});

		let columns = [
			{
				name: 'Id',
				property: 'id',
				width: '10%'
			},
			{
				name: 'Name',
				property: 'name',
				width: '45%'
			},
			{
				name: 'Main category',
				property: 'parent_id',
				width: '20%',
				isId: true,
				list: listCategories
			},
			{
				name: 'Actions',
				property: 'actions',
				width: '25%'
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
				<div className="categories-container">
					<div className="actions-container">
						<Button className="add-button" onClick={this._addCategory}>
							Add a new category
						</Button>
					</div>
					<CustomModal
						title={mode === 'add' ? 'Add category' : 'Edit category'}
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
								value={category.name}
								id={this.lastUniqueId()}
								placeholder="Name..."
								onChange={this._onChangeCategory}
							/>
						</FormGroup>
						<FormGroup>
							<Label for={this.nextUniqueId()}>Parent category</Label>
							<Input
								type="select"
								name="parent_id"
								id={this.lastUniqueId()}
								value={category.parent_id}
								onChange={this._onChangeCategory}
							>
								<option value={0}>Select</option>
								{parentCategories.length > 0 &&
									parentCategories.map((item, k) => {
										if (item.id !== category.id) {
											return (
												<option key={k} value={item.id}>
													{item.name}
												</option>
											);
										}
									})}
							</Input>
						</FormGroup>
					</CustomModal>

					<Button
						onClick={() => {
							this.toggleTest();
						}}
					>
						Toggle
					</Button>

					<Table columns={columns} items={categories} editItem={this._edit} deleteItem={this._delete} />
				</div>
			</Layout>
		);
	}
}
