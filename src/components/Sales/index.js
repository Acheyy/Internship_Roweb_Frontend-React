import React, { Component } from 'react';
import Layout from '../Layout/Layout';
import Table from '../Misc/Table';
import http from '../../libs/http';
import CustomModal from '../Misc/CustomModal';
import uniqueId from 'react-html-id';
import { Button, FormGroup, Input, Label, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import Upload from '../Misc/Upload';
import '../../resources/styles/components/products.scss';
import { toast, ToastContainer } from 'react-toastify';
import CustomSelect from '../Misc/CustomSelect';

export default class Products extends Component {
	constructor(props) {
		super(props);

		uniqueId.enableUniqueIds(this);

		this.state = {
			categories: [],
			products: [],
			showModal: false,
			product: {
				id: '',
				name: '',
				description: '',
				category_id: '',
				full_price: '',
				photo: '',
				quantity: ''
			},
			pagination: {
				currentPage: 1,
				limit: 10,
				totalPages: 1
			},
			reRender: false,
			mode: 'add'
		};
	}

	// _toggle = () => {
	//     const {showModal} = this.state;

	//     this.setState({
	//         showModal: !showModal
	//     });
	// };

	// async componentDidUpdate(prevProps, prevState, snapshot) {
	//     const {reRender} = this.state;

	//     if (!prevState.reRender && reRender) {
	//         await this._getProducts();
	//     }
	// }

	async componentDidMount() {
		await this._getCategories();
		await this._getProducts();
	}

	_getCategories = async () => {
		const res = await http.route('subcategories').get();
		if (!res.isError) {
			const response = res.data;

			let categories = [];

			response.length > 0 &&
				response.map((value, key) => {
					let category = {
						name: value.name,
						value: value.id,
						subItems: []
					};

					value.sub_categories.length > 0 &&
						value.sub_categories.map((sub, k) => {
							category.subItems.push({
								name: sub.name,
								value: sub.id
							});
						});

					categories.push(category);
				});

			this.setState({
				categories
			});
		} else {
			//TODO error
		}
	};

	_getProducts = async () => {
		const { currentPage, limit } = this.state.pagination;

		const res = await http.route('sales').get({
			page: currentPage,
			limit
		});
		// const res1 = await http.route('profile').get();
		// console.log(res1.data.type);

		if (!res.isError) {
			let products = res.data;
			let pagination = res.pagination;

			this.setState({
				products,
				pagination,
				reRender: false
			});
		} else {
			//TODO error
		}
	};

	// _onChangeCategory = (val) => {
	//     const {product} = this.state;

	//     this.setState({
	//         product: {
	//             ...product,
	//             category_id: val
	//         }
	//     });
	// };

	_onPageChange = (page) => {
		const { pagination } = this.state;

		this.setState({
			pagination: {
				...pagination,
				currentPage: page
			},
			reRender: true
		});
	};

	render() {
		const { products, showModal, product, mode, categories, pagination } = this.state;

		const columns = [
			{
				name: 'Id',
				property: 'id',
				width: '5%'
			},
			{
				name: 'Name',
				property: 'name',
				width: '15%'
			},
			{
				name: 'Description',
				property: 'description',
				width: '20%'
			},
			{
				name: 'Category',
				property: 'category_id',
				width: '15%',
				isId: true,
				list: categories,
				hasSubItems: true
			},
			{
				name: 'Full price',
				property: 'full_price',
				width: '10%'
			},
			{
				name: 'Quantity',
				property: 'quantity',
				width: '10%'
			},
			{
				name: 'Sale price',
				property: 'sale_price',
				width: '10%'
			},
			{
				name: 'Photo',
				property: 'photo',
				width: '15%'
			}
		];

		return (
			<Layout>
				<div className="products-container">
					<Table columns={columns} items={products} editItem={this._edit} deleteItem={this._delete} />

					<Pagination aria-label="Navigation">
						<PaginationItem>
							<PaginationLink
								first={'true'}
								{...(pagination.currentPage === 1
									? {
											disabled: true
										}
									: {})}
								onClick={() => this._onPageChange(1)}
							/>
						</PaginationItem>
						<PaginationItem>
							<PaginationLink
								previous
								{...(pagination.currentPage === 1
									? {
											disabled: true
										}
									: {})}
								onClick={() => this._onPageChange(pagination.currentPage - 1)}
							/>
						</PaginationItem>
						{/*<PaginationItem>*/}
						{/*    <PaginationLink href="#">*/}
						{/*        1*/}
						{/*    </PaginationLink>*/}
						{/*</PaginationItem>*/}
						{/*<PaginationItem>*/}
						{/*    <PaginationLink href="#">*/}
						{/*        2*/}
						{/*    </PaginationLink>*/}
						{/*</PaginationItem>*/}
						{/*<PaginationItem>*/}
						{/*    <PaginationLink href="#">*/}
						{/*        3*/}
						{/*    </PaginationLink>*/}
						{/*</PaginationItem>*/}
						{/*<PaginationItem>*/}
						{/*    <PaginationLink href="#">*/}
						{/*        4*/}
						{/*    </PaginationLink>*/}
						{/*</PaginationItem>*/}
						{/*<PaginationItem>*/}
						{/*    <PaginationLink href="#">*/}
						{/*        5*/}
						{/*    </PaginationLink>*/}
						{/*</PaginationItem>*/}
						<PaginationItem>
							<PaginationLink
								next
								{...(pagination.currentPage === pagination.totalPages
									? {
											disabled: true
										}
									: {})}
								onClick={() => this._onPageChange(pagination.currentPage + 1)}
							/>
						</PaginationItem>
						<PaginationItem>
							<PaginationLink
								last={'true'}
								{...(pagination.currentPage === pagination.totalPages
									? {
											disabled: true
										}
									: {})}
								onClick={() => this._onPageChange(pagination.totalPages)}
							/>
						</PaginationItem>
					</Pagination>
				</div>
			</Layout>
		);
	}
}
