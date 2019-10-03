import React, {Component} from 'react';
import Layout from '../Layout/Layout';
import Table from '../Misc/Table';
import http from '../../libs/http';
import CustomModal from '../Misc/CustomModal';
import uniqueId from 'react-html-id';
import {Button, FormGroup, Input, Label, Pagination, PaginationItem, PaginationLink} from 'reactstrap';
import Upload from '../Misc/Upload';
import '../../resources/styles/components/products.scss';
import {toast, ToastContainer} from 'react-toastify';
import CustomSelect from "../Misc/CustomSelect";

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
                limit: 5,
                totalPages: 1
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
            await this._getProducts();
        }
    }

    async componentDidMount() {
        await this._getCategories();
        await this._getProducts();
    }

    _getCategories = async () => {
        const res = await http.route('subcategories').get();
        if (!res.isError) {
            const response = res.data;

            let categories = [];

            response.length > 0 && response.map((value, key) => {
                let category = {
                    name: value.name,
                    value: value.id,
                    subItems: []
                };

                value.sub_categories.length > 0 && value.sub_categories.map((sub, k) => {
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
        const {currentPage, limit} = this.state.pagination;

        const res = await http.route('products').get({
            page: currentPage, limit
        });
        const res1 = await http.route('profile').get();
        console.log(res1.data.type);

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


    _addProduct = () => {
        this.setState({
            showModal: true,
            product: {
                id: '',
                name: '',
                description: '',
                category_id: '',
                full_price: '',
                photo: '',
                quantity: ''
            },
            mode: 'add'
        });
    };

    _save = async () => {
        const {product, mode} = this.state;

        let formData = new FormData();

        formData.append('name', product.name);
        formData.append('description', product.description);
        formData.append('category_id', product.category_id);
        formData.append('full_price', product.full_price);
        if (product.photo !== '') {
            formData.append('photo', product.photo);
        }
        formData.append('quantity', product.quantity);

        let result;

        if (product.id !== '') {
            result = await http.route(`product/${product.id}`).post(formData);
            console.log(product);
        } else {
            result = await http.route(`product`).post(formData);
        }

        if (!result.isError) {
            toast.success(`🚀 Success! Product ${mode === 'add' ? 'added' : 'updated'}.`, {
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
            product: {
                id: item.id,
                name: item.name,
                description: item.description,
                category_id: item.category_id,
                full_price: item.full_price,
                photo: '',
                old_photo: item.photo,
                quantity: item.quantity
            },
            showModal: true,
            mode: 'edit'
        });
    };

    _delete = async (itemId) => {
        const response = await http.route(`product/${itemId}`).delete();
        if (!response.isError) {
            toast.success(`❌ Done! Product deleted.`, {
                position: 'bottom-right',
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            this.setState({
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

    _onChangeProduct = (e) => {
        const {product} = this.state;
        const {name, value} = e.target;

        this.setState({
            product: {
                ...product,
                [name]: value
            }
        });
    };

    _onChangeCategory = (val) => {
        const {product} = this.state;

        this.setState({
            product: {
                ...product,
                category_id: val
            }
        });
    };

    _onProductPhotoUpload = (upload) => {
        const {product} = this.state;

        this.setState({
            product: {
                ...product,
                photo: upload[0]
            }
        });
    };

    _onPageChange = (page) => {
        const {pagination} = this.state;

        this.setState({
            pagination: {
                ...pagination,
                currentPage: page
            },
            reRender: true
        });
    };

    createPaginationNumbers = (totalPages, currentPage) => {
        let pages = []
    
        for (let i = 1; i < totalPages + 1; i++) {
          pages.push(
          <PaginationItem key={i}>
            <PaginationLink {...(currentPage == i ? {
            disabled: true 
        } : {})}
       
        className={`${currentPage == i ? "disabled" : ""}`}
        
        onClick={() => this._onPageChange(i)} >
               {i}
            </PaginationLink>
        </PaginationItem>          
          )
        }
        return pages
      }
    

    render() {
        const {products, showModal, product, mode, categories, pagination} = this.state;

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
                width: '10%',
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
                width: '10%'
            },
            {
                name: 'Actions',
                property: 'actions',
                width: '10%'
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
                <div className="products-container">
                    <div className="actions-container">
                        <Button className="add-button" onClick={this._addProduct}>
                            Add a new product
                        </Button>
                    </div>
                    <CustomModal
                        title={mode === 'add' ? 'Add product' : 'Edit product'}
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
                                value={product.name}
                                id={this.lastUniqueId()}
                                placeholder="Name..."
                                onChange={this._onChangeProduct}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for={this.nextUniqueId()}>Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={product.description}
                                id={this.lastUniqueId()}
                                placeholder="Description..."
                                onChange={this._onChangeProduct}
                            />
                        </FormGroup>
                        <FormGroup>
                            <CustomSelect
                                label="Category"
                                value={product.category_id}
                                onChange={this._onChangeCategory}
                                options={categories}
                                subItems
                                onlySubItems
                            />


                        </FormGroup>
                        <FormGroup>
                            <Label for={this.nextUniqueId()}>Full price</Label>
                            <Input
                                type="text"
                                name="full_price"
                                value={product.full_price}
                                id={this.lastUniqueId()}
                                placeholder="Full price..."
                                onChange={this._onChangeProduct}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for={this.nextUniqueId()}>Photo:</Label>
                            <Upload uploadedFile={product.photo} onFileUpload={this._onProductPhotoUpload}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for={this.nextUniqueId()}>Quantity</Label>
                            <Input
                                type="text"
                                name="quantity"
                                value={product.quantity}
                                id={this.lastUniqueId()}
                                placeholder="Quantity..."
                                onChange={this._onChangeProduct}
                            />
                        </FormGroup>
                    </CustomModal>
                    <Button>Toggle</Button>
                    <Table columns={columns} items={products} editItem={this._edit} deleteItem={this._delete}/>

                    <Pagination aria-label="Navigation">
                        <PaginationItem>
                            <PaginationLink first={"true"} {...(pagination.currentPage === 1 ? {
                                disabled: true
                            } : {})} onClick={() => this._onPageChange(1)}/>
                        </PaginationItem>

                        <PaginationItem>
                            <PaginationLink previous {...(pagination.currentPage === 1 ? {
                                disabled: true
                            } : {})} onClick={() => this._onPageChange(pagination.currentPage - 1)}/>
                        </PaginationItem>

                            {this.createPaginationNumbers(pagination.totalPages,pagination.currentPage)}

                        <PaginationItem>
                            <PaginationLink next {...(pagination.currentPage === pagination.totalPages ? {
                                disabled: true
                            } : {})} onClick={() => this._onPageChange(pagination.currentPage + 1)}/>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink last={"true"} {...(pagination.currentPage === pagination.totalPages ? {
                                disabled: true
                            } : {})} onClick={() => this._onPageChange(pagination.totalPages)}/>
                        </PaginationItem>
                    </Pagination>

                </div>
            </Layout>
        );
    }
}
