import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { STORAGE_CATEGORIES } from '../../constants';
import '../../resources/styles/misc/table.scss';

export default class Table extends Component {
	static propTypes = {
		columns: PropTypes.array.isRequired,
		items: PropTypes.array.isRequired,
		editItem: PropTypes.func.isRequired,
		deleteItem: PropTypes.func.isRequired
	};

	getMainCategoryName = (item) => {
		const { items } = this.props;
		const { parent_id: isSubCategory } = item;

		if (isSubCategory) {
			const result = items.find((singleItem) => singleItem.id === isSubCategory);
			if (result) {
				return result.name;
			}
		} else {
			return '';
		}
	};

	getCategoryNameForProducts = (item) => {
		const { category_id: categoryId } = item;
		const categories = JSON.parse(sessionStorage.getItem(STORAGE_CATEGORIES));

		const foundCategory = categories.find((category) => category.id === categoryId);
		if (foundCategory) {
			return foundCategory.name;
		} else {
			return '';
		}
	};

	render() {
		const { columns, items, editItem, deleteItem } = this.props;

		return (
			<div className="table">
				<div className="table-header">
					{columns.map((value, key) => {
						let style = { width: value.width };

						return (
							<div className="table-header-item" style={style} key={key}>
								{value.name}
							</div>
						);
					})}
				</div>
				{items.map((item, k) => {
					return (
						<div key={k} className="table-line">
							{columns.map((value, key) => {
								let style = { width: value.width };

								if (value.property === 'actions') {
									return (
										<div className="table-item" style={style} key={key}>
											<Button
												className="mx-1 my-1 custom-button edit-button"
												size="sm"
												onClick={() => editItem(item)}
											>
												Edit
											</Button>
											<Button
												className="mx-1 my-1 custom-button delete-button"
												size="sm"
												onClick={() => deleteItem(item.id)}
											>
												Delete
											</Button>
										</div>
									);
								}

								if (value.isId) {
									let selectedValue = null;

									value.list.length > 0 &&
										value.list.map((it, key) => {
											if (it.value == item[value.property]) {
												selectedValue = { ...it };
											}

											if (value.hasSubItems) {
												it.subItems.length > 0 &&
													it.subItems.map((sub, k) => {
														if (sub.value == item[value.property]) {
															selectedValue = { ...sub };
														}
													});
											}
										});

									return (
										<div
											className={`table-item ${selectedValue && selectedValue.name == 'Admin'
												? 'admin'
												: ''}`}
											style={style}
											key={key}
										>
											{selectedValue && selectedValue.name}
										</div>
									);
								}

								if (value.property === 'picture' || value.property === 'photo') {
									if (item[value.property]) {
										return (
											<div className="table-item" style={style} key={key}>
												<img src={`${process.env.API_ROOT}/${item[value.property]}`} />;
											</div>
										);
									} else {
										return (
											<div className="table-item" style={style} key={key}>
												No picture available
											</div>
										);
									}
								}

								return (
									<div className="table-item" style={style} key={key}>
										{item[value.property]}
									</div>
								);
							})}
						</div>
					);
				})}
			</div>
		);
	}
}
