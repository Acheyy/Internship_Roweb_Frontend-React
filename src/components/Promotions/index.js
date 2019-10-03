import React, {Component} from 'react';
import Layout from '../Layout/Layout';
import Table from '../Misc/Table';
import http from '../../libs/http';
import CustomModal from '../Misc/CustomModal';
import uniqueId from 'react-html-id';
import {Button, FormGroup, Input, Label, Pagination, PaginationItem, PaginationLink} from 'reactstrap';
import MultipleSelect from './../Misc/MultipleSelect';

export default class Promotions extends Component {
    constructor(props) {
        super(props);

        uniqueId.enableUniqueIds(this);

        this.state = {
            promotions: [],
            showModal: false,
            promotion: {
                id: '',
                name: '',
                percent: ''
            },
            pagination: {
                currentPage: 1,
                limit: 5,
                totalPages: 1
            },
            categories: [],
            products: [],
            reRender: false,
            mode: 'add',
            selectedP: [],
            selectedC: []
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
            await this._getPromotions();
        }
    }

    async componentDidMount() {
        await this._getPromotions();
        await this._getCategories();
        await this._getProducts();
    }

    _getPromotions = async () => {
		const res = await http.route('promotions').get();

		if (!res.isError) {
			const promotions = res.data;

			this.setState({
				promotions,
				reRender: false
			});
		} else {
			//TODO error
		}
    };

    _getCategories = async () => {
        const res = await http.route('categories').get();
        if (!res.isError) {
			const categories = res.data;

			this.setState({
				categories,
				reRender: false
			});
		} else {
			//TODO error
		}
    }
    _getProducts = async () => {
        const res = await http.route('products').get();
        if (!res.isError) {
			const products = res.data;

			this.setState({
				products,
				reRender: false
			});
		} else {
			//TODO error
		}
    }
    
    _addPromotion = () => {
		this.setState({
			showModal: true,
			promotion: {
                id: '',
                name: '',
                percent: ''
			},
			mode: 'add'
		});
    };
    
    _save = async () => {
		const { promotion, mode } = this.state;

		let request = {
            name: promotion.name,
            percent: promotion.percent,
            user_id: this.props.user.id
		};

		let result;

		if (promotion.id !== '') {
			result = await http.route(`promotion/${promotion.id}`).patch(request);
		} else {
			result = await http.route(`promotion`).post(request);
		}

		if (!result.isError) {
			
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
			promotion: { ...item },
			showModal: true,
			mode: 'edit'
		});
    };
    
    _delete = async (itemId) => {

		const response = await http.route(`promotion/${itemId}`).delete();
		if (!response.isError) {
			
			this.setState({
				reRender: true
			});
		} else {
			//ERROR
		}
    };

    _onChangePromotion = (e) => {
		const { promotion } = this.state;
		const { name, value } = e.target;

		this.setState({
			promotion: {
				...promotion,
				[name]: value
			}
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

      _getSelectedCategories = (selectedC, nume) => {
        
        this.setState({
            selectedC: [...selectedC]
        });
        
    };
      _getSelectedProducts = (selectedP, nume) => {
        
        this.setState({
            selectedP: [...selectedP]
        });
        
    };

    render() {
        const {promotions, showModal, promotion, mode, pagination, categories, selectedC, selectedP, products} = this.state;
        var options = [];
        categories.map((category) => options.push({label : category.name, value: category.id}));
        products.map((product) => options.push({label : product.name, value: product.id}));

        const columns = [
            {
                name: 'Id',
                property: 'id',
                width: '20%'
            },
            {
                name: 'Name',
                property: 'name',
                width: '20%'
            },
            {
                name: 'Percent',
                property: 'percent',
                width: '20%'
            },
            {
                name: 'User_id',
                property: 'user_id',
                width: '40%'
            }
            
            
        ];

        return (
            <Layout>
                <div className="promotions-container">
                    <div className="actions-container">
                        <Button className="add-button" onClick={this._addPromotion}>
                            Add a new promotion
                        </Button>
                    </div>
                    <CustomModal
                        title={mode === 'add' ? 'Add promotion' : 'Edit promotion'}
                        toggle={this._toggle}
                        showModal={showModal}
                        actionText="Save"
                        action={this._save}
                    >
                        <FormGroup>
                            <Label for={this.nextUniqueId()}>name</Label>
                            <Input
                                type="text"
                                name="name"
                                value={promotion.name}
                                id={this.lastUniqueId()}
                                placeholder="Name..."
                                onChange={this._onChangePromotion}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for={this.nextUniqueId()}>percent</Label>
                            <Input
                                type="text"
                                name="percent"
                                value={promotion.percent}
                                id={this.lastUniqueId()}
                                placeholder="Full price..."
                                onChange={this._onChangePromotion}
                            />
                        </FormGroup>
                        <MultipleSelect 
                        options={options} 
                        selected={selectedC} 
                        selectAll 
                        label={"Promotion for:"}
                        getSelected={(arr) => this._getSelectedCategories(arr,"cat")}
                        getSelected={(arr) => this._getSelectedProducts(arr,"prod")}/>
                    </CustomModal>
                    <Table columns={columns} items={promotions} editItem={this._edit} deleteItem={this._delete}/>

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