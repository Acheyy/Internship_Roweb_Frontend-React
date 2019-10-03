import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import classNames from "classnames";
import {FormFeedback, FormGroup, Input, Label} from 'reactstrap';
import {Scrollbars} from "react-custom-scrollbars";
import Checkbox from "./Checkbox";

export default class MultipleSelect extends Component {
    static propTypes = {
        label: PropTypes.string,
        options: PropTypes.array.isRequired,
        selected: PropTypes.array,
        parentsSelected: PropTypes.array,
        selectAll: PropTypes.bool,
        getSelected: PropTypes.func,
        nested: PropTypes.bool,
        hideParent: PropTypes.bool,
        single: PropTypes.bool,
        invalid: PropTypes.bool
    };

    static defaultProps = {
        parentsSelected: []
    };

    state = {
        showOptions: false,
        batchSelectAll: true,
        search: ''
    };

    _openOptions = (e) => {
        const {showOptions} = this.state;

        if (!e.target.matches('.multiple-remove')) {
            this.setState({
                showOptions: !showOptions
            });
        }
    };

    _setSelectRef = (node) => {
        this.selectRef = node;
    };

    _handleClickOutside = (event) => {
        if (!this.selectRef.contains(event.target)) {
            this.setState({
                showOptions: false
            });
        }
    };

    componentDidMount() {
        document.addEventListener('mousedown', this._handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this._handleClickOutside);
    }

    _chooseValue = (id, node = null) => {
        const {getSelected} = this.props;

        let newSelected = [];
        let newParentsSelected = [];

        if (node === null) {
            newSelected = [id];

            getSelected && getSelected(newSelected);
        }

        if (node === 'parent') {
            newParentsSelected = [id];
        }

        if (node === 'child') {
            newSelected = [id];
        }

        getSelected && getSelected(newSelected, newParentsSelected);

        this.setState({
            showOptions: false
        });
    };

    _toggleParentSelected = (isChecked, options, parentId) => {
        const {selected, getSelected, parentsSelected} = this.props;

        let newSelected = [...selected];
        let newParentsSelected = [...parentsSelected];

        if (isChecked) {
            options && options.length > 0 && options.map(child => {
                let index = newSelected.indexOf(child.value);
                if (index > -1) {
                    newSelected = [...newSelected.slice(0, index), ...newSelected.slice(index + 1)];
                }
            });

            let parentIndex = newParentsSelected.indexOf(parentId);

            newParentsSelected = [...newParentsSelected.slice(0, parentIndex), ...newParentsSelected.slice(parentIndex + 1)];
        } else {
            options && options.length > 0 && options.map(child => {
                if (!newSelected.includes(child.value)) {
                    newSelected = [...newSelected, child.value];
                }
            });

            newParentsSelected = [...newParentsSelected, parentId];
        }

        getSelected && getSelected(newSelected, newParentsSelected);
    };

    _toggleSelected = (id, parentId = null) => {
        const {selected, getSelected, options, parentsSelected, single} = this.props;

        let newSelected = [];
        let newParentsSelected = [];

        if (single) {
            newSelected = [id];
        } else {
            if (selected.includes(id)) {
                const index = selected.indexOf(id);

                newSelected = [...selected.slice(0, index), ...selected.slice(index + 1)];

                if (parentId) {
                    let parentIndex = parentsSelected.indexOf(parentId);

                    newParentsSelected = [...parentsSelected.slice(0, parentIndex), ...parentsSelected.slice(parentIndex + 1)];
                }
            } else {
                newSelected = [...selected, id];

                if (parentId) {
                    options && options.length > 0 && options.map(value => {
                        if (value.value === parentId) {
                            if (value.options && value.options.length > 0) {
                                let allIncluded = true;

                                value.options.map(child => {
                                    if (!newSelected.includes(child.value)) {
                                        allIncluded = false;
                                    }
                                });

                                if (allIncluded) {
                                    newParentsSelected = [...parentsSelected, parentId];
                                }
                            }
                        }
                    });
                }
            }
        }

        getSelected && getSelected(newSelected, newParentsSelected);

        if (single) {
            this.setState({
                showOptions: false
            });
        }
    };

    _removeChildParentsSelected = (id, node) => {
        const {selected, parentsSelected, getSelected} = this.props;

        let newSelected = [];
        let newParentsSelected = [];

        if (node === 'parent') {
            const index = parentsSelected.indexOf(id);

            newSelected = [...selected];
            newParentsSelected = [...parentsSelected.slice(0, index), ...parentsSelected.slice(index + 1)];
        }

        if (node === 'child') {
            const index = selected.indexOf(id);

            newSelected = [...selected.slice(0, index), ...selected.slice(index + 1)];
            newParentsSelected = [...parentsSelected];
        }

        this.setState({
            showOptions: false
        });

        getSelected && getSelected(newSelected, newParentsSelected);
    };

    _removeSelected = (id) => {
        const {selected, getSelected} = this.props;

        const index = selected.indexOf(id);

        let newSelected = [...selected.slice(0, index), ...selected.slice(index + 1)];

        this.setState({
            showOptions: false
        });

        getSelected && getSelected(newSelected);
    };

    _selectOption = (id) => {
        const {selected, getSelected} = this.props;

        let newSelected = [...selected, id];

        this.setState({
            showOptions: false
        });

        getSelected && getSelected(newSelected);
    };

    _selectAll = () => {
        const {options, getSelected, nested} = this.props;

        let newSelected = [];
        let newParentsSelected = [];

        options.length > 0 && options.map(value => {
            if (nested) {
                value.options && value.options.length > 0 && value.options.map(child => {
                    newSelected.push(child.value);
                });
                newParentsSelected.push(value.value);
            } else {
                newSelected.push(value.value);
            }
        });

        this.setState({
            batchSelectAll: false
        });

        getSelected && getSelected(newSelected, newParentsSelected);
    };

    _unselectAll = () => {
        const {getSelected} = this.props;

        let newSelected = [];
        let newParentsSelected = [];

        this.setState({
            batchSelectAll: true
        });

        getSelected && getSelected(newSelected, newParentsSelected);
    };

    _search = (name, value) => {
        this.setState({
            search: value
        });
    };

    _searchOptions = (options) => {
        const {search} = this.state;
        const {nested} = this.props;

        if (search === '') {
            return options;
        }

        let newOptions = [];

        if (nested) {
            options.length > 0 && options.map((value, key) => {
                let newChilds = [];

                if (value.label.toLowerCase().indexOf(search.toLowerCase()) >= 0) {
                    newChilds = [...value.options];

                    newOptions.push({
                        value: value.value,
                        label: value.label,
                        options: [...newChilds]
                    });
                } else {
                    if (value.options && value.options.length > 0) {
                        newChilds = value.options.filter(function (child) {
                            return child.label.toLowerCase().indexOf(search.toLowerCase()) >= 0;
                        });
                    }

                    if (newChilds.length > 0 || value.label.toLowerCase().indexOf(search.toLowerCase()) >= 0) {
                        newOptions.push({
                            value: value.value,
                            label: value.label,
                            options: [...newChilds]
                        });
                    }
                }
            });
        } else {
            newOptions = options.filter(function (option) {
                return option.label.toLowerCase().indexOf(search.toLowerCase()) >= 0;
            });
        }

        return newOptions;
    };

    render() {
        const {showOptions, batchSelectAll, search} = this.state;
        const {label, options, selected, selectAll, nested, hideParent, single, parentsSelected, invalid, borderRightNone} = this.props;

        const labelClasses = classNames('multiple-label', {
            'label-focus': showOptions === true || selected.length > 0 || selectAll || (!selectAll && !single && parentsSelected.length > 0)
        });

        let searchOptions = this._searchOptions(options);

        return (
            <div className={'multiple-holder'} ref={this._setSelectRef}>
                {invalid && <FormFeedback>Eroare</FormFeedback>}
                <div className={'multiple-holder-input'} onClick={e => this._openOptions(e)}>
                    {label && <label className={labelClasses}>{label}</label>}
                    <div
                        className={`multiple-input ${invalid ? 'invalid' : ''}${borderRightNone ? ' border-right-none' : ''}`}>
                        {!selectAll && !single && searchOptions.length > 0 && searchOptions.map((value, key) => {
                            if (nested) {
                                if (parentsSelected.includes(value.value)) {
                                    return <div className={'multiple-container'} key={key}>
                                        <div className={'multiple-selected'}>{value.label}</div>
                                        <div className={'multiple-remove'}
                                             onClick={() => this._removeChildParentsSelected(value.value, 'parent')}>
                                            x</div>
                                    </div>;
                                }

                                return <Fragment key={key}>
                                    {value.options && value.options.length > 0 && value.options.map((child, k) => {
                                        if (selected.includes(child.value)) {
                                            return <div className={'multiple-container'} key={k}>
                                                <div className={'multiple-selected'}>{child.label}</div>
                                                <div className={'multiple-remove'}
                                                     onClick={() => this._removeChildParentsSelected(child.value, 'child')}>
                                                    x</div>
                                            </div>;
                                        }
                                    })}
                                </Fragment>;
                            } else {
                                if (selected.includes(value.value)) {
                                    return <div className={'multiple-container'} key={key}>
                                        <div className={'multiple-selected'}>{value.label}</div>
                                        <div className={'multiple-remove'}
                                             onClick={() => this._removeSelected(value.value)}>x</div>
                                    </div>;
                                }
                            }
                        })}
                        {selectAll &&
                        <div className={'multiple-selected count-selected'}>{selected.length} selected</div>}
                        {single && selected.length > 0 && options.length > 0 && options.map((value, key) => {
                            if (nested) {
                                return <Fragment key={key}>
                                    {value.options && value.options.length > 0 && value.options.map((child, k) => {
                                        if (selected.includes(child.value)) {
                                            return <div className={'multiple-selected'} key={k}>{child.label}</div>;
                                        }
                                    })}
                                </Fragment>;
                            } else {
                                return <Fragment key={key}>
                                    {selected.includes(value.value) &&
                                    <div className={'multiple-selected'}>{value.label}</div>}
                                </Fragment>;
                            }
                        })}
                    </div>
                </div>
                {showOptions && <div className={'multiple-options'}>
                    {selectAll && batchSelectAll && options.length > 0 &&
                    <div className={'multiple-option select-all'}
                         onClick={this._selectAll}>Select all</div>}
                    {selectAll && !batchSelectAll && options.length > 0 &&
                    <div className={'multiple-option select-all'}
                         onClick={this._unselectAll}>Unselect all</div>}
                    {options.length === 0 &&
                    <div className={'multiple-container'}>
                        <div className={'multiple-option no-option'}>No option.</div>
                    </div>}
                    {options.length > 0 && <div className={'multiple-search-options'}>
                        <FormGroup>
                            <Label for="searchx" ></Label>
                            <Input className={'multiple-search-input'} placeholder="Search.." type="text" name="search" id="searchx"
                                   value={search} onChange={this._search}/>
                        </FormGroup>
                    </div>}
                    {search !== '' && searchOptions.length === 0 &&
                    <div className={'multiple-container'}>
                        <div className={'multiple-option no-option'}>No result.</div>
                    </div>}
                    <Scrollbars autoHeight={true} autoHeightMax={300}>
                        {searchOptions.length > 0 && searchOptions.map((value, key) => {
                            if (!selectAll && !single) {
                                if (nested) {
                                    if (hideParent && (!value.options || value.options.length === 0)) {
                                        return null;
                                    }

                                    let checked = false;

                                    if (value.options && value.options.length > 0) {
                                        checked = true;

                                        value.options.map(child => {
                                            if (!selected.includes(child.value)) {
                                                checked = false;
                                            }
                                        });
                                    }

                                    return (
                                        <Fragment key={key}>
                                            <div className={'multiple-option'} key={key}
                                                 onClick={() => this._chooseValue(value.value, 'parent')}>
                                                <span>{value.label}</span>
                                            </div>
                                            {value.options && value.options.length > 0 && value.options.map((child, k) => {
                                                return (
                                                    <div className={'multiple-option child'} key={k}
                                                         onClick={() => this._chooseValue(child.value, 'child')}>
                                                        <span>{child.label}</span>
                                                    </div>
                                                );
                                            })}
                                        </Fragment>
                                    );
                                } else {
                                    return (
                                        <div className={'multiple-option'} key={key}
                                             onClick={() => this._chooseValue(value.value)}>
                                            <span>{value.label}</span>
                                        </div>
                                    );
                                }
                            }
                            if (selectAll) {
                                if (nested) {
                                    if (hideParent && (!value.options || value.options.length === 0)) {
                                        return null;
                                    }

                                    let checked = false;

                                    if (value.options && value.options.length > 0) {
                                        checked = true;

                                        value.options.map(child => {
                                            if (!selected.includes(child.value)) {
                                                checked = false;
                                            }
                                        });
                                    }

                                    return (
                                        <Fragment key={key}>
                                            <div className={'multiple-option checkbox-container nested-parent'}
                                                 onClick={() => this._toggleParentSelected(checked, value.options, value.value)}>
                                                <Checkbox checked={checked}/>
                                                <span>{value.label}</span>
                                            </div>
                                            {value.options && value.options.length > 0 && value.options.map((child, k) => {
                                                return (
                                                    <div className={'multiple-option checkbox-container child'} key={k}
                                                         onClick={() => this._toggleSelected(child.value, value.value)}>
                                                        <Checkbox checked={selected.includes(child.value)}/>
                                                        <span>{child.label}</span>
                                                    </div>
                                                );
                                            })}
                                        </Fragment>
                                    );
                                } else {
                                    return (
                                        <div className={'multiple-option checkbox-container'} key={key}
                                             onClick={() => this._toggleSelected(value.value)}>
                                            <Checkbox checked={selected.includes(value.value)}/>
                                            <span>{value.label}</span>
                                        </div>
                                    );
                                }
                            }

                            if (single) {
                                if (nested) {
                                    if (hideParent && (!value.options || value.options.length === 0)) {
                                        return null;
                                    }

                                    return (
                                        <Fragment key={key}>
                                            <div className={'multiple-option nested-parent'}>
                                                <span>{value.label}</span>
                                            </div>
                                            {value.options && value.options.length > 0 && value.options.map((child, k) => {
                                                return (
                                                    <div className={'multiple-option child'} key={k}
                                                         onClick={() => this._toggleSelected(child.value, value.value)}>
                                                        <span>{child.label}</span>
                                                    </div>
                                                );
                                            })}
                                        </Fragment>
                                    );
                                } else {
                                    return (
                                        <div className={'multiple-option checkbox-container'} key={key}
                                             onClick={() => this._toggleSelected(value.value)}>
                                            <span>{value.label}</span>
                                        </div>
                                    );
                                }
                            }
                        })}
                    </Scrollbars>
                </div>}
            </div>
        );
    }
}
